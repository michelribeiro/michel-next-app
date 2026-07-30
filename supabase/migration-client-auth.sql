-- Criar tabela de usuários clientes (autenticação)
CREATE TABLE IF NOT EXISTS client_users (
  id BIGSERIAL PRIMARY KEY,
  client_id BIGINT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trigger para updated_at
CREATE TRIGGER update_client_users_updated_at
  BEFORE UPDATE ON client_users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Criar tabela de sessões
CREATE TABLE IF NOT EXISTS client_sessions (
  id BIGSERIAL PRIMARY KEY,
  client_user_id BIGINT NOT NULL REFERENCES client_users(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL
);

-- RLS
ALTER TABLE client_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir tudo para servidor client_users" ON client_users
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Permitir tudo para servidor client_sessions" ON client_sessions
  FOR ALL USING (true) WITH CHECK (true);
