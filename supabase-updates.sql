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
