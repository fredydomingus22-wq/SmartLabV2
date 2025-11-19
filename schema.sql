-- Arquivo: schema.sql
-- Projeto: SMARTLIMS ENTERPRISE 4.0
-- Módulo: Core LIMS & Auditoria
-- Descrição: Script inicial para a criação de schemas, tabelas core, e sistema de auditoria.

-- 1. CRIAÇÃO DE SCHEMAS
CREATE SCHEMA IF NOT EXISTS lims;
CREATE SCHEMA IF NOT EXISTS lims_audit;

-- 2. GESTÃO DE UTILIZADORES E PERMISSÕES (RBAC)
-- Tabela de Perfis (Roles)
CREATE TABLE IF NOT EXISTS lims.roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de associação Utilizador-Perfil
CREATE TABLE IF NOT EXISTS lims.user_roles (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role_id UUID REFERENCES lims.roles(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id),
    assigned_at TIMESTAMPTZ DEFAULT NOW()
);

-- Helper function to get user's role
CREATE OR REPLACE FUNCTION lims.get_user_role(p_user_id UUID)
RETURNS TEXT AS $$
DECLARE
    role_name TEXT;
BEGIN
    SELECT name INTO role_name
    FROM lims.roles r
    JOIN lims.user_roles ur ON r.id = ur.role_id
    WHERE ur.user_id = p_user_id
    LIMIT 1;
    RETURN role_name;
END;
$$ LANGUAGE plpgsql;


-- 3. TABELAS CORE LIMS (com colunas de tracking)
-- Tabela de Produtos
CREATE TABLE IF NOT EXISTS lims.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    category TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    updated_by UUID REFERENCES auth.users(id)
);

-- Tabela de Especificações
CREATE TABLE IF NOT EXISTS lims.specifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES lims.products(id) ON DELETE CASCADE,
    version INT NOT NULL,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'archived', 'draft')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    updated_by UUID REFERENCES auth.users(id),
    UNIQUE (product_id, version)
);

-- Tabela de Parâmetros
CREATE TABLE IF NOT EXISTS lims.parameters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    code TEXT UNIQUE NOT NULL,
    type TEXT CHECK (type IN ('physico_chemical', 'micro', 'sensory', 'packaging')),
    unit TEXT,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    updated_by UUID REFERENCES auth.users(id)
);

-- Tabela de Métodos
CREATE TABLE IF NOT EXISTS lims.methods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    code TEXT UNIQUE NOT NULL,
    instrument_required BOOLEAN DEFAULT FALSE,
    validation_required BOOLEAN DEFAULT FALSE,
    sop_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    updated_by UUID REFERENCES auth.users(id)
);

-- Tabela de Parâmetros de Especificação
CREATE TABLE IF NOT EXISTS lims.spec_parameters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    spec_id UUID REFERENCES lims.specifications(id) ON DELETE CASCADE,
    parameter_id UUID REFERENCES lims.parameters(id),
    method_id UUID REFERENCES lims.methods(id),
    min_value NUMERIC,
    max_value NUMERIC,
    target_value NUMERIC,
    unit TEXT,
    criticality TEXT CHECK (criticality IN ('critical', 'major', 'minor')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    updated_by UUID REFERENCES auth.users(id)
);

-- Tabela de Linhas de Produção
CREATE TABLE IF NOT EXISTS lims.lines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    line_code TEXT UNIQUE NOT NULL,
    location TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'maintenance')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    updated_by UUID REFERENCES auth.users(id)
);

-- Tabela de Tanques
CREATE TABLE IF NOT EXISTS lims.tanks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tank_code TEXT UNIQUE NOT NULL,
    line_id UUID REFERENCES lims.lines(id),
    volume_liters NUMERIC,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    updated_by UUID REFERENCES auth.users(id)
);

-- Tabela de Amostras
CREATE TABLE IF NOT EXISTS lims.samples (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sample_code TEXT UNIQUE NOT NULL,
    sample_type TEXT CHECK (sample_type IN ('raw_material', 'process', 'intermediate', 'finished', 'water', 'micro')),
    product_id UUID REFERENCES lims.products(id),
    line_id UUID REFERENCES lims.lines(id),
    tank_id UUID REFERENCES lims.tanks(id),
    batch_no TEXT,
    collection_point TEXT,
    collected_at TIMESTAMPTZ NOT NULL,
    status TEXT DEFAULT 'planned' CHECK (status IN ('planned', 'collected', 'in_analysis', 'validated', 'approved', 'rejected')),
    priority INT DEFAULT 0,
    haccp_trigger BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    updated_by UUID REFERENCES auth.users(id)
);

-- Tabela de Eventos de Amostra
CREATE TABLE IF NOT EXISTS lims.sample_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sample_id UUID REFERENCES lims.samples(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    event_data JSONB,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de Análises
CREATE TABLE IF NOT EXISTS lims.analysis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sample_id UUID REFERENCES lims.samples(id) ON DELETE CASCADE,
    parameter_id UUID REFERENCES lims.parameters(id),
    method_id UUID REFERENCES lims.methods(id),
    analyst_id UUID REFERENCES auth.users(id),
    equipment_id UUID, -- Referenciará a tabela de equipamentos no futuro
    started_at TIMESTAMPTZ,
    finished_at TIMESTAMPTZ,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'validated', 'rejected')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    updated_by UUID REFERENCES auth.users(id)
);

-- Tabela de Resultados de Análise
CREATE TABLE IF NOT EXISTS lims.analysis_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    analysis_id UUID REFERENCES lims.analysis(id) ON DELETE CASCADE,
    raw_value NUMERIC,
    final_value NUMERIC NOT NULL,
    unit TEXT,
    within_limits BOOLEAN,
    deviation_type TEXT CHECK (deviation_type IN ('none', 'minor', 'major', 'critical')),
    trend_position TEXT CHECK (trend_position IN ('above', 'below', 'stable')),
    validated_by UUID REFERENCES auth.users(id),
    validated_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    updated_by UUID REFERENCES auth.users(id)
);

-- 4. SISTEMA DE AUDITORIA
-- Tabela de Logs de Auditoria
CREATE TABLE IF NOT EXISTS lims_audit.audit_logs (
    id BIGSERIAL PRIMARY KEY,
    table_name TEXT NOT NULL,
    record_id UUID NOT NULL,
    action TEXT NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
    old_data JSONB,
    new_data JSONB,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    user_id UUID REFERENCES auth.users(id)
);

-- Função de Trigger Genérica para Auditoria
CREATE OR REPLACE FUNCTION lims_audit.log_changes()
RETURNS TRIGGER AS $$
DECLARE
    old_row JSONB;
    new_row JSONB;
BEGIN
    IF (TG_OP = 'UPDATE') THEN
        old_row = to_jsonb(OLD);
        new_row = to_jsonb(NEW);
        INSERT INTO lims_audit.audit_logs (table_name, record_id, action, old_data, new_data, user_id)
        VALUES (TG_TABLE_NAME, OLD.id, TG_OP, old_row, new_row, auth.uid());
        RETURN NEW;
    ELSIF (TG_OP = 'DELETE') THEN
        old_row = to_jsonb(OLD);
        INSERT INTO lims_audit.audit_logs (table_name, record_id, action, old_data, user_id)
        VALUES (TG_TABLE_NAME, OLD.id, TG_OP, old_row, auth.uid());
        RETURN OLD;
    ELSIF (TG_OP = 'INSERT') THEN
        new_row = to_jsonb(NEW);
        INSERT INTO lims_audit.audit_logs (table_name, record_id, action, new_data, user_id)
        VALUES (TG_TABLE_NAME, NEW.id, TG_OP, new_row, auth.uid());
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- 5. APLICAÇÃO DOS TRIGGERS DE AUDITORIA
-- Função para criar trigger se não existir
CREATE OR REPLACE PROCEDURE lims_audit.create_audit_trigger(p_table_name TEXT)
LANGUAGE plpgsql AS $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_trigger
        WHERE tgname = 'audit_trigger' AND tgrelid = ('lims.' || p_table_name)::regclass
    ) THEN
        EXECUTE format(
            'CREATE TRIGGER audit_trigger
            AFTER INSERT OR UPDATE OR DELETE ON lims.%I
            FOR EACH ROW EXECUTE FUNCTION lims_audit.log_changes()',
            p_table_name
        );
    END IF;
END;
$$;

-- Aplicar triggers às tabelas
CALL lims_audit.create_audit_trigger('products');
CALL lims_audit.create_audit_trigger('specifications');
CALL lims_audit.create_audit_trigger('spec_parameters');
CALL lims_audit.create_audit_trigger('parameters');
CALL lims_audit.create_audit_trigger('methods');
CALL lims_audit.create_audit_trigger('lines');
CALL lims_audit.create_audit_trigger('tanks');
CALL lims_audit.create_audit_trigger('samples');
CALL lims_audit.create_audit_trigger('analysis');
CALL lims_audit.create_audit_trigger('analysis_results');

-- 6. TABELAS DE NÃO CONFORMIDADES (NC) E CAPA
-- Tabela de Não Conformidades
CREATE TABLE IF NOT EXISTS lims.nc (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nc_code TEXT UNIQUE NOT NULL,
    sample_id UUID REFERENCES lims.samples(id),
    analysis_id UUID REFERENCES lims.analysis(id),
    type TEXT CHECK (type IN ('critical', 'major', 'minor')),
    root_cause TEXT,
    risk_level TEXT CHECK (risk_level IN ('low', 'medium', 'high')),
    status TEXT DEFAULT 'open' CHECK (status IN ('open', 'investigation', 'corrective_action', 'closed')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    updated_by UUID REFERENCES auth.users(id)
);

-- Tabela de Ações Corretivas/Preventivas (CAPA)
CREATE TABLE IF NOT EXISTS lims.capa (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nc_id UUID REFERENCES lims.nc(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    responsible UUID REFERENCES auth.users(id),
    due_date DATE,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'verified')),
    verification_result TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    updated_by UUID REFERENCES auth.users(id)
);

-- 7. TABELAS DE HACCP / FSSC 22000
-- Tabela de Plano HACCP
CREATE TABLE IF NOT EXISTS lims.haccp_plan (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    version INT NOT NULL,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'archived', 'draft')),
    approved_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    updated_by UUID REFERENCES auth.users(id)
);

-- Tabela de PCCs e OPRPs
CREATE TABLE IF NOT EXISTS lims.pcc_oprp (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_id UUID REFERENCES lims.haccp_plan(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('PCC', 'OPRP')),
    line_id UUID REFERENCES lims.lines(id),
    parameter_id UUID REFERENCES lims.parameters(id),
    limit_min NUMERIC,
    limit_max NUMERIC,
    corrective_action TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    updated_by UUID REFERENCES auth.users(id)
);

-- Tabela de Eventos de Monitorização HACCP
CREATE TABLE IF NOT EXISTS lims.haccp_monitoring_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pcc_id UUID REFERENCES lims.pcc_oprp(id) ON DELETE CASCADE,
    value NUMERIC NOT NULL,
    unit TEXT,
    timestamp TIMESTAMPTZ NOT NULL,
    operator_id UUID REFERENCES auth.users(id),
    status TEXT CHECK (status IN ('ok', 'deviation')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

-- 8. APLICAÇÃO ADICIONAL DE TRIGGERS DE AUDITORIA
CALL lims_audit.create_audit_trigger('nc');
CALL lims_audit.create_audit_trigger('capa');
CALL lims_audit.create_audit_trigger('haccp_plan');
CALL lims_audit.create_audit_trigger('pcc_oprp');
CALL lims_audit.create_audit_trigger('haccp_monitoring_events');

-- Fim do script
