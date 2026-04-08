create table public.packages (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  desc text not null,
  tag text not null,
  event_type text not null,
  buffet text not null,
  icon_name text not null,
  color text not null,
  active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Habilitar RLS (Segurança)
alter table public.packages enable row level security;

-- Política de leitura: qualquer pessoa pode ver pacotes ativos na landing page
create policy "Pacotes são visíveis para todos"
  on public.packages for select
  using (true);

-- Política de escrita: somente usuários autenticados (admin) podem inserir, atualizar ou invativar
create policy "Apenas admins modificam pacotes"
  on public.packages for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');
