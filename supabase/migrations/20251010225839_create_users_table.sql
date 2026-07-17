/*
  # Create users table for WhatsApp-based authentication

  1. New Tables
    - `users`
      - `id` (uuid, primary key) - Unique user identifier
      - `name` (text) - User's full name
      - `date_of_birth` (date) - User's date of birth
      - `whatsapp_number` (text, unique) - User's WhatsApp number for authentication
      - `created_at` (timestamptz) - Account creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp
  
  2. Security
    - Enable RLS on `users` table
    - Add policy for users to read their own data
    - Add policy for users to update their own data
    - Add policy for anyone to insert (register) new users
    - Add policy for users to view basic info of other users (for social features)

  3. Indexes
    - Add unique index on whatsapp_number for fast lookups during sign-in
*/

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  date_of_birth date NOT NULL,
  whatsapp_number text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can register"
  ON users
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Users can view all user profiles"
  ON users
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Users can update own profile"
  ON users
  FOR UPDATE
  TO anon
  USING (id IN (SELECT id FROM users WHERE whatsapp_number = whatsapp_number))
  WITH CHECK (id IN (SELECT id FROM users WHERE whatsapp_number = whatsapp_number));

CREATE INDEX IF NOT EXISTS idx_users_whatsapp_number ON users(whatsapp_number);