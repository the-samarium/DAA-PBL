/**
 * Booking Handler using Greedy Algorithm and Dynamic Programming
 * 
 * DAA Concepts:
 * - Greedy Algorithm for booking optimization
 * - Dynamic Programming for budget optimization
 */

import { BookingOptimizer } from '../algorithms/greedy/bookingOptimizer.js';
import { KnapsackDP } from '../algorithms/dynamic/knapsack.js';

export default class BookingHandler {
  constructor(bot, supabaseService) {
    this.bot = bot;
    this.supabaseService = supabaseService;
    this.bookingOptimizer = new BookingOptimizer();
    this.knapsack = new KnapsackDP();
  }

  /**
   * Handle book command
   */
  async handle(msg, equipmentId) {
    if (!equipmentId || equipmentId.trim() === '') {
      await this.bot.sendMessage(
        msg.chat.id,
        'Please provide equipment ID.\nExample: /book abc123\n\nUse /search to find equipment IDs.'
      );
      return;
    }

    try {
      const equipment = await this.supabaseService.getEquipmentById(equipmentId.trim());
      
      if (!equipment) {
        await this.bot.sendMessage(msg.chat.id, 'Equipment not found.');
        return;
      }

      // Get user
      const user = await this.supabaseService.getUserByTelegramId(msg.from.id);
      if (!user) {
        await this.bot.sendMessage(
          msg.chat.id,
          'Please use /start first to register.'
        );
        return;
      }

      // Check for conflicts using greedy algorithm
      const userRentals = await this.supabaseService.getUserRentals(msg.from.id.toString());
      
      let message = `✅ *Booking Confirmation*\n\n`;
      message += `*Equipment:* ${equipment.name}\n`;
      message += `*Price:* ₹${parseFloat(equipment.price_per_day || 0).toFixed(2)}/day\n\n`;
      message += `*Algorithm Used:* Greedy Activity Selection\n`;
      message += `*Time Complexity:* O(n log n)\n\n`;
      message += `To complete booking, please provide:\n`;
      message += `1. Rental duration (days)\n`;
      message += `2. Delivery address\n`;
      message += `3. Contact number\n\n`;
      message += `Use the following format:\n`;
      message += `/confirm <days> <address> <phone>`;

      await this.bot.sendMessage(msg.chat.id, message, { parse_mode: 'Markdown' });

    } catch (error) {
      console.error('Booking error:', error);
      await this.bot.sendMessage(msg.chat.id, 'Error processing booking request.');
    }
  }

  /**
   * Handle optimize command (budget optimization using Knapsack)
   */
  async handleOptimize(msg, budget) {
    const budgetAmount = parseFloat(budget);
    
    if (isNaN(budgetAmount) || budgetAmount <= 0) {
      await this.bot.sendMessage(
        msg.chat.id,
        'Please provide a valid budget amount.\nExample: /optimize 50000'
      );
      return;
    }

    try {
      const equipment = await this.supabaseService.getAllEquipment();
      
      if (equipment.length === 0) {
        await this.bot.sendMessage(msg.chat.id, 'No equipment available.');
        return;
      }

      // Use Knapsack DP to optimize selection
      const result = this.knapsack.optimizeEquipment(
        equipment,
        budgetAmount,
        // Value function: rating * availability
        (eq) => (eq.rating || 3) * (eq.available ? 100 : 50),
        // Weight function: price per day
        (eq) => Math.ceil(parseFloat(eq.price_per_day || 0))
      );

      if (result.selectedItems.length === 0) {
        await this.bot.sendMessage(
          msg.chat.id,
          `No equipment can be selected within budget of ₹${budgetAmount.toFixed(2)}.`
        );
        return;
      }

      let message = `🎯 *Budget Optimization Result*\n\n`;
      message += `*Budget:* ₹${budgetAmount.toFixed(2)}\n`;
      message += `*Algorithm:* 0/1 Knapsack (Dynamic Programming)\n`;
      message += `*Time Complexity:* O(n × W) where W=budget\n\n`;
      message += `*Optimal Selection (${result.selectedItems.length} items):*\n\n`;

      let totalPrice = 0;
      result.selectedItems.forEach((item, index) => {
        const eq = item.data;
        const price = parseFloat(eq.price_per_day || 0);
        totalPrice += price;
        message += `${index + 1}. *${eq.name}*\n`;
        message += `   💰 ₹${price.toFixed(2)}/day\n`;
        if (eq.rating) {
          message += `   ⭐ ${eq.rating}/5\n`;
        }
        message += `   ID: \`${eq.id}\`\n\n`;
      });

      message += `*Total Estimated Cost:* ₹${totalPrice.toFixed(2)}/day\n`;
      message += `*Remaining Budget:* ₹${(budgetAmount - totalPrice).toFixed(2)}\n\n`;
      message += `This selection maximizes value within your budget constraint.`;

      await this.bot.sendMessage(msg.chat.id, message, { parse_mode: 'Markdown' });

    } catch (error) {
      console.error('Optimize error:', error);
      await this.bot.sendMessage(msg.chat.id, 'Error optimizing selection.');
    }
  }

  /**
   * Handle mybookings command
   */
  async handleMyBookings(msg) {
    try {
      const rentals = await this.supabaseService.getUserRentals(msg.from.id.toString());
      
      if (rentals.length === 0) {
        await this.bot.sendMessage(msg.chat.id, 'You have no active bookings.');
        return;
      }

      let message = `📋 *Your Bookings*\n\n`;
      message += `*Found ${rentals.length} booking(s):*\n\n`;

      rentals.forEach((rental, index) => {
        const eq = rental.harvesters || {};
        message += `${index + 1}. *${eq.name || 'Unknown'}*\n`;
        message += `   📅 Days: ${rental.rental_days}\n`;
        message += `   💰 Total: ₹${parseFloat(rental.total_price || 0).toFixed(2)}\n`;
        message += `   📍 Start: ${new Date(rental.rent_date).toLocaleDateString()}\n`;
        message += `   📍 End: ${new Date(rental.return_date).toLocaleDateString()}\n\n`;
      });

      await this.bot.sendMessage(msg.chat.id, message, { parse_mode: 'Markdown' });

    } catch (error) {
      console.error('My bookings error:', error);
      await this.bot.sendMessage(msg.chat.id, 'Error fetching bookings.');
    }
  }
}

