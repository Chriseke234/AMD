-- 1. Execute AI-generated SELECT queries securely on 'data' schema
CREATE OR REPLACE FUNCTION execute_ai_query(sql_query TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result JSONB;
BEGIN
    -- Basic safety check: only allow SELECT
    IF NOT (LOWER(sql_query) LIKE 'select%') THEN
        RAISE EXCEPTION 'Only SELECT queries are allowed.';
    END IF;

    EXECUTE 'SELECT json_agg(t) FROM (' || sql_query || ') t' INTO result;
    RETURN COALESCE(result, '[]'::jsonB);
END;
$$;

-- 2. Create dynamic tables for new datasets
CREATE OR REPLACE FUNCTION create_dataset_table(p_table_name TEXT, p_columns JSONB)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    col_def TEXT;
    col RECORD;
BEGIN
    col_def := '';
    FOR col IN SELECT * FROM jsonb_to_recordset(p_columns) AS x(name TEXT, type TEXT) LOOP
        col_def := col_def || quote_ident(col.name) || ' ' || col.type || ',';
    END LOOP;
    col_def := RTRIM(col_def, ',');

    EXECUTE 'CREATE TABLE IF NOT EXISTS data.' || quote_ident(p_table_name) || ' (' || col_def || ')';
END;
$$;

-- 3. Insert data into dynamic tables
CREATE OR REPLACE FUNCTION insert_dataset_data(p_table_name TEXT, p_data JSONB)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    EXECUTE 'INSERT INTO data.' || quote_ident(p_table_name) || ' SELECT * FROM jsonb_populate_recordset(null::data.' || quote_ident(p_table_name) || ', $1)'
    USING p_data;
END;
$$;
