/**
 * Recommendation Handler using Sorting and Priority Queue
 * 
 * DAA Concepts:
 * - Merge Sort for stable sorting
 * - Priority Queue for top-k recommendations
 */

import { MergeSort } from '../algorithms/sorting/mergeSort.js';
import { QuickSort } from '../algorithms/sorting/quickSort.js';
import { MaxPriorityQueue } from '../algorithms/dataStructures/priorityQueue.js';

export default class RecommendHandler {
  constructor(bot, supabaseService) {
    this.bot = bot;
    this.supabaseService = supabaseService;
    this.mergeSort = new MergeSort();
    this.quickSort = new QuickSort();
  }

  /**
   * Handle recommend command
   */
  async handle(msg, criteria) {
    try {
      const equipment = await this.supabaseService.getAllEquipment();
      
      if (!equipment || equipment.length === 0) {
        await this.bot.sendMessage(msg.chat.id, 'No equipment available at the moment.');
        return;
      }

      let sorted = [];
      let algorithm = '';
      let criteriaText = '';

      criteria = criteria.toLowerCase().trim();

      switch (criteria) {
        case 'price':
        case 'cheap':
        case 'low':
          // Sort by price ascending using Quick Sort
          sorted = this.quickSort.sort(equipment, null, 'price_per_day', 'asc');
          algorithm = 'Quick Sort (Divide & Conquer)';
          criteriaText = 'Lowest Price';
          break;

        case 'rating':
        case 'best':
        case 'top':
          // Sort by rating descending using Merge Sort (stable)
          sorted = this.mergeSort.sort(equipment, null, 'rating', 'desc');
          algorithm = 'Merge Sort (Stable)';
          criteriaText = 'Highest Rating';
          break;

        case 'popular':
        case 'popularity':
          // Use Priority Queue for top-k by combined score
          const pq = new MaxPriorityQueue((a, b) => {
            const scoreA = (a.rating || 3) * (a.rental_count || 1);
            const scoreB = (b.rating || 3) * (b.rental_count || 1);
            return scoreA - scoreB;
          });

          equipment.forEach(eq => pq.enqueue(eq));
          sorted = pq.topK(10);
          algorithm = 'Priority Queue (Max Heap)';
          criteriaText = 'Most Popular';
          break;

        default:
          // Default: multi-criteria sorting (price + rating)
          sorted = this.quickSort.multiCriteriaSort(equipment, [
            { field: 'rating', order: 'desc' },
            { field: 'price_per_day', order: 'asc' }
          ]);
          algorithm = 'Multi-Criteria Quick Sort';
          criteriaText = 'Best Value (Rating + Price)';
      }

      // Take top 5 recommendations
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

      await this.bot.sendMessage(msg.chat.id, message, {
        parse_mode: 'Markdown',
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
      await this.bot.sendMessage(msg.chat.id, 'Error generating recommendations.');
    }
  }
}

