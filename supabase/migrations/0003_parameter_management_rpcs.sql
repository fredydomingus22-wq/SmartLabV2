-- supabase/migrations/0003_parameter_management_rpcs.sql

-- Function to create a new parameter
CREATE OR REPLACE FUNCTION lims.create_parameter(
    p_name TEXT,
    p_code TEXT,
    p_type TEXT,
    p_unit TEXT,
    p_description TEXT
)
RETURNS lims.parameters
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    new_parameter lims.parameters;
BEGIN
    INSERT INTO lims.parameters (name, code, type, unit, description)
    VALUES (p_name, p_code, p_type, p_unit, p_description)
    RETURNING * INTO new_parameter;
    RETURN new_parameter;
END;
$$;

-- Function to get all non-deleted parameters
CREATE OR REPLACE FUNCTION lims.get_parameters()
RETURNS TABLE (
    id uuid,
    name TEXT,
    code TEXT,
    type TEXT,
    unit TEXT,
    description TEXT,
    created_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT
        p.id,
        p.name,
        p.code,
        p.type,
        p.unit,
        p.description,
        p.created_at
    FROM lims.parameters p
    WHERE p.deleted_at IS NULL
    ORDER BY p.name;
END;
$$;

-- Function to update an existing parameter
CREATE OR REPLACE FUNCTION lims.update_parameter(
    p_id uuid,
    p_name TEXT,
    p_code TEXT,
    p_type TEXT,
    p_unit TEXT,
    p_description TEXT
)
RETURNS lims.parameters
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    updated_parameter lims.parameters;
BEGIN
    UPDATE lims.parameters
    SET
        name = p_name,
        code = p_code,
        type = p_type,
        unit = p_unit,
        description = p_description
    WHERE id = p_id
    RETURNING * INTO updated_parameter;
    RETURN updated_parameter;
END;
$$;


-- Function to soft delete a parameter
CREATE OR REPLACE FUNCTION lims.delete_parameter(p_id uuid)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE lims.parameters
    SET deleted_at = now()
    WHERE id = p_id;
END;
$$;

-- Grant execute permissions on the new functions to the authenticated role
GRANT EXECUTE ON FUNCTION lims.create_parameter(TEXT, TEXT, TEXT, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION lims.get_parameters() TO authenticated;
GRANT EXECUTE ON FUNCTION lims.update_parameter(uuid, TEXT, TEXT, TEXT, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION lims.delete_parameter(uuid) TO authenticated;
