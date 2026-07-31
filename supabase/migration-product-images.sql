-- Adicionar coluna images (JSONB) para até 2 imagens por produto
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]'::jsonb;
