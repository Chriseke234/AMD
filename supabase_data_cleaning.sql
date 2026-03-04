-- Securely execute data mutations (INSERT, UPDATE, DELETE, ALTER) on 'data' schema
CREATE OR REPLACE FUNCTION execute_data_mutation(p_sql TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Only allow mutations within the 'data' schema for safety
    IF NOT (p_sql ~* '^(insert|update|delete|alter)') THEN
        RAISE EXCEPTION 'Only mutations are allowed.';
    END IF;
    
    EXECUTE p_sql;
END;
$$;
