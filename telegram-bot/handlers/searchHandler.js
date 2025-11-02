/**
 * Search Handler using Trie
 * 
 * DAA Concepts:
 * - Trie (Prefix Tree) for autocomplete
 * - Merge Sort for sorting results
 */

import { Trie } from '../algorithms/search/trie.js';
import { MergeSort } from '../algorithms/sorting/mergeSort.js';

export default class SearchHandler {
  constructor(bot, supabaseService) {
    this.bot = bot;
    this.supabaseService = supabaseService;
    this.trie = new Trie();
    this.mergeSort = new MergeSort();
    this.equipmentCache = null;
    this.buildIndex();
  }

  /**
   * Build search index from equipment data
   */
  async buildIndex() {
    try {
      const equipment = await this.supabaseService.getAllEquipment();
      
      if (!equipment || equipment.length === 0) {
        console.log('No equipment found to index');
        this.equipmentCache = [];
        return;
      }
      
      // Build Trie index
      equipment.forEach(eq => {
        if (eq && eq.name) {
          this.trie.insert(eq.name.toLowerCase(), eq);
          // Also index by description keywords
          if (eq.description) {
            const keywords = eq.description.toLowerCase().split(' ');
            keywords.forEach(keyword => {
              if (keyword.length > 3) {
                this.trie.insert(keyword, eq);
              }
            });
          }
        }
      });

      this.equipmentCache = equipment;
    } catch (error) {
      console.error('Error building search index:', error);
      this.equipmentCache = [];
    }
  }

  /**
   * Handle search command
   */
  async handle(msg, query) {
    if (!query || query.trim() === '') {
      await this.bot.sendMessage(
        msg.chat.id,
        'Please provide a search query.\nExample: /search combine harvester'
      );
      return;
    }

    try {
      // Refresh index if needed
      if (!this.equipmentCache || this.equipmentCache.length === 0) {
        await this.buildIndex();
      }

      const queryLower = query.toLowerCase().trim();

      // Use Trie for autocomplete/prefix matching
      const prefixMatches = this.trie.getWordsWithPrefix(queryLower, 10);
      
      // Sort equipment by name for display
      if (!this.equipmentCache || this.equipmentCache.length === 0) {
        await this.bot.sendMessage(
          msg.chat.id,
          `No equipment found in database. Please add equipment first.`
        );
        return;
      }
      
      const sortedByName = this.mergeSort.sort(
        this.equipmentCache,
        null,
        'name',
        'asc'
      );

      // Format results
      if (prefixMatches.length === 0) {
        await this.bot.sendMessage(
          msg.chat.id,
          `No equipment found matching "${query}"\n\nTry a different search term or use /recommend for suggestions.`
        );
        return;
      }

      // Prepare results message
      let message = `🔍 *Search Results for "${query}"*\n\n`;
      message += `*Algorithm Used:* Trie (Prefix Tree)\n`;
      message += `*Time Complexity:* O(m + k) where m=query length, k=results\n\n`;
      message += `*Found ${prefixMatches.length} result(s):*\n\n`;

      prefixMatches.forEach((match, index) => {
        const eq = match.data || match;
        message += `${index + 1}. *${eq.name}*\n`;
        message += `   💰 ₹${parseFloat(eq.price_per_day || 0).toFixed(2)}/day\n`;
        if (eq.description) {
          message += `   📝 ${eq.description.substring(0, 50)}...\n`;
        }
        message += `   ID: \`${eq.id}\`\n\n`;
      });

      message += `Use /book <ID> to book equipment.`;

      await this.bot.sendMessage(msg.chat.id, message, { 
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            prefixMatches.slice(0, 3).map(match => ({
              text: `Book ${(match.data || match).name}`,
              callback_data: `book_${(match.data || match).id}`
            }))
          ]
        }
      });

    } catch (error) {
      console.error('Search error:', error);
      await this.bot.sendMessage(msg.chat.id, 'Error performing search. Please try again.');
    }
  }
}

