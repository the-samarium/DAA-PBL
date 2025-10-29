-- Run these SQL commands in your Supabase SQL Editor

-- 1. Add user_id column to harvesters table (if not exists)
ALTER TABLE harvesters ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- 2. Create rentals table (separate from purchases for rental-specific data)
CREATE TABLE IF NOT EXISTS rentals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  harvester_id UUID NOT NULL REFERENCES harvesters(id) ON DELETE CASCADE,
  rental_days INTEGER NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  rent_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  return_date TIMESTAMP WITH TIME ZONE NOT NULL,
  customer_name TEXT,
  contact_number TEXT,
  delivery_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create promotions table for advertisements
CREATE TABLE IF NOT EXISTS promotions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image TEXT,
  link TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) UNIQUE,
  plan_type TEXT NOT NULL CHECK (plan_type IN ('free', 'basic', 'premium')),
  start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  end_date TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Insert sample promotions
INSERT INTO promotions (title, description, image, link) VALUES
('Premium Subscription - 20% Off', 'Upgrade to premium and get featured listings', 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=800', '/dashboard/subscription'),
('Summer Sale on All Equipment', 'Best deals on harvesters this season', 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800', '/home/harvesters'),
('List Your Equipment Today', 'Earn by renting out your agricultural equipment', 'https://images.unsplash.com/photo-1589922152616-070c90ea3e35?w=800', '/add-harvester')
ON CONFLICT DO NOTHING;

-- 6. Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_harvesters_user_id ON harvesters(user_id);
CREATE INDEX IF NOT EXISTS idx_rentals_user_id ON rentals(user_id);
CREATE INDEX IF NOT EXISTS idx_rentals_harvester_id ON rentals(harvester_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);

-- 7. Create purchases table (used for buy flow)
CREATE TABLE IF NOT EXISTS purchases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  harvester_id UUID NOT NULL REFERENCES harvesters(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('rent','buy')),
  date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  customer_name TEXT,
  contact_number TEXT,
  delivery_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Enable RLS and policies
ALTER TABLE harvesters ENABLE ROW LEVEL SECURITY;
ALTER TABLE rentals ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;

-- harvesters policies
CREATE POLICY IF NOT EXISTS "harvesters_select_auth" ON harvesters
FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY IF NOT EXISTS "harvesters_insert_self" ON harvesters
FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY IF NOT EXISTS "harvesters_delete_self" ON harvesters
FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY IF NOT EXISTS "harvesters_update_self" ON harvesters
FOR UPDATE USING (auth.uid() = user_id);

-- rentals policies (only own rentals)
CREATE POLICY IF NOT EXISTS "rentals_select_self" ON rentals
FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY IF NOT EXISTS "rentals_insert_self" ON rentals
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- purchases policies (only own purchases)
CREATE POLICY IF NOT EXISTS "purchases_select_self" ON purchases
FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY IF NOT EXISTS "purchases_insert_self" ON purchases
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- subscriptions policies (own row)
CREATE POLICY IF NOT EXISTS "subscriptions_select_self" ON subscriptions
FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY IF NOT EXISTS "subscriptions_upsert_self" ON subscriptions
FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY IF NOT EXISTS "subscriptions_update_self" ON subscriptions
FOR UPDATE USING (auth.uid() = user_id);

-- promotions policies (read for everyone)
CREATE POLICY IF NOT EXISTS "promotions_select_all" ON promotions
FOR SELECT USING (true);