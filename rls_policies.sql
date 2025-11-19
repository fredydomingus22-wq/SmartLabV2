-- Arquivo: rls_policies.sql
-- Projeto: SMARTLIMS ENTERPRISE 4.0
-- Módulo: Core LIMS - Segurança
-- Descrição: Políticas de Row-Level Security (RLS) para as tabelas core.

-- 1. HABILITAR RLS NAS TABELAS
ALTER TABLE lims.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE lims.specifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE lims.spec_parameters ENABLE ROW LEVEL SECURITY;
ALTER TABLE lims.parameters ENABLE ROW LEVEL SECURITY;
ALTER TABLE lims.methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE lims.lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE lims.tanks ENABLE ROW LEVEL SECURITY;
ALTER TABLE lims.samples ENABLE ROW LEVEL SECURITY;
ALTER TABLE lims.analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE lims.analysis_results ENABLE ROW LEVEL SECURITY;

-- Remove o acesso público padrão
DROP POLICY IF EXISTS "Enable read access for all users" ON lims.products;
DROP POLICY IF EXISTS "Enable read access for all users" ON lims.specifications;
-- ... (repetir para todas as tabelas se existir uma política pública)

-- 2. DEFINIÇÃO DAS POLÍTICAS POR PERFIL

-- Tabela: products
CREATE POLICY "Allow read access to authenticated users on products"
ON lims.products FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow admin to manage products"
ON lims.products FOR ALL TO authenticated
USING (lims.get_user_role(auth.uid()) = 'admin')
WITH CHECK (lims.get_user_role(auth.uid()) = 'admin');

-- Tabela: specifications
CREATE POLICY "Allow read access to authenticated users on specifications"
ON lims.specifications FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow qa_supervisor or admin to manage specifications"
ON lims.specifications FOR ALL TO authenticated
USING (lims.get_user_role(auth.uid()) IN ('admin', 'qa_supervisor'))
WITH CHECK (lims.get_user_role(auth.uid()) IN ('admin', 'qa_supervisor'));

-- Tabela: samples
CREATE POLICY "Allow lab_tech to manage their own samples"
ON lims.samples FOR ALL TO authenticated
USING (lims.get_user_role(auth.uid()) = 'lab_tech' AND created_by = auth.uid())
WITH CHECK (lims.get_user_role(auth.uid()) = 'lab_tech' AND created_by = auth.uid());

CREATE POLICY "Allow qa_supervisor and admin to view all samples"
ON lims.samples FOR SELECT TO authenticated
USING (lims.get_user_role(auth.uid()) IN ('admin', 'qa_supervisor'));

CREATE POLICY "Allow admin to manage all samples"
ON lims.samples FOR ALL TO authenticated
USING (lims.get_user_role(auth.uid()) = 'admin')
WITH CHECK (lims.get_user_role(auth.uid()) = 'admin');

-- Tabela: analysis
CREATE POLICY "Allow lab_tech to manage their own analysis"
ON lims.analysis FOR ALL TO authenticated
USING (lims.get_user_role(auth.uid()) = 'lab_tech' AND created_by = auth.uid())
WITH CHECK (lims.get_user_role(auth.uid()) = 'lab_tech' AND created_by = auth.uid());

CREATE POLICY "Allow qa_supervisor and admin to view all analysis"
ON lims.analysis FOR SELECT TO authenticated
USING (lims.get_user_role(auth.uid()) IN ('admin', 'qa_supervisor'));

CREATE POLICY "Allow admin to manage all analysis"
ON lims.analysis FOR ALL TO authenticated
USING (lims.get_user_role(auth.uid()) = 'admin')
WITH CHECK (lims.get_user_role(auth.uid()) = 'admin');

-- Tabela: nc
CREATE POLICY "Allow qa_supervisor and admin to manage nc"
ON lims.nc FOR ALL TO authenticated
USING (lims.get_user_role(auth.uid()) IN ('admin', 'qa_supervisor'))
WITH CHECK (lims.get_user_role(auth.uid()) IN ('admin', 'qa_supervisor'));

CREATE POLICY "Allow lab_tech to view related nc"
ON lims.nc FOR SELECT TO authenticated
USING (lims.get_user_role(auth.uid()) = 'lab_tech' AND sample_id IN (SELECT id FROM lims.samples WHERE created_by = auth.uid()));

-- Tabela: haccp_plan
CREATE POLICY "Allow qa_supervisor and admin to manage haccp_plan"
ON lims.haccp_plan FOR ALL TO authenticated
USING (lims.get_user_role(auth.uid()) IN ('admin', 'qa_supervisor'))
WITH CHECK (lims.get_user_role(auth.uid()) IN ('admin', 'qa_supervisor'));

-- Fim do script
