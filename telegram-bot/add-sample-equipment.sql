-- Add sample equipment for testing Telegram Bot
-- Run this SQL in your Supabase SQL Editor
-- IMPORTANT: Table name is "harvesters" (PLURAL with 's')

INSERT INTO harvesters (name, price_per_day, image, description, latitude, longitude, rating) VALUES
('Combine Harvester 2024', 5000, 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800', 'High-performance combine harvester for large fields', 28.6139, 77.2090, 4.5),
('Tractor Model X', 3000, 'https://images.unsplash.com/photo-1589922152616-070c90ea3e35?w=800', 'Versatile tractor for various farming operations', 28.7041, 77.1025, 4.2),
('Harvester Pro', 6000, 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=800', 'Professional grade harvester with advanced features', 28.5562, 77.1000, 4.8)
ON CONFLICT DO NOTHING;

-- Verify the data was inserted
SELECT id, name, price_per_day, rating, latitude, longitude FROM harvesters ORDER BY name;

