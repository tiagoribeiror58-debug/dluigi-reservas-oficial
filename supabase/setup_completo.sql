-- =============================================================
-- D'Luigi Pizzaria — Setup completo do banco de dados
-- Rodar no SQL Editor do Supabase (uma única vez)
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
  period      text DEFAULT '',       -- 'diurno' | 'noturno'
  status      text DEFAULT 'pendente', -- 'pendente' | 'em_contato' | 'negociando' | 'fechado' | 'perdido'
  package_id  text DEFAULT '',
  admin_notes text DEFAULT '',
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now()
);

-- RLS
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

-- Público pode inserir (cliente faz reserva)
CREATE POLICY "Anon pode inserir reservas"
  ON reservations FOR INSERT
  TO anon
  WITH CHECK (true);

-- Autenticado (admin/José) pode ler tudo
CREATE POLICY "Admin lê todas as reservas"
  ON reservations FOR SELECT
  TO authenticated
  USING (true);

-- Autenticado pode atualizar (mudar status, notas)
CREATE POLICY "Admin atualiza reservas"
  ON reservations FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Autenticado pode deletar
CREATE POLICY "Admin deleta reservas"
  ON reservations FOR DELETE
  TO authenticated
  USING (true);

-- Índices de performance
CREATE INDEX IF NOT EXISTS idx_reservations_date       ON reservations(date);
CREATE INDEX IF NOT EXISTS idx_reservations_status     ON reservations(status);
CREATE INDEX IF NOT EXISTS idx_reservations_created_at ON reservations(created_at DESC);


-- ─────────────────────────────────────────────
-- 2. TABELA: packages
-- ─────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS packages (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title      text NOT NULL,
  "desc"     text NOT NULL,
  tag        text NOT NULL,
  event_type text NOT NULL,
  buffet     text NOT NULL,
  icon_name  text NOT NULL,
  color      text NOT NULL,
  active     boolean DEFAULT true,
  created_at timestamptz DEFAULT timezone('utc', now()) NOT NULL
);

-- RLS
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;

-- Qualquer pessoa (landing page) pode ver os pacotes ativos
CREATE POLICY "Pacotes visíveis para todos"
  ON packages FOR SELECT
  USING (true);

-- Somente admin pode criar/editar/desativar pacotes
CREATE POLICY "Apenas admins modificam pacotes"
  ON packages FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);


-- ─────────────────────────────────────────────
-- 3. SEED: 4 pacotes padrão (alinhados ao CONTEXTO.MD)
-- ─────────────────────────────────────────────

INSERT INTO packages (title, "desc", tag, event_type, buffet, icon_name, color, active)
VALUES
  (
    'Aniversário em família',
    'Pizza, bolo, espaço kids e muito afeto. O lugar certo para celebrar.',
    'Até 100 pessoas',
    'Aniversário',
    'buffet_full',
    'Cake',
    '#FFF0EE',
    true
  ),
  (
    'Bodas & Mini casamento',
    'Um ambiente acolhedor para os momentos mais especiais da vida a dois.',
    'Ambiente íntimo',
    'Mini casamento',
    'buffet_full',
    'HeartHandshake',
    '#F0F4FF',
    true
  ),
  (
    'Confraternização',
    'Reúna a equipe ou os amigos. Buffet farto e estrutura completa.',
    'Corporativo & social',
    'Confraternização',
    'buffet_food',
    'Users',
    '#F0FFF4',
    true
  ),
  (
    'Evento exclusivo',
    'Salão reservado só para você. Total privacidade e atenção.',
    'Reserva exclusiva',
    'Outro',
    'alacarte',
    'Star',
    '#FDF7F2',
    true
  );
