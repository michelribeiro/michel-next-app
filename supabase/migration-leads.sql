CREATE TABLE IF NOT EXISTS leads (
  id BIGSERIAL PRIMARY KEY,
  client_id BIGINT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT DEFAULT '',
  whatsapp TEXT NOT NULL,
  origin TEXT NOT NULL CHECK (origin IN ('compra', 'newsletter', 'ia_chat', 'manual')),
  qualified BOOLEAN NOT NULL DEFAULT false,
  product_interest TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS update_leads_updated_at ON leads;
CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Permitir tudo para servidor leads" ON leads;
CREATE POLICY "Permitir tudo para servidor leads" ON leads
  FOR ALL USING (true) WITH CHECK (true);
