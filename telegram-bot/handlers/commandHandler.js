/**
 * Main Command Handler for Telegram Bot
 * Routes commands to appropriate handlers
 */

import SearchHandler from './searchHandler.js';
import RecommendHandler from './recommendHandler.js';
import BookingHandler from './bookingHandler.js';
import LocationHandler from './locationHandler.js';

export class CommandHandler {
  constructor(bot, supabaseService) {
    this.bot = bot;
    this.supabaseService = supabaseService;
    this.search = new SearchHandler(bot, supabaseService);
    this.recommend = new RecommendHandler(bot, supabaseService);
    this.booking = new BookingHandler(bot, supabaseService);
    this.location = new LocationHandler(bot, supabaseService);
  }

  /**
   * Handle incoming command
   */
  async handleCommand(msg) {
    const command = msg.text.split(' ')[0].toLowerCase();
    const args = msg.text.split(' ').slice(1).join(' ');

    try {
      switch (command) {
        case '/start':
          await this.handleStart(msg);
          break;
        
        case '/help':
          await this.handleHelp(msg);
          break;
        
        case '/search':
          await this.search.handle(msg, args);
          break;
        
        case '/recommend':
          await this.recommend.handle(msg, args);
          break;
        
        case '/nearby':
          await this.location.handle(msg, args);
          break;
        
        case '/book':
          await this.booking.handle(msg, args);
          break;
        
        case '/optimize':
          await this.booking.handleOptimize(msg, args);
          break;
        
        case '/mybookings':
          await this.booking.handleMyBookings(msg);
          break;
        
        case '/analytics':
          await this.handleAnalytics(msg);
          break;
        
        default:
          await this.bot.sendMessage(
            msg.chat.id,
            'Unknown command. Use /help to see available commands.'
          );
      }
    } catch (error) {
      console.error('Command handler error:', error);
      await this.bot.sendMessage(
        msg.chat.id,
        'An error occurred. Please try again later.'
      );
    }
  }

  /**
   * Handle /start command
   */
  async handleStart(msg) {
    const welcomeText = `
🌾 *Welcome to AgriLink Bot!*

I help you find and rent agricultural equipment using advanced algorithms.

*Available Commands:*
/search - Search equipment (uses Trie + Binary Search)
/recommend - Get recommendations (uses Merge Sort + Priority Queue)
/nearby - Find nearby equipment (uses Dijkstra's Algorithm)
/book - Book equipment (uses Greedy Algorithm)
/optimize - Optimize selection within budget (uses Dynamic Programming)
/mybookings - View your bookings
/help - Show this help message

*DAA Concepts Used:*
• Graph Algorithms (Dijkstra) for location search
• Sorting Algorithms (Quick Sort, Merge Sort)
• Search Algorithms (Binary Search, BST, Trie)
• Dynamic Programming for optimization
• Greedy Algorithms for scheduling

Type /help for detailed information about each command.
    `;

    await this.bot.sendMessage(msg.chat.id, welcomeText, { parse_mode: 'Markdown' });
    
    // Register user in database
    try {
      await this.supabaseService.upsertTelegramUser(msg.from);
    } catch (error) {
      console.error('Error registering user:', error);
    }
  }

  /**
   * Handle /help command
   */
  async handleHelp(msg) {
    const helpText = `
*AgriLink Bot - Help*

*Commands:*

1️⃣ */search <query>*
   Search equipment by name
   Algorithm: Trie (Prefix Tree) for autocomplete
   Example: /search combine harvester

2️⃣ */recommend [price|rating|popular]*
   Get top equipment recommendations
   Algorithm: Merge Sort + Priority Queue
   Example: /recommend price

3️⃣ */nearby <location>*
   Find nearest equipment to your location
   Algorithm: Dijkstra's Shortest Path
   Example: /nearby delhi

4️⃣ */book <equipment_id>*
   Book equipment
   Algorithm: Greedy Activity Selection
   Example: /book abc123

5️⃣ */optimize <budget>*
   Find optimal equipment within budget
   Algorithm: 0/1 Knapsack (Dynamic Programming)
   Example: /optimize 50000

6️⃣ */mybookings*
   View your rental history

*About DAA Concepts:*
This bot demonstrates various Design and Analysis of Algorithms concepts:
• Graph algorithms for spatial problems
• Sorting for data organization
• Search algorithms for efficient lookups
• Dynamic programming for optimization
• Greedy algorithms for scheduling
    `;

    await this.bot.sendMessage(msg.chat.id, helpText, { parse_mode: 'Markdown' });
  }

  /**
   * Handle /analytics command
   */
  async handleAnalytics(msg) {
    try {
      const equipment = await this.supabaseService.getAllEquipment();
      
      const stats = {
        total: equipment.length,
        avgPrice: equipment.reduce((sum, e) => sum + (parseFloat(e.price_per_day) || 0), 0) / equipment.length,
        priceRange: {
          min: Math.min(...equipment.map(e => parseFloat(e.price_per_day) || 0)),
          max: Math.max(...equipment.map(e => parseFloat(e.price_per_day) || 0))
        }
      };

      const analyticsText = `
*Equipment Analytics*

📊 Total Equipment: ${stats.total}
💰 Average Price: ₹${stats.avgPrice.toFixed(2)}/day
📈 Price Range: ₹${stats.priceRange.min} - ₹${stats.priceRange.max}

*Algorithms Used:*
• O(n) iteration for statistics
• Min/Max finding: O(n)
• Average calculation: O(n)
      `;

      await this.bot.sendMessage(msg.chat.id, analyticsText, { parse_mode: 'Markdown' });
    } catch (error) {
      await this.bot.sendMessage(msg.chat.id, 'Error fetching analytics.');
    }
  }
}

