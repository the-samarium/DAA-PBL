# Adding Sample Equipment Data

## Quick Steps

1. **Open Supabase Dashboard**
   - Go to your Supabase project dashboard
   - Navigate to SQL Editor (left sidebar)

2. **Copy and Run SQL**
   - Copy the SQL from `add-sample-equipment.sql`
   - Paste it into the SQL Editor
   - Click "Run" or press Ctrl+Enter

3. **Verify**
   - The query will show the inserted data at the end
   - You should see 3 equipment items

## SQL Query

```sql
-- Add sample equipment for testing Telegram Bot
INSERT INTO harvesters (name, price_per_day, image, description, latitude, longitude, rating) VALUES
('Combine Harvester 2024', 5000, 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800', 'High-performance combine harvester for large fields', 28.6139, 77.2090, 4.5),
('Tractor Model X', 3000, 'https://images.unsplash.com/photo-1589922152616-070c90ea3e35?w=800', 'Versatile tractor for various farming operations', 28.7041, 77.1025, 4.2),
('Harvester Pro', 6000, 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=800', 'Professional grade harvester with advanced features', 28.5562, 77.1000, 4.8)
ON CONFLICT DO NOTHING;
```

## After Running

Once you've added the data, restart your bot (if needed) and test:

1. **Restart Bot** (if it's running):
   ```bash
   # Stop current bot (Ctrl+C)
   npm start
   ```

2. **Test Commands in Telegram**:
   - `/start` - Welcome message
   - `/search combine` - Should find "Combine Harvester 2024" (Trie algorithm)
   - `/recommend price` - Should show sorted by price (Merge Sort)
   - `/recommend rating` - Should show sorted by rating (Quick Sort)
   - `/recommend popular` - Should show by popularity (Priority Queue)
   - `/nearby delhi` - Should find nearby equipment (Dijkstra)
   - `/optimize 50000` - Should optimize selection (Knapsack DP)

## Sample Data Details

| Equipment | Price/Day | Rating | Location |
|-----------|-----------|--------|----------|
| Combine Harvester 2024 | ₹5,000 | 4.5 | Delhi area |
| Tractor Model X | ₹3,000 | 4.2 | Delhi area |
| Harvester Pro | ₹6,000 | 4.8 | Delhi area |

## Troubleshooting

If you get an error about missing columns:
- Run the SQL from `telegram-bot-schema.sql` first to add missing columns
- Or run `DATABASE_SETUP.md` SQL commands

If data doesn't appear:
- Check RLS policies allow your bot's service role key to read data
- Verify the bot is using the correct Supabase credentials

