# Telegram Bot Integration Guide

This guide explains how to integrate the Telegram bot with your AgriLink project.

## Prerequisites

1. **Telegram Bot Token**
   - Create a bot via [@BotFather](https://t.me/BotFather) on Telegram
   - Get your bot token

2. **Supabase Credentials**
   - Your Supabase project URL
   - Service role key (for bot operations)

3. **Node.js** (v18+)
   - Required for running the bot server

## Setup Steps

### Step 1: Install Dependencies

```bash
cd telegram-bot
npm install
```

### Step 2: Configure Environment

Create `telegram-bot/.env` file:

```env
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
BOT_PORT=3001
NODE_ENV=development
```

### Step 3: Update Database Schema

Run the SQL script in Supabase SQL Editor:

```bash
# Run telegram-bot-schema.sql in Supabase
```

Or manually add:
- `telegram_id` column to users table
- `latitude`, `longitude` columns to harvesters table
- `rating`, `rental_count` columns to harvesters table

### Step 4: Add Location Data to Equipment

Update your harvesters table with location coordinates:

```sql
UPDATE harvesters 
SET latitude = 28.6139, longitude = 77.2090 
WHERE id = 'your_equipment_id';
```

### Step 5: Run the Bot

**Development Mode (Polling):**
```bash
cd telegram-bot
npm run dev
```

**Production Mode:**
```bash
npm start
```

### Step 6: Test the Bot

1. Open Telegram
2. Search for your bot (by username from BotFather)
3. Send `/start` command
4. Try other commands:
   - `/search combine`
   - `/recommend price`
   - `/nearby delhi`
   - `/optimize 50000`

## Webhook Integration (Production)

For production, use webhooks instead of polling:

1. **Set Webhook URL:**
```bash
curl -X POST "https://api.telegram.org/bot<YOUR_TOKEN>/setWebhook?url=https://your-domain.com/api/telegram/webhook"
```

2. **Deploy Next.js App:**
   - The webhook endpoint is at `/app/api/telegram/webhook/route.js`
   - Ensure your Next.js app is deployed and accessible

3. **Update Environment:**
```env
TELEGRAM_WEBHOOK_URL=https://your-domain.com/api/telegram/webhook
```

4. **Disable Polling:**
   - Comment out polling in `telegram-bot/server.js`
   - Use webhook endpoint instead

## DAA Concepts Used

### 1. Search Commands (`/search`)
- **Trie (Prefix Tree)** for autocomplete
- **Binary Search** for exact matches
- Time Complexity: O(m + k) where m=query length, k=results

### 2. Recommendation Commands (`/recommend`)
- **Merge Sort** for stable sorting by rating
- **Quick Sort** for price sorting
- **Priority Queue** for top-k recommendations
- Time Complexity: O(n log n)

### 3. Location Commands (`/nearby`)
- **Dijkstra's Algorithm** for shortest path
- **Graph Algorithms** for location-based search
- Time Complexity: O(V²) or O(E log V)

### 4. Optimization Commands (`/optimize`)
- **0/1 Knapsack Problem** using Dynamic Programming
- **Price Optimization** within budget constraints
- Time Complexity: O(n × W) where W=budget

### 5. Booking Commands (`/book`)
- **Greedy Activity Selection** for scheduling
- **Conflict Detection** using sorting
- Time Complexity: O(n log n)

## File Structure

```
DAA-PBL/
├── telegram-bot/              # Bot server
│   ├── algorithms/           # DAA implementations
│   │   ├── graph/           # Dijkstra
│   │   ├── sorting/         # Quick, Merge Sort
│   │   ├── search/          # Binary, BST, Trie
│   │   ├── dynamic/         # Knapsack DP
│   │   ├── greedy/          # Activity Selection
│   │   └── dataStructures/  # PQ, Hash Table
│   ├── handlers/            # Command handlers
│   ├── services/            # Supabase integration
│   └── server.js           # Main bot server
├── app/
│   └── api/
│       └── telegram/
│           └── webhook/     # Webhook endpoint
├── docs/
│   └── DAA_IMPLEMENTATIONS.md  # Detailed DAA docs
└── telegram-bot-schema.sql     # Database schema
```

## Troubleshooting

### Bot Not Responding
1. Check bot token is correct
2. Verify bot is started: `npm start`
3. Check logs for errors

### Database Errors
1. Verify Supabase credentials
2. Check database schema is updated
3. Ensure RLS policies allow bot access

### Location Search Not Working
1. Ensure equipment has latitude/longitude
2. Check location data format
3. Verify distance calculation function

### Search Not Working
1. Ensure equipment data is loaded
2. Check Trie index is built
3. Verify Supabase connection

## Testing Algorithms

Each algorithm can be tested independently:

```javascript
// Test Trie
import { Trie } from './algorithms/search/trie.js';
const trie = new Trie();
trie.insert('combine harvester');
const results = trie.getWordsWithPrefix('comb', 5);

// Test Dijkstra
import { DijkstraAlgorithm } from './algorithms/graph/dijkstra.js';
const dijkstra = new DijkstraAlgorithm(graph);
const nearest = dijkstra.findNearestEquipment(start, equipment, 5);

// Test Knapsack
import { KnapsackDP } from './algorithms/dynamic/knapsack.js';
const knapsack = new KnapsackDP();
const result = knapsack.optimizeEquipment(equipment, budget);
```

## Next Steps

1. **Add More Features:**
   - Payment integration
   - Notifications
   - Multi-language support

2. **Optimize Algorithms:**
   - Add AVL Tree for balanced BST
   - Implement priority queue with proper heap
   - Add caching for frequent queries

3. **Monitor Performance:**
   - Log algorithm execution times
   - Track bot usage analytics
   - Optimize database queries

## Support

For issues or questions:
1. Check `docs/DAA_IMPLEMENTATIONS.md` for algorithm details
2. Review `TELEGRAM_BOT_STRUCTURE.md` for architecture
3. Check bot logs for error messages

