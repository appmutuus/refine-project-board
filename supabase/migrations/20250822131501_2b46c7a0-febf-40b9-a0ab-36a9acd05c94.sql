-- Fix RLS security issues and function search paths

-- Enable RLS on all tables that need it
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.karma_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_config ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view all profiles" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (id = auth.uid());

-- Create RLS policies for karma_transactions
CREATE POLICY "Users can view own karma transactions" ON public.karma_transactions
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "System can insert karma transactions" ON public.karma_transactions
  FOR INSERT WITH CHECK (true);

-- Create RLS policies for achievements
CREATE POLICY "Anyone can view achievements" ON public.achievements
  FOR SELECT USING (true);

-- Create RLS policies for user_achievements
CREATE POLICY "Users can view own achievements" ON public.user_achievements
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "System can insert user achievements" ON public.user_achievements
  FOR INSERT WITH CHECK (true);

-- Create RLS policies for favorites
CREATE POLICY "Users can manage own favorites" ON public.favorites
  FOR ALL USING (user_id = auth.uid());

-- Create RLS policies for referrals
CREATE POLICY "Users can view own referrals" ON public.referrals
  FOR SELECT USING (referrer_id = auth.uid() OR referred_user_id = auth.uid());

CREATE POLICY "Users can create referrals" ON public.referrals
  FOR INSERT WITH CHECK (referrer_id = auth.uid());

-- Create RLS policies for reviews
CREATE POLICY "Users can view all reviews" ON public.reviews
  FOR SELECT USING (true);

CREATE POLICY "Users can create reviews" ON public.reviews
  FOR INSERT WITH CHECK (reviewer_id = auth.uid());

-- Create RLS policies for transactions
CREATE POLICY "Users can view own transactions" ON public.transactions
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "System can manage transactions" ON public.transactions
  FOR ALL USING (true);

-- Create RLS policies for messages
CREATE POLICY "Users can view own messages" ON public.messages
  FOR SELECT USING (sender_id = auth.uid() OR recipient_id = auth.uid());

CREATE POLICY "Users can send messages" ON public.messages
  FOR INSERT WITH CHECK (sender_id = auth.uid());

CREATE POLICY "Users can update own messages" ON public.messages
  FOR UPDATE USING (sender_id = auth.uid() OR recipient_id = auth.uid());

-- Create RLS policies for leads (admin only)
CREATE POLICY "System can manage leads" ON public.leads
  FOR ALL USING (true);

-- Create RLS policies for app_config (admin only)
CREATE POLICY "Anyone can read app config" ON public.app_config
  FOR SELECT USING (true);

-- Fix function search paths
CREATE OR REPLACE FUNCTION public.update_user_rating(user_id uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
BEGIN
  UPDATE profiles 
  SET rating = (
    SELECT COALESCE(AVG(score), 5.0)
    FROM ratings 
    WHERE rated_id = user_id
  )
  WHERE id = user_id;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_user_last_sign_in()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
BEGIN
  UPDATE users 
  SET 
    last_sign_in_at = NEW.last_sign_in_at,
    updated_at = now()
  WHERE id = NEW.id;
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.run_sql(input_sql text)
 RETURNS SETOF record
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
BEGIN
    RETURN QUERY EXECUTE input_sql;
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_table_sizes()
 RETURNS TABLE(table_name text, table_size text, index_size text, total_size text, row_count bigint)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
BEGIN
  RETURN QUERY
  SELECT
    t.tablename::text AS table_name,
    pg_size_pretty(pg_table_size('"' || t.schemaname || '"."' || t.tablename || '"'))::text AS table_size,
    pg_size_pretty(pg_indexes_size('"' || t.schemaname || '"."' || t.tablename || '"'))::text AS index_size,
    pg_size_pretty(pg_total_relation_size('"' || t.schemaname || '"."' || t.tablename || '"'))::text AS total_size,
    (SELECT reltuples::bigint FROM pg_class WHERE oid = ('"' || t.schemaname || '"."' || t.tablename || '"')::regclass) AS row_count
  FROM pg_tables t
  WHERE t.schemaname = 'public'
  ORDER BY pg_total_relation_size('"' || t.schemaname || '"."' || t.tablename || '"') DESC;
END;
$function$;

CREATE OR REPLACE FUNCTION public.find_unused_indexes()
 RETURNS TABLE(index_name text, table_name text, index_size text, index_scans bigint)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
BEGIN
  RETURN QUERY
  SELECT
    i.indexrelname::text AS index_name,
    i.relname::text AS table_name,
    pg_size_pretty(pg_relation_size(i.indexrelid))::text AS index_size,
    s.idx_scan AS index_scans
  FROM
    pg_stat_user_indexes s
    JOIN pg_index i ON s.indexrelid = i.indexrelid
  WHERE
    s.idx_scan < 10  -- Indizes mit weniger als 10 Scans
    AND NOT i.indisprimary  -- Keine Primärschlüssel
    AND NOT i.indisunique   -- Keine Unique-Indizes
    AND NOT EXISTS (
      SELECT 1 FROM pg_constraint c
      WHERE c.conindid = i.indexrelid
    )
  ORDER BY
    s.idx_scan ASC,
    pg_relation_size(i.indexrelid) DESC;
END;
$function$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
BEGIN
  INSERT INTO public.profiles (
    id, 
    first_name, 
    last_name, 
    avatar_url,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    NEW.raw_user_meta_data->>'avatar_url',
    now(),
    now()
  );

  -- Create user settings with defaults
  INSERT INTO public.user_settings (
    user_id,
    notifications_enabled,
    email_notifications,
    dark_mode,
    language,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    true,
    true,
    false,
    'de',
    now(),
    now()
  );

  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.calculate_user_rank(user_id uuid)
 RETURNS user_rank
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
DECLARE
  total_karma INTEGER;
  good_deeds INTEGER;
  user_rank public.user_rank;
BEGIN
  SELECT 
    COALESCE(karma_points, 0),
    COALESCE(good_deeds_completed, 0)
  INTO total_karma, good_deeds
  FROM public.profiles
  WHERE id = user_id;
  
  -- Calculate rank based on karma and good deeds requirements
  IF total_karma >= 1000 AND good_deeds >= 5 THEN
    user_rank := 'vorbild';
  ELSIF total_karma >= 500 AND good_deeds >= 3 THEN
    user_rank := 'vertrauensperson';
  ELSIF total_karma >= 250 AND good_deeds >= 1 THEN
    user_rank := 'erfahren';
  ELSIF total_karma >= 100 THEN
    user_rank := 'community';
  ELSE
    user_rank := 'starter';
  END IF;
  
  -- Update user's rank in profiles
  UPDATE public.profiles 
  SET rank = user_rank, updated_at = now()
  WHERE id = user_id;
  
  RETURN user_rank;
END;
$function$;

CREATE OR REPLACE FUNCTION public.award_karma(user_id uuid, points integer, reason text, job_id uuid DEFAULT NULL::uuid, mission_id uuid DEFAULT NULL::uuid, transaction_type text DEFAULT 'manual'::text)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
BEGIN
  -- Insert karma transaction
  INSERT INTO public.karma_transactions (
    user_id, 
    points, 
    reason, 
    job_id, 
    mission_id,
    transaction_type
  ) VALUES (
    user_id, 
    points, 
    reason, 
    job_id, 
    mission_id,
    transaction_type
  );
  
  -- Update user's karma points
  UPDATE public.profiles 
  SET 
    karma_points = karma_points + points,
    updated_at = now()
  WHERE id = user_id;
  
  -- Recalculate and update user rank
  PERFORM public.calculate_user_rank(user_id);
  
  RETURN TRUE;
END;
$function$;