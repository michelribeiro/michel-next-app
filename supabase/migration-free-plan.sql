-- Adicionar coluna free_until na tabela clients
ALTER TABLE clients 
ADD COLUMN IF NOT EXISTS free_until TIMESTAMPTZ;

-- Atualizar check do plan para incluir 'free'
ALTER TABLE clients 
DROP CONSTRAINT IF EXISTS clients_plan_check;

ALTER TABLE clients 
ADD CONSTRAINT clients_plan_check 
CHECK (plan IN ('free', 'basic', 'evolution', 'pro'));
