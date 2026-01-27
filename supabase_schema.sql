-- Create Products Table
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT,
  cost_price NUMERIC(10, 2) DEFAULT 0,
  selling_price NUMERIC(10, 2) DEFAULT 0,
  box_number TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID DEFAULT auth.uid() -- Optional: if you add authentication later
);

-- Create Daily Logs Table
CREATE TABLE daily_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  opening_stock NUMERIC(10, 2) DEFAULT 0,
  remaining_stock NUMERIC(10, 2) DEFAULT 0,
  sold_qty NUMERIC(10, 2) GENERATED ALWAYS AS (opening_stock - remaining_stock) STORED,
  sales_amount NUMERIC(10, 2),
  profit NUMERIC(10, 2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(product_id, date)
);

-- Note: Profit calculation usually happens in the app logic or via a trigger
-- since it depends on product prices which might change over time.
