/**
 * Main Command Handler for Telegram Bot
 * Routes commands to appropriate handlers
 */

import SearchHandler from './searchHandler.js';
import RecommendHandler from './recommendHandler.js';
import BookingHandler from './bookingHandler.js';

export class CommandHandler {
  constructor(bot, supabaseService) {
    this.bot = bot;
    this.supabaseService = supabaseService;
    this.search = new SearchHandler(bot, supabaseService);
    this.recommend = new RecommendHandler(bot, supabaseService);
    this.booking = new BookingHandler(bot, supabaseService);
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
        
        case '/book':
          await this.booking.handle(msg, args);
          break;
        
        case '/mybookings':
          await this.booking.handleMyBookings(msg);
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

I help you find agricultural equipment using advanced algorithms.

*Available Commands:*
/search - Search equipment (uses Trie + Binary Search)
/recommend - Get recommendations (uses Merge Sort + Priority Queue)
/book - View booking information (redirects to website)
/mybookings - View your bookings (redirects to website)
/help - Show detailed help message

*DAA Concepts Used:*
• Sorting Algorithms (Quick Sort, Merge Sort)
• Search Algorithms (Trie)
• Data Structures (Priority Queue)

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

*Available Commands:*

1️⃣ */search <query>*
   Search equipment by name
   Algorithm: Trie (Prefix Tree) for autocomplete
   Time Complexity: O(m + k) where m=query length, k=results
   Example: /search combine harvester

2️⃣ */recommend [price|rating|popular]*
   Get top equipment recommendations
   Algorithm: Merge Sort + Priority Queue
   Time Complexity: O(n log n)
   Example: /recommend price

3️⃣ */book*
   Get information about booking equipment
   Note: Visit our website to complete bookings

4️⃣ */mybookings*
   View your bookings
   Note: Visit our website to see all your bookings

*About DAA Concepts:*
This bot demonstrates Design and Analysis of Algorithms concepts:
• Trie (Prefix Tree) for autocomplete search
• Merge Sort for stable sorting
• Quick Sort for efficient sorting
• Priority Queue for top-k recommendations
    `;

    await this.bot.sendMessage(msg.chat.id, helpText, { parse_mode: 'Markdown' });
  }

}

