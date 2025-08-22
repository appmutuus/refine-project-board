-- Check which table still needs RLS enabled
-- This will show us exactly which table is missing RLS

-- Enable RLS on any remaining tables that might be missing it
DO $$
DECLARE
    table_name text;
BEGIN
    -- Enable RLS on all public tables that don't have it yet
    FOR table_name IN
        SELECT t.table_name 
        FROM information_schema.tables t
        LEFT JOIN pg_class c ON c.relname = t.table_name
        LEFT JOIN pg_namespace n ON n.oid = c.relnamespace
        WHERE t.table_schema = 'public' 
        AND t.table_type = 'BASE TABLE'
        AND n.nspname = 'public'
        AND NOT c.relrowsecurity
    LOOP
        EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', table_name);
        RAISE NOTICE 'Enabled RLS on table: %', table_name;
    END LOOP;
END $$;

-- Add any missing policies for critical tables
CREATE POLICY "System can manage app config" ON public.app_config
  FOR ALL USING (true);