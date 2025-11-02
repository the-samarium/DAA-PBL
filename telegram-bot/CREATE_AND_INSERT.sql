-- Complete SQL to create harvesters table and insert sample data
-- Run this ENTIRE script in Supabase SQL Editor

-- Step 1: Create harvesters table
CREATE TABLE IF NOT EXISTS harvesters (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  price_per_day DECIMAL(10,2) NOT NULL,
  image TEXT,
  description TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  rating DECIMAL(2, 1) DEFAULT 3.0,
  available BOOLEAN DEFAULT true,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 2: Enable RLS (Row Level Security)
ALTER TABLE harvesters ENABLE ROW LEVEL SECURITY;

-- Step 3: Create policy to allow reads (for bot to access data)
-- Drop policy if exists first, then create
DROP POLICY IF EXISTS "harvesters_select_public" ON harvesters;

-- For public access (allows bot with service role key to read)
CREATE POLICY "harvesters_select_public" ON harvesters
FOR SELECT USING (true);

-- Step 4: Insert sample data
INSERT INTO harvesters (name, price_per_day, image, description, latitude, longitude, rating) VALUES
('Combine Harvester 2024', 5000, 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800', 'High-performance combine harvester for large fields', 28.6139, 77.2090, 4.5),
('Tractor Model X', 3000, 'https://images.unsplash.com/photo-1589922152616-070c90ea3e35?w=800', 'Versatile tractor for various farming operations', 28.7041, 77.1025, 4.2),
('Harvester Pro', 6000, 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=800', 'Professional grade harvester with advanced features', 28.5562, 77.1000, 4.8);

-- Step 5: Verify data was inserted
SELECT id, name, price_per_day, rating, latitude, longitude FROM harvesters ORDER BY name;

