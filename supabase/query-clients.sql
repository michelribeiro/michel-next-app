-- Copie e cole no SQL Editor do Supabase
-- https://supabase.com/dashboard/project/ojztlrmdzshcnytvxjoq/sql/new

CREATE TABLE IF NOT EXISTS clients (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  whatsapp TEXT NOT NULL,
  plan TEXT NOT NULL CHECK (plan IN ('basic', 'evolution', 'pro')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'canceled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_clients_updated_at
  BEFORE UPDATE ON clients
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir tudo para servidor" ON clients
  FOR ALL
  USING (true)
  WITH CHECK (true);
