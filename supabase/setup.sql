-- =============================================================
-- D'Luigi Pizzaria — Setup COMPLETO do banco de dados
-- Seguro para rodar mesmo com tabelas já existentes
-- =============================================================


-- ─────────────────────────────────────────────
-- 1. TABELA: reservations
-- ─────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS reservations (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  phone       text NOT NULL,
  date        date NOT NULL,
  time        text NOT NULL,
  guests      integer NOT NULL,
  event_type  text NOT NULL,
  buffet      text NOT NULL,
  birthday    boolean DEFAULT false,
  notes       text DEFAULT '',
  period      text DEFAULT '',          -- 'diurno' | 'noturno'
  status      text DEFAULT 'pendente',  -- 'pendente' | 'em_contato' | 'negociando' | 'fechado' | 'perdido'
  package_id  text DEFAULT '',
  admin_notes text DEFAULT '',
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now()
);

ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anon pode inserir reservas"    ON reservations;
DROP POLICY IF EXISTS "Admin lê todas as reservas"    ON reservations;
DROP POLICY IF EXISTS "Admin atualiza reservas"       ON reservations;
DROP POLICY IF EXISTS "Admin deleta reservas"         ON reservations;

CREATE POLICY "Anon pode inserir reservas"
  ON reservations FOR INSERT TO anon
  WITH CHECK (true);

CREATE POLICY "Admin lê todas as reservas"
  ON reservations FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Admin atualiza reservas"
  ON reservations FOR UPDATE TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "Admin deleta reservas"
  ON reservations FOR DELETE TO authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS idx_reservations_date       ON reservations(date);
CREATE INDEX IF NOT EXISTS idx_reservations_status     ON reservations(status);
CREATE INDEX IF NOT EXISTS idx_reservations_created_at ON reservations(created_at DESC);


-- ─────────────────────────────────────────────
-- 2. TABELA: packages
-- ─────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS packages (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title          text NOT NULL,
  "desc"         text NOT NULL DEFAULT '',
  tag            text NOT NULL DEFAULT '',
  event_type     text NOT NULL,
  buffet         text NOT NULL,
  icon_name      text NOT NULL DEFAULT 'Star',
  color          text NOT NULL DEFAULT '#FFF0EE',
  active         boolean DEFAULT true,
  image_urls     text[] DEFAULT '{}',
  price          text DEFAULT '',
  visible_fields text[] DEFAULT '{"guests","date","time","eventType","buffet","notes","birthday"}',
  created_at     timestamptz DEFAULT timezone('utc', now()) NOT NULL
);

-- Colunas opcionais (caso a tabela já exista sem elas)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='packages' AND column_name='image_urls') THEN
    ALTER TABLE packages ADD COLUMN image_urls text[] DEFAULT '{}';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='packages' AND column_name='price') THEN
    ALTER TABLE packages ADD COLUMN price text DEFAULT '';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='packages' AND column_name='visible_fields') THEN
    ALTER TABLE packages ADD COLUMN visible_fields text[] DEFAULT '{"guests","date","time","eventType","buffet","notes","birthday"}';
  END IF;
END $$;

ALTER TABLE packages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Pacotes visíveis para todos"      ON packages;
DROP POLICY IF EXISTS "Apenas admins modificam pacotes"  ON packages;

CREATE POLICY "Pacotes visíveis para todos"
  ON packages FOR SELECT
  USING (true);

CREATE POLICY "Apenas admins modificam pacotes"
  ON packages FOR ALL TO authenticated
  USING (true) WITH CHECK (true);


-- ─────────────────────────────────────────────
-- 3. TABELA: settings (textos dinâmicos do site)
-- ─────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS settings (
  id         text PRIMARY KEY,
  value      jsonb NOT NULL,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read settings"  ON settings;
DROP POLICY IF EXISTS "Admin write settings"  ON settings;

CREATE POLICY "Public read settings"
  ON settings FOR SELECT
  USING (true);

CREATE POLICY "Admin write settings"
  ON settings FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

INSERT INTO settings (id, value)
VALUES (
  'landing_packages',
  '{"title": "Escolha o seu momento", "subtitle": "Selecione um pacote para pré-preencher a reserva automaticamente"}'
) ON CONFLICT (id) DO NOTHING;


-- ─────────────────────────────────────────────
-- 4. STORAGE: bucket de imagens dos pacotes
-- ─────────────────────────────────────────────

INSERT INTO storage.buckets (id, name, public)
VALUES ('package_images', 'package_images', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Público pode ler imagens"      ON storage.objects;
DROP POLICY IF EXISTS "Admin pode inserir imagens"    ON storage.objects;
DROP POLICY IF EXISTS "Admin pode atualizar imagens"  ON storage.objects;
DROP POLICY IF EXISTS "Admin pode apagar imagens"     ON storage.objects;

CREATE POLICY "Público pode ler imagens"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'package_images');

CREATE POLICY "Admin pode inserir imagens"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'package_images');

CREATE POLICY "Admin pode atualizar imagens"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'package_images')
  WITH CHECK (bucket_id = 'package_images');

CREATE POLICY "Admin pode apagar imagens"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'package_images');


-- ─────────────────────────────────────────────
-- 5. SEED: 4 pacotes padrão (só insere se estiver vazio)
-- ─────────────────────────────────────────────

INSERT INTO packages (title, "desc", tag, event_type, buffet, icon_name, color, active)
SELECT * FROM (VALUES
  ('Aniversário em família',  'Pizza, bolo, espaço kids e muito afeto. O lugar certo para celebrar.',        'Até 100 pessoas',    'Aniversário',     'buffet_full', 'Cake',          '#FFF0EE', true),
  ('Bodas & Mini casamento',  'Um ambiente acolhedor para os momentos mais especiais da vida a dois.',       'Ambiente íntimo',    'Mini casamento',  'buffet_full', 'HeartHandshake','#F0F4FF', true),
  ('Confraternização',        'Reúna a equipe ou os amigos. Buffet farto e estrutura completa.',             'Corporativo & social','Confraternização','buffet_food', 'Users',         '#F0FFF4', true),
  ('Evento exclusivo',        'Salão reservado só para você. Total privacidade e atenção.',                  'Reserva exclusiva',  'Outro',           'alacarte',    'Star',          '#FDF7F2', true)
) AS v(title, "desc", tag, event_type, buffet, icon_name, color, active)
WHERE NOT EXISTS (SELECT 1 FROM packages LIMIT 1);
