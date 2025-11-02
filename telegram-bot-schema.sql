-- Database Schema Updates for Telegram Bot Integration
-- Run this in your Supabase SQL Editor

-- 1. Add Telegram-related columns to users (if not exists)
-- Assuming you have a users table from auth.users or custom table
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  telegram_id TEXT UNIQUE,
  username TEXT,
  first_name TEXT,
  last_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add telegram columns if table already exists
ALTER TABLE users ADD COLUMN IF NOT EXISTS telegram_id TEXT UNIQUE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS username TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS first_name TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_name TEXT;

-- 2. Add location columns to harvesters table
ALTER TABLE harvesters ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8);
ALTER TABLE harvesters ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8);

-- 3. Add rating and popularity columns
ALTER TABLE harvesters ADD COLUMN IF NOT EXISTS rating DECIMAL(2, 1) DEFAULT 3.0;
ALTER TABLE harvesters ADD COLUMN IF NOT EXISTS rental_count INTEGER DEFAULT 0;
ALTER TABLE harvesters ADD COLUMN IF NOT EXISTS description TEXT;

-- 4. Create index for telegram_id for fast lookups (Hash Table concept)
CREATE INDEX IF NOT EXISTS idx_users_telegram_id ON users(telegram_id);

-- 5. Create index for location-based searches (Graph algorithm optimization)
CREATE INDEX IF NOT EXISTS idx_harvesters_location ON harvesters(latitude, longitude) WHERE latitude IS NOT NULL AND longitude IS NOT NULL;

-- 6. Create index for price range searches (Binary Search optimization)
CREATE INDEX IF NOT EXISTS idx_harvesters_price ON harvesters(price_per_day) WHERE available = true;

-- 7. Create index for rating searches
CREATE INDEX IF NOT EXISTS idx_harvesters_rating ON harvesters(rating) WHERE available = true;

-- 8. Function to update rental count (for popularity tracking)
CREATE OR REPLACE FUNCTION update_equipment_popularity()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE harvesters
  SET rental_count = rental_count + 1
  WHERE id = NEW.harvester_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 9. Trigger to update popularity on new rental
DROP TRIGGER IF EXISTS trigger_update_popularity ON rentals;
CREATE TRIGGER trigger_update_popularity
AFTER INSERT ON rentals
FOR EACH ROW
EXECUTE FUNCTION update_equipment_popularity();

-- 10. RLS policies for users table (if using RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own data
CREATE POLICY IF NOT EXISTS "users_select_self" ON users
FOR SELECT USING (auth.uid()::text = telegram_id OR auth.uid() = id);

-- Policy: Users can insert their own telegram data
CREATE POLICY IF NOT EXISTS "users_insert_telegram" ON users
FOR INSERT WITH CHECK (true); -- Allow telegram bot to insert

-- Policy: Users can update their own data
CREATE POLICY IF NOT EXISTS "users_update_self" ON users
FOR UPDATE USING (auth.uid()::text = telegram_id OR auth.uid() = id);

-- 11. View for equipment analytics (used by /analytics command)
CREATE OR REPLACE VIEW equipment_analytics AS
SELECT 
  COUNT(*) as total_equipment,
  AVG(price_per_day) as avg_price,
  MIN(price_per_day) as min_price,
  MAX(price_per_day) as max_price,
  AVG(rating) as avg_rating,
  SUM(rental_count) as total_rentals,
  COUNT(*) FILTER (WHERE available = true) as available_count
FROM harvesters;

-- 12. Function to find nearby equipment (Dijkstra's algorithm helper)
CREATE OR REPLACE FUNCTION find_nearby_equipment(
  user_lat DECIMAL,
  user_lon DECIMAL,
  max_distance_km DECIMAL DEFAULT 50,
  limit_count INTEGER DEFAULT 10
)
RETURNS TABLE (
  id UUID,
  name TEXT,
  price_per_day DECIMAL,
  distance_km DECIMAL,
  latitude DECIMAL,
  longitude DECIMAL,
  rating DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    h.id,
    h.name,
    h.price_per_day,
    -- Haversine formula for distance calculation
    (
      6371 * acos(
        cos(radians(user_lat)) * 
        cos(radians(h.latitude)) * 
        cos(radians(h.longitude) - radians(user_lon)) + 
        sin(radians(user_lat)) * 
        sin(radians(h.latitude))
      )
    ) as distance_km,
    h.latitude,
    h.longitude,
    h.rating
  FROM harvesters h
  WHERE 
    h.available = true
    AND h.latitude IS NOT NULL
    AND h.longitude IS NOT NULL
    AND (
      6371 * acos(
        cos(radians(user_lat)) * 
        cos(radians(h.latitude)) * 
        cos(radians(h.longitude) - radians(user_lon)) + 
        sin(radians(user_lat)) * 
        sin(radians(h.latitude))
      )
    ) <= max_distance_km
  ORDER BY distance_km
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Notes:
-- This schema adds support for:
-- 1. Telegram user integration
-- 2. Location-based search (Dijkstra's algorithm)
-- 3. Rating and popularity tracking (for recommendations)
-- 4. Optimized indexes for algorithm performance
-- 5. Analytics views for bot commands

