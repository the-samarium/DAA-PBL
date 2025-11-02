/**
 * Booking Handler
 * Redirects users to website for booking operations
 */

import { WEBSITE_ROUTES } from '../config/website.js';

export default class BookingHandler {
  constructor(bot, supabaseService) {
    this.bot = bot;
    this.supabaseService = supabaseService;
  }

  /**
   * Handle book command
   */
  async handle(msg, equipmentId) {
    try {
      let message = `📖 *Booking Information*\n\n`;
      
      if (equipmentId && equipmentId.trim() !== '') {
        // If equipment ID provided, show equipment details
        try {
          const equipment = await this.supabaseService.getEquipmentById(equipmentId.trim());
          
          if (equipment) {
            message += `*Equipment:* ${equipment.name}\n`;
            message += `*Price:* ₹${parseFloat(equipment.price_per_day || 0).toFixed(2)}/day\n\n`;
            if (equipment.description) {
              message += `*Description:* ${equipment.description}\n\n`;
            }
          } else {
            message += `Equipment not found.\n\n`;
          }
        } catch (error) {
          console.error('Error fetching equipment:', error);
        }
      }
      
      message += `🌐 *To Book Equipment:*\n\n`;
      message += `Please visit our website to complete your booking:\n`;
      const checkoutUrl = WEBSITE_ROUTES.checkout(equipmentId && equipmentId.trim() !== '' ? equipmentId.trim() : null);
      message += `🔗 ${checkoutUrl}\n\n`;
      message += `On the website, you can:\n`;
      message += `• Complete the booking process\n`;
      message += `• Select rental duration\n`;
      message += `• Enter delivery details\n`;
      message += `• Make secure payment\n\n`;
      message += `Use /search or /recommend to find equipment IDs first.`;

      await this.bot.sendMessage(msg.chat.id, message, { parse_mode: 'Markdown' });

    } catch (error) {
      console.error('Booking error:', error);
      await this.bot.sendMessage(msg.chat.id, 'Error processing request.');
    }
  }


  /**
   * Handle mybookings command
   */
  async handleMyBookings(msg) {
    try {
      let message = `📋 *View Your Bookings*\n\n`;
      message += `🌐 *Visit Our Website:*\n\n`;
      message += `To view your bookings, please visit:\n`;
      message += `🔗 ${WEBSITE_ROUTES.myBookings}\n\n`;
      message += `Or see your rental history at:\n`;
      message += `🔗 ${WEBSITE_ROUTES.history}\n\n`;
      message += `On the website, you can:\n`;
      message += `• View all your bookings\n`;
      message += `• See rental history\n`;
      message += `• Check booking details\n`;
      message += `• Manage your rentals`;

      await this.bot.sendMessage(msg.chat.id, message, { parse_mode: 'Markdown' });

    } catch (error) {
      console.error('My bookings error:', error);
      await this.bot.sendMessage(msg.chat.id, 'Error processing request.');
    }
  }
}

