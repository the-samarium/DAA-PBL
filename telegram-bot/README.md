# AgriLink Telegram Bot

Telegram bot for AgriLink agricultural equipment rental platform with explicit implementation of Design and Analysis of Algorithms (DAA) concepts.

## Features

- 🔍 **Smart Search** - Trie (Prefix Tree) + Binary Search
- ⭐ **Recommendations** - Merge Sort + Priority Queue
- 📍 **Location Search** - Dijkstra's Algorithm
- 🎯 **Budget Optimization** - 0/1 Knapsack (Dynamic Programming)
- 📅 **Booking Optimization** - Greedy Activity Selection
- 📊 **Analytics** - Multiple algorithm implementations

## DAA Concepts Implemented

1. **Graph Algorithms**
   - Dijkstra's Shortest Path Algorithm
   - Graph building and traversal

2. **Sorting Algorithms**
   - Quick Sort (Divide & Conquer)
   - Merge Sort (Stable Sort)
   - Heap Sort (Priority Queue)

3. **Search Algorithms**
   - Binary Search (O(log n))
   - Binary Search Tree (BST)
   - Trie (Prefix Tree)

4. **Dynamic Programming**
   - 0/1 Knapsack Problem
   - Price Optimization

5. **Greedy Algorithms**
   - Activity Selection Problem
   - Booking Conflict Resolution

6. **Data Structures**
   - Priority Queue (Min/Max Heap)
   - Hash Table
   - Binary Search Tree
   - Trie

## Installation

1. **Install Dependencies**
```bash
cd telegram-bot
npm install
```

2. **Configure Environment Variables**

Since `.env.example` is in `.gitignore`, create `.env` manually:

**Option 1:** Copy from template:
```bash
cp env.template .env
```

**Option 2:** Create `.env` file manually with these variables:
```env
TELEGRAM_BOT_TOKEN=your_bot_token
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
BOT_PORT=3001
```

See `SETUP_ENV.md` for detailed instructions.

3. **Set Environment Variables**
```env
TELEGRAM_BOT_TOKEN=your_bot_token
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
BOT_PORT=3001
```

## Usage

### Run Bot Server
```bash
npm start
# or for development
npm run dev
```

### Bot Commands

- `/start` - Start the bot and see welcome message
- `/help` - Show help and available commands
- `/search <query>` - Search equipment using Trie
- `/recommend [price|rating|popular]` - Get recommendations
- `/nearby <location>` - Find nearby equipment using Dijkstra
- `/book <equipment_id>` - Book equipment
- `/optimize <budget>` - Optimize selection using Knapsack DP
- `/mybookings` - View your bookings
- `/analytics` - View equipment analytics

## Algorithm Complexity

| Algorithm | Use Case | Time Complexity | Space Complexity |
|-----------|----------|----------------|------------------|
| Dijkstra | Nearest equipment | O(V²) or O(E log V) | O(V) |
| Quick Sort | Price sorting | O(n log n) avg | O(log n) |
| Merge Sort | Rating sorting | O(n log n) | O(n) |
| Binary Search | Fast lookup | O(log n) | O(1) |
| BST | Equipment search | O(log n) avg | O(n) |
| Trie | Autocomplete | O(m) | O(ALPHABET_SIZE × N × M) |
| Knapsack (DP) | Budget optimization | O(n × W) | O(n × W) |
| Greedy | Booking optimization | O(n log n) | O(n) |
| Priority Queue | Recommendations | O(log n) insert | O(n) |

## Project Structure

```
telegram-bot/
├── algorithms/              # DAA Algorithm Implementations
│   ├── graph/              # Graph algorithms (Dijkstra)
│   ├── sorting/            # Sorting algorithms (Quick, Merge)
│   ├── search/             # Search algorithms (Binary, BST, Trie)
│   ├── dynamic/            # Dynamic Programming (Knapsack)
│   ├── greedy/             # Greedy algorithms
│   └── dataStructures/     # Data structures (PQ, Hash Table)
├── handlers/               # Command handlers
├── services/               # Service layer (Supabase)
├── server.js              # Main bot server
└── package.json           # Dependencies
```

## Database Schema Updates

To use the Telegram bot, you'll need to update your Supabase database:

```sql
-- Add telegram_id column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS telegram_id TEXT UNIQUE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS username TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS first_name TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_name TEXT;

-- Add location columns to harvesters table
ALTER TABLE harvesters ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8);
ALTER TABLE harvesters ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8);

-- Add rating column (optional)
ALTER TABLE harvesters ADD COLUMN IF NOT EXISTS rating DECIMAL(2, 1) DEFAULT 3.0;
ALTER TABLE harvesters ADD COLUMN IF NOT EXISTS rental_count INTEGER DEFAULT 0;
```

## Webhook Integration (Optional)

For production, use webhooks instead of polling:

1. Set webhook URL in Telegram:
```bash
curl -X POST "https://api.telegram.org/bot<TOKEN>/setWebhook?url=https://your-domain.com/api/telegram/webhook"
```

2. The Next.js API route handles webhook requests at `/app/api/telegram/webhook/route.js`

## Testing

Each algorithm includes detailed implementation with:
- Time complexity analysis
- Space complexity analysis
- Use case examples
- Performance considerations

## Notes

- The bot uses polling mode by default (for development)
- For production, switch to webhook mode
- All algorithms are implemented from scratch to demonstrate DAA concepts
- Complexity analysis is documented in each algorithm file

## License

ISC

