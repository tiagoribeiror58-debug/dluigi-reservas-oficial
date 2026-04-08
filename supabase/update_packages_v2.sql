-- =============================================================
-- Atualização V2: Múltiplas imagens, Preço e Flexibilidade Form
-- =============================================================

DO $$
BEGIN
    -- Adicionar array de imagens
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='packages' AND column_name='image_urls') THEN
        ALTER TABLE public.packages ADD COLUMN image_urls text[] DEFAULT '{}';
    END IF;

    -- Adicionar campo opcional de preço
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='packages' AND column_name='price') THEN
        ALTER TABLE public.packages ADD COLUMN price text DEFAULT '';
    END IF;

    -- Adicionar campos visíveis no form
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='packages' AND column_name='visible_fields') THEN
        -- Por padrão, todos os campos são exibidos para pacotes antigos
        ALTER TABLE public.packages ADD COLUMN visible_fields text[] DEFAULT '{"guests", "date", "time", "eventType", "buffet", "notes", "birthday"}';
    END IF;

END $$;
