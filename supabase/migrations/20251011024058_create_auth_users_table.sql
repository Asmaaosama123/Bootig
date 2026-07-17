/*
  # Create Authentication Users Table

  1. New Tables
    - `auth_users`
      - `id` (uuid, primary key) - Unique user identifier
      - `name` (text, not null) - User's full name
      - `whatsapp` (text, unique, not null) - User's WhatsApp number
      - `created_at` (timestamptz) - Account creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp
      - `is_active` (boolean) - Account active status

  2. Security
    - Enable RLS on `auth_users` table
    - Add policy for users to read their own data
    - Add policy for users to update their own data
    - Add policy for authenticated users to insert their data

  3. Indexes
    - Add index on whatsapp for faster lookups
*/

CREATE TABLE IF NOT EXISTS auth_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  whatsapp text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  is_active boolean DEFAULT true
);

-- Add index for WhatsApp lookups
CREATE INDEX IF NOT EXISTS idx_auth_users_whatsapp ON auth_users(whatsapp);

-- Enable Row Level Security
ALTER TABLE auth_users ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own data
CREATE POLICY "Users can read own data"
  ON auth_users
  FOR SELECT
  TO authenticated
  USING (id = (current_setting('app.current_user_id', true))::uuid);

-- Policy: Allow anyone to insert (for registration)
CREATE POLICY "Anyone can register"
  ON auth_users
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Policy: Users can update their own data
CREATE POLICY "Users can update own data"
  ON auth_users
  FOR UPDATE
  TO authenticated
  USING (id = (current_setting('app.current_user_id', true))::uuid)
  WITH CHECK (id = (current_setting('app.current_user_id', true))::uuid);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_auth_users_updated_at ON auth_users;
CREATE TRIGGER update_auth_users_updated_at
  BEFORE UPDATE ON auth_users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
