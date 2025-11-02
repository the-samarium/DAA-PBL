# Troubleshooting Guide

## Common Errors

### Error: `relation "harvester" does not exist`

**Problem:** The table name is `harvesters` (plural), not `harvester` (singular).

**Solution:**
1. Use `harvesters` (plural) in all SQL queries
2. Or run `CREATE_AND_INSERT.sql` to create the table first

### Error: `column does not exist`

**Problem:** Missing columns in the harvesters table.

**Solution:** Run this SQL to add missing columns:
```sql
ALTER TABLE harvesters ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8);
ALTER TABLE harvesters ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8);
ALTER TABLE harvesters ADD COLUMN IF NOT EXISTS rating DECIMAL(2, 1) DEFAULT 3.0;
ALTER TABLE harvesters ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE harvesters ADD COLUMN IF NOT EXISTS available BOOLEAN DEFAULT true;
```

### Error: `table "harvesters" does not exist`

**Problem:** The harvesters table hasn't been created yet.

**Solution:** Run `CREATE_AND_INSERT.sql` which will:
1. Create the table if it doesn't exist
2. Insert sample data

### Quick Fix SQL

If you just want to insert data and the table exists:

```sql
-- Make sure table name is PLURAL: harvesters
INSERT INTO harvesters (name, price_per_day, image, description, latitude, longitude, rating) VALUES
('Combine Harvester 2024', 5000, 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800', 'High-performance combine harvester for large fields', 28.6139, 77.2090, 4.5),
('Tractor Model X', 3000, 'https://images.unsplash.com/photo-1589922152616-070c90ea3e35?w=800', 'Versatile tractor for various farming operations', 28.7041, 77.1025, 4.2),
('Harvester Pro', 6000, 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=800', 'Professional grade harvester with advanced features', 28.5562, 77.1000, 4.8);
```

**Important:** Table name is `harvesters` (with 's'), not `harvester`!

