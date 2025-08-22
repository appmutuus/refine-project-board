-- Fix remaining security issues and complete RLS setup

-- Enable RLS on any remaining tables that might need it
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Fix remaining function search paths
CREATE OR REPLACE FUNCTION public.validate_transaction_data()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
BEGIN
  -- Bereinige Beschreibungstext
  IF NEW.description IS NOT NULL THEN
    NEW.description = trim(NEW.description);
  END IF;
  
  -- Setze Standardwerte für fehlende Felder
  IF NEW.status IS NULL THEN
    NEW.status = 'pending';
  END IF;
  
  -- Validiere Beziehungen
  IF NEW.job_id IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM public.jobs WHERE id = NEW.job_id
  ) THEN
    RAISE EXCEPTION 'Ungültige job_id: %', NEW.job_id;
  END IF;
  
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.can_access_job(user_id uuid, job_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
DECLARE
  user_karma INTEGER;
  user_rank public.user_rank;
  job_required_karma INTEGER;
  job_required_rank public.user_rank;
BEGIN
  -- Get user stats
  SELECT karma_points, rank INTO user_karma, user_rank
  FROM public.profiles
  WHERE id = user_id;
  
  -- Get job requirements
  SELECT required_karma, required_rank INTO job_required_karma, job_required_rank
  FROM public.jobs
  WHERE id = job_id;
  
  -- Check if user meets requirements
  RETURN user_karma >= job_required_karma AND user_rank >= job_required_rank;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_user_streak(user_id uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$ 
BEGIN
  UPDATE public.profiles 
  SET 
    last_active = now(),
    streak_days = CASE
      WHEN last_active::DATE = (now() - INTERVAL '1 day')::DATE THEN streak_days + 1
      WHEN last_active::DATE = now()::DATE THEN streak_days
      ELSE 1
    END
  WHERE id = user_id;
END;
$function$;

CREATE OR REPLACE FUNCTION public.calculate_user_level(user_id uuid)
 RETURNS integer
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$ 
DECLARE
  total_points INTEGER;
  user_level INTEGER;
BEGIN
  SELECT 
    COALESCE(p.karma_points, 0) + 
    COALESCE((SELECT SUM(xp_earned) FROM public.tutorial_progress WHERE tutorial_progress.user_id = p.id), 0)
  INTO total_points
  FROM public.profiles p
  WHERE p.id = user_id;
  
  -- Level calculation: Level 1 = 0-99 points, Level 2 = 100-299, Level 3 = 300-599, etc.
  user_level := CASE
    WHEN total_points < 100 THEN 1
    WHEN total_points < 300 THEN 2
    WHEN total_points < 600 THEN 3
    WHEN total_points < 1000 THEN 4
    WHEN total_points < 1500 THEN 5
    ELSE 6
  END;
  
  RETURN user_level;
END;
$function$;

CREATE OR REPLACE FUNCTION public.perform_advanced_maintenance()
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
DECLARE
  start_time timestamp with time zone;
  end_time timestamp with time zone;
  duration interval;
  result json;
  maintenance_tables text[] := ARRAY[
    'public.profiles',
    'public.jobs',
    'public.job_applications',
    'public.transactions',
    'public.achievements',
    'public.user_achievements',
    'public.activity_log',
    'public.karma_transactions',
    'public.notifications'
  ];
  table_name text;
  success_count int := 0;
  error_count int := 0;
  error_messages text[] := '{}';
  table_stats json;
  index_stats json;
BEGIN
  start_time := clock_timestamp();
  
  -- VACUUM ANALYZE für wichtige Tabellen
  FOREACH table_name IN ARRAY maintenance_tables
  LOOP
    BEGIN
      EXECUTE 'VACUUM ANALYZE ' || table_name;
      success_count := success_count + 1;
    EXCEPTION WHEN OTHERS THEN
      error_count := error_count + 1;
      error_messages := array_append(error_messages, 'Fehler bei ' || table_name || ': ' || SQLERRM);
    END;
  END LOOP;
  
  -- Sammle Tabellenstatistiken
  SELECT json_agg(t) INTO table_stats
  FROM public.get_table_sizes() t;
  
  -- Sammle Informationen über ungenutzte Indizes
  SELECT json_agg(i) INTO index_stats
  FROM public.find_unused_indexes() i;
  
  -- Aktualisiere Statistiken für den Query-Planer
  BEGIN
    EXECUTE 'ANALYZE';
  EXCEPTION WHEN OTHERS THEN
    error_count := error_count + 1;
    error_messages := array_append(error_messages, 'Fehler bei ANALYZE: ' || SQLERRM);
  END;
  
  end_time := clock_timestamp();
  duration := end_time - start_time;
  
  -- Protokolliere die Wartung
  BEGIN
    INSERT INTO public.activity_log (
      user_id, 
      action, 
      description, 
      metadata,
      created_at
    ) VALUES (
      '00000000-0000-0000-0000-000000000000'::uuid, -- System-ID
      'maintenance', 
      'Erweiterte Datenbankwartung durchgeführt: ' || success_count || ' Tabellen erfolgreich, ' || 
      error_count || ' Fehler in ' || duration::text,
      jsonb_build_object(
        'tables_processed', success_count,
        'errors', error_count,
        'duration_ms', extract(epoch from duration) * 1000
      ),
      now()
    );
  EXCEPTION WHEN OTHERS THEN
    error_count := error_count + 1;
    error_messages := array_append(error_messages, 'Fehler beim Protokollieren: ' || SQLERRM);
  END;
  
  -- Ergebnis zurückgeben
  result := json_build_object(
    'success', (error_count = 0),
    'tables_processed', success_count,
    'errors', error_count,
    'error_messages', error_messages,
    'duration_ms', extract(epoch from duration) * 1000,
    'table_statistics', table_stats,
    'unused_indexes', index_stats,
    'timestamp', now()
  );
  
  RETURN result;
END;
$function$;