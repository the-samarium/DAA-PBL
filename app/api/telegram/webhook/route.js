/**
 * Telegram Webhook Route - Production Ready
 * Next.js API route for Telegram webhook
 * Handles all bot commands using the same handlers as the bot server
 */

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Create Supabase client for bot
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

/**
 * Send message via Telegram Bot API
 */
async function sendTelegramMessage(chatId, text, options = {}) {
  if (!BOT_TOKEN) {
    console.error('TELEGRAM_BOT_TOKEN not configured');
    return null;
  }

  try {
    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: options.parse_mode || 'Markdown',
        reply_markup: options.reply_markup,
      }),
    });
    
    const data = await response.json();
    if (!data.ok) {
      console.error('Telegram API error:', data);
    }
    return data;
  } catch (error) {
    console.error('Error sending Telegram message:', error);
    return null;
  }
}

/**
 * Answer callback query
 */
async function answerCallbackQuery(queryId, text = '') {
  if (!BOT_TOKEN) return;
  
  try {
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/answerCallbackQuery`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        callback_query_id: queryId,
        text: text,
      }),
    });
  } catch (error) {
    console.error('Error answering callback query:', error);
  }
}

/**
 * Supabase Service for bot (simplified version)
 */
class SupabaseService {
  constructor() {
    if (!supabase) {
      throw new Error('Supabase not configured');
    }
  }

  async getAllEquipment() {
    const { data, error } = await supabase
      .from('harvesters')
      .select('*');
    
    if (error) {
      console.error('Error fetching equipment:', error);
      return [];
    }
    return data || [];
  }

  async getEquipmentById(id) {
    const { data, error } = await supabase
      .from('harvesters')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      return null;
    }
    return data;
  }

  async getUserByTelegramId(telegramId) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('telegram_id', telegramId.toString())
        .single();
      
      if (error && error.code !== 'PGRST116') {
        return null;
      }
      return data;
    } catch (error) {
      return null;
    }
  }

  async upsertTelegramUser(userData) {
    try {
      const { data, error } = await supabase
        .from('users')
        .upsert({
          telegram_id: userData.id.toString(),
          username: userData.username,
          first_name: userData.first_name,
          last_name: userData.last_name,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'telegram_id'
        });
      
      if (error) {
        console.error('Error upserting user:', error);
      }
    } catch (error) {
      // Ignore if users table doesn't exist
    }
  }
}

// Initialize services - handle case where Supabase might not be configured
let supabaseService = null;
try {
  if (supabase) {
    supabaseService = new SupabaseService();
  }
} catch (error) {
  console.error('Warning: SupabaseService initialization failed:', error);
  console.error('Bot will still work but some features may be limited');
}

/**
 * Simplified Trie implementation for search
 */
class Trie {
  constructor() {
    this.root = {};
  }

  insert(word, data) {
    let node = this.root;
    for (const char of word.toLowerCase()) {
      if (!node[char]) node[char] = {};
      node = node[char];
    }
    if (!node.words) node.words = [];
    node.words.push(data);
  }

  getWordsWithPrefix(prefix, limit = 10) {
    let node = this.root;
    for (const char of prefix) {
      if (!node[char]) return [];
      node = node[char];
    }
    
    const results = [];
    const collect = (n) => {
      if (n.words) {
        results.push(...n.words);
      }
      for (const key in n) {
        if (key !== 'words') {
          collect(n[key]);
        }
      }
    };
    collect(node);
    
    return results.slice(0, limit);
  }
}

/**
 * Merge Sort implementation
 */
class MergeSort {
  sort(arr, compareFn = null, sortBy = null, order = 'asc') {
    if (!arr || arr.length <= 1) return arr || [];
    
    const array = [...arr];
    
    if (!compareFn && sortBy) {
      compareFn = (a, b) => {
        const aVal = a[sortBy] || 0;
        const bVal = b[sortBy] || 0;
        const comparison = aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
        return order === 'asc' ? comparison : -comparison;
      };
    }
    
    return this.mergeSort(array, compareFn);
  }

  mergeSort(arr, compareFn) {
    if (arr.length <= 1) return arr;
    
    const mid = Math.floor(arr.length / 2);
    const left = this.mergeSort(arr.slice(0, mid), compareFn);
    const right = this.mergeSort(arr.slice(mid), compareFn);
    
    return this.merge(left, right, compareFn);
  }

  merge(left, right, compareFn) {
    const result = [];
    let i = 0, j = 0;
    
    while (i < left.length && j < right.length) {
      if (compareFn(left[i], right[j]) <= 0) {
        result.push(left[i++]);
      } else {
        result.push(right[j++]);
      }
    }
    
    return result.concat(left.slice(i)).concat(right.slice(j));
  }
}

/**
 * Quick Sort implementation
 */
class QuickSort {
  sort(arr, compareFn = null, sortBy = null, order = 'asc') {
    if (!arr || arr.length <= 1) return arr || [];
    
    const array = [...arr];
    
    if (!compareFn && sortBy) {
      compareFn = (a, b) => {
        const aVal = a[sortBy] || 0;
        const bVal = b[sortBy] || 0;
        const comparison = aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
        return order === 'asc' ? comparison : -comparison;
      };
    }
    
    return this.quickSort(array, 0, array.length - 1, compareFn);
  }

  quickSort(arr, low, high, compareFn) {
    if (low < high) {
      const pivot = this.partition(arr, low, high, compareFn);
      this.quickSort(arr, low, pivot - 1, compareFn);
      this.quickSort(arr, pivot + 1, high, compareFn);
    }
    return arr;
  }

  partition(arr, low, high, compareFn) {
    const pivot = arr[high];
    let i = low - 1;
    
    for (let j = low; j < high; j++) {
      if (compareFn(arr[j], pivot) <= 0) {
        i++;
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
    }
    
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    return i + 1;
  }
}

/**
 * Priority Queue implementation
 */
class MaxPriorityQueue {
  constructor(compareFn) {
    this.heap = [];
    this.compareFn = compareFn;
  }

  enqueue(item) {
    this.heap.push(item);
    this.bubbleUp(this.heap.length - 1);
  }

  bubbleUp(index) {
    while (index > 0) {
      const parent = Math.floor((index - 1) / 2);
      if (this.compareFn(this.heap[parent], this.heap[index]) >= 0) break;
      [this.heap[parent], this.heap[index]] = [this.heap[index], this.heap[parent]];
      index = parent;
    }
  }

  topK(k) {
    const result = [];
    const heap = [...this.heap];
    
    for (let i = 0; i < k && heap.length > 0; i++) {
      result.push(heap[0]);
      heap[0] = heap[heap.length - 1];
      heap.pop();
      this.heapify(heap, 0);
    }
    
    return result;
  }

  heapify(heap, index) {
    const left = 2 * index + 1;
    const right = 2 * index + 2;
    let largest = index;
    
    if (left < heap.length && this.compareFn(heap[left], heap[largest]) > 0) {
      largest = left;
    }
    if (right < heap.length && this.compareFn(heap[right], heap[largest]) > 0) {
      largest = right;
    }
    
    if (largest !== index) {
      [heap[index], heap[largest]] = [heap[largest], heap[index]];
      this.heapify(heap, largest);
    }
  }
}

// Initialize algorithms
const trie = new Trie();
const mergeSort = new MergeSort();
const quickSort = new QuickSort();
let equipmentCache = null;

/**
 * Build search index
 */
async function buildIndex() {
  try {
    if (!supabaseService) {
      console.error('SupabaseService not available, cannot build index');
      equipmentCache = [];
      return;
    }
    
    const equipment = await supabaseService.getAllEquipment();
    if (!equipment || equipment.length === 0) {
      equipmentCache = [];
      return;
    }
    
    equipment.forEach(eq => {
      if (eq && eq.name) {
        trie.insert(eq.name.toLowerCase(), eq);
        if (eq.description) {
          const keywords = eq.description.toLowerCase().split(' ');
          keywords.forEach(keyword => {
            if (keyword.length > 3) {
              trie.insert(keyword, eq);
            }
          });
        }
      }
    });
    
    equipmentCache = equipment;
  } catch (error) {
    console.error('Error building index:', error);
    equipmentCache = [];
  }
}

// Build index on startup
buildIndex();

/**
 * Handle commands
 */
async function handleCommand(msg, command, args) {
  try {
    switch (command) {
      case '/start':
        await handleStart(msg);
        break;
      
      case '/help':
        await handleHelp(msg);
        break;
      
      case '/search':
        await handleSearch(msg, args);
        break;
      
      case '/recommend':
        await handleRecommend(msg, args);
        break;
      
      case '/book':
        await handleBook(msg, args);
        break;
      
      case '/mybookings':
        await handleMyBookings(msg);
        break;
      
      default:
        await sendTelegramMessage(
          msg.chat.id,
          'Unknown command. Use /help to see available commands.'
        );
    }
  } catch (error) {
    console.error('Command handler error:', error);
    await sendTelegramMessage(
      msg.chat.id,
      'An error occurred. Please try again later.'
    );
  }
}

async function handleStart(msg) {
  const welcomeText = `🌾 *Welcome to AgriLink Bot!*

I help you find agricultural equipment using advanced algorithms.

*Available Commands:*
/search - Search equipment (uses Trie)
/recommend - Get recommendations (uses Merge Sort + Priority Queue)
/book - View booking information (redirects to website)
/mybookings - View your bookings (redirects to website)
/help - Show detailed help message

*DAA Concepts Used:*
• Sorting Algorithms (Quick Sort, Merge Sort)
• Search Algorithms (Trie)
• Data Structures (Priority Queue)

Type /help for detailed information about each command.`;

  await sendTelegramMessage(msg.chat.id, welcomeText);
  
  try {
    if (supabaseService) {
      await supabaseService.upsertTelegramUser(msg.from);
    }
  } catch (error) {
    console.error('Error registering user:', error);
  }
}

async function handleHelp(msg) {
  const helpText = `*AgriLink Bot - Help*

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
• Priority Queue for top-k recommendations`;

  await sendTelegramMessage(msg.chat.id, helpText);
}

async function handleSearch(msg, query) {
  if (!query || query.trim() === '') {
    await sendTelegramMessage(
      msg.chat.id,
      'Please provide a search query.\nExample: /search combine harvester'
    );
    return;
  }

  try {
    if (!supabaseService) {
      await sendTelegramMessage(msg.chat.id, 'Database connection not available. Please check bot configuration.');
      return;
    }
    
    if (!equipmentCache || equipmentCache.length === 0) {
      await buildIndex();
    }

    if (!equipmentCache || equipmentCache.length === 0) {
      await sendTelegramMessage(
        msg.chat.id,
        'No equipment found in database. Please add equipment first.'
      );
      return;
    }

    const queryLower = query.toLowerCase().trim();
    const prefixMatches = trie.getWordsWithPrefix(queryLower, 10);

    if (prefixMatches.length === 0) {
      await sendTelegramMessage(
        msg.chat.id,
        `No equipment found matching "${query}"\n\nTry a different search term or use /recommend for suggestions.`
      );
      return;
    }

    let message = `🔍 *Search Results for "${query}"*\n\n`;
    message += `*Algorithm Used:* Trie (Prefix Tree)\n`;
    message += `*Time Complexity:* O(m + k) where m=query length, k=results\n\n`;
    message += `*Found ${prefixMatches.length} result(s):*\n\n`;

    prefixMatches.forEach((eq, index) => {
      message += `${index + 1}. *${eq.name || eq.data?.name}*\n`;
      message += `   💰 ₹${parseFloat(eq.price_per_day || eq.data?.price_per_day || 0).toFixed(2)}/day\n`;
      if (eq.description || eq.data?.description) {
        message += `   📝 ${(eq.description || eq.data?.description).substring(0, 50)}...\n`;
      }
      message += `   ID: \`${eq.id || eq.data?.id}\`\n\n`;
    });

    message += `Use /book <ID> to book equipment.`;

    await sendTelegramMessage(msg.chat.id, message, {
      reply_markup: {
        inline_keyboard: [
          prefixMatches.slice(0, 3).map(match => ({
            text: `Book ${match.name || match.data?.name}`,
            callback_data: `book_${match.id || match.data?.id}`
          }))
        ]
      }
    });
  } catch (error) {
    console.error('Search error:', error);
    await sendTelegramMessage(msg.chat.id, 'Error performing search. Please try again.');
  }
}

async function handleRecommend(msg, criteria) {
  try {
    if (!supabaseService) {
      await sendTelegramMessage(msg.chat.id, 'Database connection not available. Please check bot configuration.');
      return;
    }
    
    if (!equipmentCache || equipmentCache.length === 0) {
      const equipment = await supabaseService.getAllEquipment();
      if (!equipment || equipment.length === 0) {
        await sendTelegramMessage(msg.chat.id, 'No equipment available at the moment.');
        return;
      }
      equipmentCache = equipment;
      await buildIndex();
    }

    let sorted = [];
    let algorithm = '';
    let criteriaText = '';

    criteria = (criteria || '').toLowerCase().trim();

    switch (criteria) {
      case 'price':
      case 'cheap':
      case 'low':
        sorted = quickSort.sort(equipmentCache, null, 'price_per_day', 'asc');
        algorithm = 'Quick Sort (Divide & Conquer)';
        criteriaText = 'Lowest Price';
        break;

      case 'rating':
      case 'best':
      case 'top':
        sorted = mergeSort.sort(equipmentCache, null, 'rating', 'desc');
        algorithm = 'Merge Sort (Stable)';
        criteriaText = 'Highest Rating';
        break;

      case 'popular':
      case 'popularity':
        const pq = new MaxPriorityQueue((a, b) => {
          const scoreA = (a.rating || 3) * (a.rental_count || 1);
          const scoreB = (b.rating || 3) * (b.rental_count || 1);
          return scoreA - scoreB;
        });
        equipmentCache.forEach(eq => pq.enqueue(eq));
        sorted = pq.topK(10);
        algorithm = 'Priority Queue (Max Heap)';
        criteriaText = 'Most Popular';
        break;

      default:
        sorted = quickSort.sort(equipmentCache, (a, b) => {
          const scoreA = (a.rating || 3) - (a.price_per_day || 0) / 1000;
          const scoreB = (b.rating || 3) - (b.price_per_day || 0) / 1000;
          return scoreB - scoreA;
        });
        algorithm = 'Multi-Criteria Quick Sort';
        criteriaText = 'Best Value (Rating + Price)';
    }

    const recommendations = sorted.slice(0, 5);

    let message = `⭐ *Equipment Recommendations*\n\n`;
    message += `*Criteria:* ${criteriaText}\n`;
    message += `*Algorithm:* ${algorithm}\n`;
    message += `*Time Complexity:* O(n log n)\n\n`;
    message += `*Top ${recommendations.length} Recommendations:*\n\n`;

    recommendations.forEach((eq, index) => {
      message += `${index + 1}. *${eq.name}*\n`;
      message += `   💰 ₹${parseFloat(eq.price_per_day || 0).toFixed(2)}/day\n`;
      if (eq.rating) {
        message += `   ⭐ ${eq.rating}/5\n`;
      }
      message += `   ID: \`${eq.id}\`\n\n`;
    });

    message += `Use /book <ID> to book equipment.`;

    await sendTelegramMessage(msg.chat.id, message, {
      reply_markup: {
        inline_keyboard: [
          recommendations.slice(0, 3).map(eq => ({
            text: `Book ${eq.name}`,
            callback_data: `book_${eq.id}`
          }))
        ]
      }
    });
  } catch (error) {
    console.error('Recommend error:', error);
    await sendTelegramMessage(msg.chat.id, 'Error generating recommendations.');
  }
}

async function handleBook(msg, equipmentId) {
  try {
    let message = `📖 *Booking Information*\n\n`;
    
    if (equipmentId && equipmentId.trim() !== '') {
      try {
        if (supabaseService) {
          const equipment = await supabaseService.getEquipmentById(equipmentId.trim());
          
          if (equipment) {
            message += `*Equipment:* ${equipment.name}\n`;
            message += `*Price:* ₹${parseFloat(equipment.price_per_day || 0).toFixed(2)}/day\n\n`;
            if (equipment.description) {
              message += `*Description:* ${equipment.description}\n\n`;
            }
          } else {
            message += `Equipment not found.\n\n`;
          }
        } else {
          message += `Database connection not available. Equipment details cannot be loaded.\n\n`;
        }
      } catch (error) {
        console.error('Error fetching equipment:', error);
      }
    }
    
    const websiteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://agrilink-daa-pbl.vercel.app';
    const checkoutUrl = equipmentId && equipmentId.trim() !== '' 
      ? `${websiteUrl}/checkout?harvesterId=${equipmentId.trim()}`
      : `${websiteUrl}/checkout`;
    
    message += `🌐 *To Book Equipment:*\n\n`;
    message += `Please visit our website to complete your booking:\n`;
    message += `🔗 ${checkoutUrl}\n\n`;
    message += `On the website, you can:\n`;
    message += `• Complete the booking process\n`;
    message += `• Select rental duration\n`;
    message += `• Enter delivery details\n`;
    message += `• Make secure payment\n\n`;
    message += `Use /search or /recommend to find equipment IDs first.`;

    await sendTelegramMessage(msg.chat.id, message);
  } catch (error) {
    console.error('Booking error:', error);
    await sendTelegramMessage(msg.chat.id, 'Error processing request.');
  }
}

async function handleMyBookings(msg) {
  try {
    const websiteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://agrilink-daa-pbl.vercel.app';
    
    let message = `📋 *View Your Bookings*\n\n`;
    message += `🌐 *Visit Our Website:*\n\n`;
    message += `To view your bookings, please visit:\n`;
    message += `🔗 ${websiteUrl}/dashboard/my-rented-equipments\n\n`;
    message += `Or see your rental history at:\n`;
    message += `🔗 ${websiteUrl}/history\n\n`;
    message += `On the website, you can:\n`;
    message += `• View all your bookings\n`;
    message += `• See rental history\n`;
    message += `• Check booking details\n`;
    message += `• Manage your rentals`;

    await sendTelegramMessage(msg.chat.id, message);
  } catch (error) {
    console.error('My bookings error:', error);
    await sendTelegramMessage(msg.chat.id, 'Error processing request.');
  }
}

/**
 * Main POST handler for webhook
 */
export async function POST(request) {
  try {
    if (!BOT_TOKEN) {
      console.error('BOT_TOKEN not configured');
      return NextResponse.json(
        { error: 'Bot token not configured' },
        { status: 500 }
      );
    }

    const update = await request.json();

    // Handle messages
    if (update.message) {
      const msg = update.message;
      
      if (msg.text && msg.text.startsWith('/')) {
        const parts = msg.text.split(' ');
        const command = parts[0];
        const args = parts.slice(1).join(' ');
        
        console.log(`Processing command: ${command} with args: ${args}`);
        await handleCommand(msg, command, args);
      } else if (msg.text) {
        // Handle non-command text messages
        console.log('Received non-command message, ignoring');
      }
    }

    // Handle callback queries (inline button clicks)
    if (update.callback_query) {
      const query = update.callback_query;
      const data = query.data;
      const msg = query.message;

      await answerCallbackQuery(query.id);

      if (data && data.startsWith('book_')) {
        const equipmentId = data.replace('book_', '');
        await handleBook(msg, equipmentId);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Webhook error:', error);
    console.error('Error stack:', error.stack);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

/**
 * GET handler for webhook verification
 */
export async function GET(request) {
  return NextResponse.json({
    message: 'Telegram webhook endpoint is active',
    status: 'ready',
    url: 'https://agrilink-daa-pbl.vercel.app/api/telegram/webhook'
  });
}
