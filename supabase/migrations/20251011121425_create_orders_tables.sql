/*
  # Create orders tables

  1. New Tables
    - `orders`
      - `id` (uuid, primary key) - Unique order identifier
      - `user_id` (uuid, foreign key) - References auth.users
      - `order_number` (text, unique) - Human-readable order number
      - `status` (text) - Order status (pending, processing, shipped, delivered, cancelled)
      - `total` (numeric) - Total order amount
      - `subtotal` (numeric) - Subtotal before shipping
      - `shipping_cost` (numeric) - Shipping cost
      - `shipping_address` (jsonb) - Shipping address details
      - `payment_method` (text) - Payment method used
      - `notes` (text) - Order notes
      - `created_at` (timestamptz) - Order creation time
      - `updated_at` (timestamptz) - Last update time
    
    - `order_items`
      - `id` (uuid, primary key) - Unique item identifier
      - `order_id` (uuid, foreign key) - References orders
      - `product_id` (text) - Product identifier
      - `product_name` (text) - Product name at time of order
      - `product_image` (text) - Product image URL
      - `quantity` (integer) - Quantity ordered
      - `price` (numeric) - Price per unit at time of order
      - `size` (text, optional) - Product size
      - `color` (text, optional) - Product color
      - `created_at` (timestamptz) - Record creation time

  2. Security
    - Enable RLS on both tables
    - Users can only view their own orders
    - Users can create their own orders
*/

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  order_number text UNIQUE NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  total numeric(10, 2) NOT NULL DEFAULT 0,
  subtotal numeric(10, 2) NOT NULL DEFAULT 0,
  shipping_cost numeric(10, 2) NOT NULL DEFAULT 0,
  shipping_address jsonb NOT NULL,
  payment_method text NOT NULL,
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  product_id text NOT NULL,
  product_name text NOT NULL,
  product_image text NOT NULL,
  quantity integer NOT NULL DEFAULT 1,
  price numeric(10, 2) NOT NULL,
  size text,
  color text,
  created_at timestamptz DEFAULT now()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS orders_user_id_idx ON orders(user_id);
CREATE INDEX IF NOT EXISTS orders_created_at_idx ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS order_items_order_id_idx ON order_items(order_id);

-- Enable RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Orders policies
CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own orders"
  ON orders FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own orders"
  ON orders FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Order items policies
CREATE POLICY "Users can view own order items"
  ON order_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create order items"
  ON order_items FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

-- Function to generate order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS text AS $$
DECLARE
  new_number text;
  number_exists boolean;
BEGIN
  LOOP
    new_number := 'ORD-' || LPAD(FLOOR(RANDOM() * 999999)::text, 6, '0');
    SELECT EXISTS(SELECT 1 FROM orders WHERE order_number = new_number) INTO number_exists;
    EXIT WHEN NOT number_exists;
  END LOOP;
  RETURN new_number;
END;
$$ LANGUAGE plpgsql;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
