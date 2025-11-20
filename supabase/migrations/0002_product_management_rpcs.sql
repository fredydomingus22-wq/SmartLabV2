-- supabase/migrations/0002_product_management_rpcs.sql

-- Function to create a new product
CREATE OR REPLACE FUNCTION lims.create_product(
    p_product_code TEXT,
    p_name TEXT,
    p_category TEXT,
    p_status TEXT
)
RETURNS lims.products
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    new_product lims.products;
BEGIN
    INSERT INTO lims.products (product_code, name, category, status)
    VALUES (p_product_code, p_name, p_category, p_status)
    RETURNING * INTO new_product;
    RETURN new_product;
END;
$$;

-- Function to get all non-deleted products
CREATE OR REPLACE FUNCTION lims.get_products()
RETURNS TABLE (
    id uuid,
    product_code TEXT,
    name TEXT,
    category TEXT,
    status TEXT,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ,
    created_by uuid
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT
        p.id,
        p.product_code,
        p.name,
        p.category,
        p.status,
        p.created_at,
        p.updated_at,
        p.created_by
    FROM lims.products p
    WHERE p.deleted_at IS NULL
    ORDER BY p.created_at DESC;
END;
$$;

-- Function to update an existing product
CREATE OR REPLACE FUNCTION lims.update_product(
    p_id uuid,
    p_product_code TEXT,
    p_name TEXT,
    p_category TEXT,
    p_status TEXT
)
RETURNS lims.products
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    updated_product lims.products;
BEGIN
    UPDATE lims.products
    SET
        product_code = p_product_code,
        name = p_name,
        category = p_category,
        status = p_status
        -- updated_at and updated_by are handled by the trigger
    WHERE id = p_id
    RETURNING * INTO updated_product;
    RETURN updated_product;
END;
$$;


-- Function to soft delete a product
CREATE OR REPLACE FUNCTION lims.delete_product(p_id uuid)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE lims.products
    SET deleted_at = now()
    WHERE id = p_id;
END;
$$;

-- Grant usage on the schema to the authenticated role
GRANT USAGE ON SCHEMA lims TO authenticated;

-- Grant execute permissions on the functions to the authenticated role
GRANT EXECUTE ON FUNCTION lims.create_product(TEXT, TEXT, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION lims.get_products() TO authenticated;
GRANT EXECUTE ON FUNCTION lims.update_product(uuid, TEXT, TEXT, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION lims.delete_product(uuid) TO authenticated;
