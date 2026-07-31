-- Adicionar coluna settings (JSONB) para configurações do cliente
ALTER TABLE clients 
ADD COLUMN IF NOT EXISTS settings JSONB DEFAULT '{}'::jsonb;
