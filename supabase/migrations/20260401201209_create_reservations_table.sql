/*
  # Create reservations table for D'Luigi Pizzaria

  1. New Tables
    - `reservations`
      - `id` (uuid, primary key) - Unique identifier for each reservation
      - `name` (text) - Customer name
      - `phone` (text) - Customer contact number
      - `date` (date) - Event date
      - `time` (text) - Event time
      - `guests` (integer) - Number of guests
      - `event_type` (text) - Type of event (birthday, wedding, etc.)
      - `buffet` (text) - Selected buffet option
      - `birthday` (boolean) - Whether there's a birthday person at the table
      - `notes` (text, optional) - Additional notes from customer
      - `period` (text, optional) - Time period (diurno/noturno)
      - `status` (text) - Reservation status (pendente, confirmada, cancelada)
      - `package_id` (text, optional) - Selected package ID
      - `created_at` (timestamptz) - When the reservation was created
      - `updated_at` (timestamptz) - When the reservation was last updated

  2. Security
    - Enable RLS on `reservations` table
    - Add policy for public to insert reservations (anyone can make a reservation)
    - Add policy for authenticated users to read all reservations (admin access)
    - Add policy for authenticated users to update reservations (admin can change status)
*/

CREATE TABLE IF NOT EXISTS reservations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text NOT NULL,
  date date NOT NULL,
  time text NOT NULL,
  guests integer NOT NULL,
  event_type text NOT NULL,
  buffet text NOT NULL,
  birthday boolean DEFAULT false,
  notes text DEFAULT '',
  period text DEFAULT '',
  status text DEFAULT 'pendente',
  package_id text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create reservations"
  ON reservations
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view all reservations"
  ON reservations
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update reservations"
  ON reservations
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_reservations_date ON reservations(date);
CREATE INDEX IF NOT EXISTS idx_reservations_status ON reservations(status);
CREATE INDEX IF NOT EXISTS idx_reservations_created_at ON reservations(created_at DESC);