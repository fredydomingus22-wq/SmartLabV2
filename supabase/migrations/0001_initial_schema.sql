-- Create LIMS schemas
CREATE SCHEMA IF NOT EXISTS lims;
CREATE SCHEMA IF NOT EXISTS lims_audit;

-- Utility function to update metadata on change
CREATE OR REPLACE FUNCTION public.update_metadata_on_change()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    NEW.updated_by = auth.uid();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- LIMS MASTER DATA TABLES
-- Schema: lims

-- Products Table
CREATE TABLE IF NOT EXISTS lims.products (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    product_code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    category TEXT,
    status TEXT CHECK(status IN ('active', 'inactive')) DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ,
    deleted_at TIMESTAMPTZ,
    created_by uuid DEFAULT auth.uid(),
    updated_by uuid
);

-- Specifications Table
CREATE TABLE IF NOT EXISTS lims.specifications (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id uuid REFERENCES lims.products(id),
    version INT NOT NULL,
    status TEXT CHECK(status IN ('active', 'archived')) DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ,
    deleted_at TIMESTAMPTZ,
    created_by uuid DEFAULT auth.uid(),
    updated_by uuid,
    UNIQUE(product_id, version)
);

-- Parameters Table
CREATE TABLE IF NOT EXISTS lims.parameters (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    code TEXT UNIQUE NOT NULL,
    type TEXT CHECK(type IN ('physico_chemical', 'micro', 'sensory', 'packaging')),
    unit TEXT,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ,
    deleted_at TIMESTAMPTZ,
    created_by uuid DEFAULT auth.uid(),
    updated_by uuid
);

-- Methods Table
CREATE TABLE IF NOT EXISTS lims.methods (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    code TEXT UNIQUE,
    instrument_required BOOLEAN DEFAULT false,
    validation_required BOOLEAN DEFAULT false,
    sop_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ,
    deleted_at TIMESTAMPTZ,
    created_by uuid DEFAULT auth.uid(),
    updated_by uuid
);

-- Specification Parameters Table
CREATE TABLE IF NOT EXISTS lims.spec_parameters (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    spec_id uuid REFERENCES lims.specifications(id),
    parameter_id uuid REFERENCES lims.parameters(id),
    method_id uuid REFERENCES lims.methods(id),
    min_value FLOAT,
    max_value FLOAT,
    target_value FLOAT,
    unit TEXT,
    criticality TEXT CHECK(criticality IN ('critical', 'major', 'minor')),
    stability_profile JSONB,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ,
    deleted_at TIMESTAMPTZ,
    created_by uuid DEFAULT auth.uid(),
    updated_by uuid
);

-- Lines Table
CREATE TABLE IF NOT EXISTS lims.lines (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    line_code TEXT UNIQUE NOT NULL,
    location TEXT,
    status TEXT CHECK(status IN ('active', 'inactive', 'maintenance')),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ,
    deleted_at TIMESTAMPTZ,
    created_by uuid DEFAULT auth.uid(),
    updated_by uuid
);

-- Tanks Table
CREATE TABLE IF NOT EXISTS lims.tanks (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    tank_code TEXT UNIQUE NOT NULL,
    line_id uuid REFERENCES lims.lines(id),
    volume_liters FLOAT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ,
    deleted_at TIMESTAMPTZ,
    created_by uuid DEFAULT auth.uid(),
    updated_by uuid
);


-- AUDIT TRAIL MECHANISM
-- Schema: lims_audit

CREATE TABLE lims_audit.audit_logs (
    id BIGSERIAL PRIMARY KEY,
    table_name TEXT NOT NULL,
    record_id TEXT NOT NULL,
    action TEXT NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
    old_data JSONB,
    new_data JSONB,
    "timestamp" TIMESTAMPTZ NOT NULL DEFAULT now(),
    user_id uuid
);

CREATE OR REPLACE FUNCTION lims_audit.log_changes()
RETURNS TRIGGER AS $$
DECLARE
    v_old_data JSONB;
    v_new_data JSONB;
BEGIN
    IF (TG_OP = 'UPDATE') THEN
        v_old_data := to_jsonb(OLD);
        v_new_data := to_jsonb(NEW);
    ELSIF (TG_OP = 'DELETE') THEN
        v_old_data := to_jsonb(OLD);
        v_new_data := NULL;
    ELSIF (TG_OP = 'INSERT') THEN
        v_old_data := NULL;
        v_new_data := to_jsonb(NEW);
    END IF;

    INSERT INTO lims_audit.audit_logs (table_name, record_id, action, old_data, new_data, user_id)
    VALUES (
        TG_TABLE_SCHEMA || '.' || TG_TABLE_NAME,
        CASE WHEN TG_OP = 'INSERT' THEN NEW.id::text ELSE OLD.id::text END,
        TG_OP,
        v_old_data,
        v_new_data,
        auth.uid()
    );

    IF (TG_OP = 'DELETE') THEN
        RETURN OLD;
    ELSE
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for all tables in the 'lims' schema
DO $$
DECLARE
    t_name TEXT;
BEGIN
    FOR t_name IN (SELECT table_name FROM information_schema.tables WHERE table_schema = 'lims')
    LOOP
        EXECUTE format('CREATE TRIGGER audit_trigger_on_%I
                        AFTER INSERT OR UPDATE OR DELETE ON lims.%I
                        FOR EACH ROW EXECUTE FUNCTION lims_audit.log_changes()',
                       t_name, t_name);
        EXECUTE format('CREATE TRIGGER update_metadata_trigger_on_%I
                        BEFORE UPDATE ON lims.%I
                        FOR EACH ROW EXECUTE FUNCTION public.update_metadata_on_change()',
                       t_name, t_name);
    END LOOP;
END;
$$;
