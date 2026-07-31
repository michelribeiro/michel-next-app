-- Adicionar coluna features (JSONB) na tabela clients
ALTER TABLE clients 
ADD COLUMN IF NOT EXISTS features JSONB;

-- Atualizar check do plan
ALTER TABLE clients 
DROP CONSTRAINT IF EXISTS clients_plan_check;

ALTER TABLE clients 
ADD CONSTRAINT clients_plan_check 
CHECK (plan IN ('free', 'basic', 'evolution', 'pro'));
