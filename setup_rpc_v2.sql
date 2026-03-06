-- AskMyData Security Hardening: RPC v2
-- This script upgrades the naive SECURITY DEFINER functions to use Row Level Security appropriately.

-- 1. Secure AI Query Execution (Runs as the invoking user, respecting RLS)
-- NOTE: Before using this, ensure dynamic tables created in 'data' schema 
-- have a user_id column and RLS enabled.
CREATE OR REPLACE FUNCTION execute_ai_query_secure(sql_query TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY INVOKER -- This ensures the query runs as the authenticated user, NOT a superuser.
AS $$
DECLARE
    result JSONB;
BEGIN
    IF NOT (LOWER(sql_query) LIKE 'select%') THEN
        RAISE EXCEPTION 'Only SELECT queries are allowed.';
    END IF;

    EXECUTE 'SELECT json_agg(t) FROM (' || sql_query || ') t' INTO result;
    return COALESCE(result, '[]'::jsonb);
END;
$$;

-- Example of how to create an RLS-enabled dynamic table
CREATE OR REPLACE FUNCTION create_secure_dataset_table(p_table_name TEXT, p_columns JSONB)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    col_def TEXT;
    col RECORD;
    clean_table_name TEXT;
BEGIN
    clean_table_name := quote_ident(p_table_name);
    col_def := '';
    FOR col IN SELECT * FROM jsonb_to_recordset(p_columns) AS x(name TEXT, type TEXT) LOOP
        col_def := col_def || quote_ident(col.name) || ' ' || col.type || ',';
    END LOOP;
    
    -- We add user_id automatically to link the row to the dataset owner
    EXECUTE 'CREATE TABLE IF NOT EXISTS data.' || clean_table_name || ' (' || col_def || ' user_id UUID DEFAULT auth.uid() NOT NULL)';
    
    -- Enable RLS
    EXECUTE 'ALTER TABLE data.' || clean_table_name || ' ENABLE ROW LEVEL SECURITY';
    
    -- Create policy so users can only see their own rows in this dynamic table
    EXECUTE 'CREATE POLICY ' || clean_table_name || '_isolation_policy ON data.' || clean_table_name || ' FOR ALL USING (user_id = auth.uid())';
END;
$$;
