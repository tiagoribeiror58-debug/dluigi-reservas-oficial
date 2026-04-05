/*
  # Fix RLS Policies — separar acesso anon e autenticado

  1. Remove policy antiga que dava ALL ao anon (inseguro)
  2. anon         → apenas INSERT (formulário público de reservas)
  3. authenticated → acesso completo (admin via Supabase Auth)
*/

DROP POLICY IF EXISTS "Permitir todas as operacoes anonimamente (uso local auth)" ON reservations;

CREATE POLICY "anon_insert_only"
  ON reservations
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "authenticated_full_access"
  ON reservations
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
