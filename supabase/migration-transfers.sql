CREATE TABLE IF NOT EXISTS transfers (
  id BIGSERIAL PRIMARY KEY,
  client_id BIGINT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  payment_id TEXT NOT NULL,
  value DECIMAL(10,2) NOT NULL,
  pix_key TEXT NOT NULL,
  transfer_id TEXT DEFAULT '',
  status TEXT DEFAULT 'PENDING',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE transfers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Permitir tudo para servidor transfers" ON transfers;
CREATE POLICY "Permitir tudo para servidor transfers" ON transfers
  FOR ALL USING (true) WITH CHECK (true);
