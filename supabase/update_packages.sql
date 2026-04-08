-- =============================================================
-- Atualização: Suporte a Imagens nos Pacotes e Bucket Storage
-- =============================================================

-- 1. Adicionar o campo image_url à tabela packages (se já não existir)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='packages' AND column_name='image_url') THEN
        ALTER TABLE public.packages ADD COLUMN image_url text DEFAULT '';
    END IF;
END $$;

-- 2. Garantir que a tabela storage.buckets existe (padrão Supabase)
-- Criaremos o bucket chamado 'package_images' sendo PÚBLICO
INSERT INTO storage.buckets (id, name, public)
VALUES ('package_images', 'package_images', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Políticas de Segurança do Storage (RLS)

-- Todo mundo pode 'LER' as imagens de pacotes (landing page)
CREATE POLICY "Público pode ler as imagens"
ON storage.objects FOR SELECT
USING ( bucket_id = 'package_images' );

-- Admins logados podem INSERIR imagens
CREATE POLICY "Admin pode inserir imagens"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'package_images' );

-- Admins logados podem DELETAR/ATUALIZAR as imagens
CREATE POLICY "Admin pode deletar/atualizar imagens"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'package_images' )
WITH CHECK ( bucket_id = 'package_images' );

CREATE POLICY "Admin pode apagar imagens"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'package_images' );
