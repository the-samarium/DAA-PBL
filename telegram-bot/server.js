/**
 * Telegram Bot Server
 * Main entry point for AgriLink Telegram Bot
 */

import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';
import { CommandHandler } from './handlers/commandHandler.js';
import { SupabaseService } from './services/supabaseService.js';

dotenv.config();

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const PORT = process.env.BOT_PORT || 3001;

if (!BOT_TOKEN) {
  console.error('TELEGRAM_BOT_TOKEN not found in environment variables');
  process.exit(1);
}

// Initialize bot
const bot = new TelegramBot(BOT_TOKEN, { polling: true });

// Initialize services
const supabaseService = new SupabaseService();
const commandHandler = new CommandHandler(bot, supabaseService);

// Bot event handlers
bot.on('message', async (msg) => {
  // Ignore non-command messages for now
  if (msg.text && msg.text.startsWith('/')) {
    await commandHandler.handleCommand(msg);
  }
});

bot.on('callback_query', async (query) => {
  const msg = query.message;
  const data = query.data;

  if (data && data.startsWith('book_')) {
    const equipmentId = data.replace('book_', '');
    await commandHandler.booking.handle(msg, equipmentId);
  }

  // Answer callback query
  await bot.answerCallbackQuery(query.id);
});

bot.on('location', async (msg) => {
  try {
    const location = msg.location;
    if (location) {
      // Use location for nearby search
      await commandHandler.location.handleLocation(msg, location);
    }
  } catch (error) {
    console.error('Location handler error:', error);
  }
});

// Error handling
bot.on('error', (error) => {
  console.error('Bot error:', error);
});

bot.on('polling_error', (error) => {
  console.error('Polling error:', error);
});

console.log('🤖 AgriLink Telegram Bot is running!');
console.log('📚 Using DAA concepts:');
console.log('  - Graph Algorithms (Dijkstra)');
console.log('  - Sorting Algorithms (Quick Sort, Merge Sort)');
console.log('  - Search Algorithms (Binary Search, BST, Trie)');
console.log('  - Dynamic Programming (Knapsack)');
console.log('  - Greedy Algorithms (Activity Selection)');

export default bot;

