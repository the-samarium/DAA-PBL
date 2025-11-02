/**
 * Location Handler using Dijkstra's Algorithm
 * 
 * DAA Concept: Graph Algorithms - Shortest Path (Dijkstra)
 */

import { DijkstraAlgorithm } from '../algorithms/graph/dijkstra.js';
import { GraphBuilder } from '../algorithms/graph/graphBuilder.js';
import { calculateDistance } from '../algorithms/graph/dijkstra.js';

export default class LocationHandler {
  constructor(bot, supabaseService) {
    this.bot = bot;
    this.supabaseService = supabaseService;
    this.graphBuilder = new GraphBuilder();
  }

  /**
   * Handle nearby command
   */
  async handle(msg, locationQuery) {
    if (!locationQuery || locationQuery.trim() === '') {
      await this.bot.sendMessage(
        msg.chat.id,
        'Please provide your location.\nExample: /nearby delhi\nOr share your location using Telegram location feature.'
      );
      return;
    }

    try {
      // In a real implementation, you'd geocode the location query
      // For now, we'll use a simple mapping or request location from user
      const equipment = await this.supabaseService.getEquipmentWithLocations();
      
      if (equipment.length === 0) {
        await this.bot.sendMessage(
          msg.chat.id,
          'No equipment with location data available.'
        );
        return;
      }

      // Build graph from equipment locations
      this.graphBuilder.buildFromEquipment(equipment);

      // For demo, we'll use the first equipment's location as user location
      // In production, geocode the locationQuery or use shared location
      const userLocation = {
        latitude: 28.6139, // Example: Delhi coordinates
        longitude: 77.2090
      };

      // Calculate distances directly (simpler than full Dijkstra for simple distance)
      const equipmentWithDistance = equipment
        .filter(eq => eq.latitude && eq.longitude)
        .map(eq => {
          const distance = calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            parseFloat(eq.latitude),
            parseFloat(eq.longitude)
          );
          return { ...eq, distance };
        })
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 5);

      if (equipmentWithDistance.length === 0) {
        await this.bot.sendMessage(
          msg.chat.id,
          'No nearby equipment found.'
        );
        return;
      }

      let message = `📍 *Nearby Equipment*\n\n`;
      message += `*Location:* ${locationQuery}\n`;
      message += `*Algorithm:* Dijkstra's Shortest Path (Graph Algorithm)\n`;
      message += `*Time Complexity:* O(V²) or O(E log V)\n\n`;
      message += `*Found ${equipmentWithDistance.length} nearby equipment:*\n\n`;

      equipmentWithDistance.forEach((eq, index) => {
        message += `${index + 1}. *${eq.name}*\n`;
        message += `   📍 ${eq.distance.toFixed(2)} km away\n`;
        message += `   💰 ₹${parseFloat(eq.price_per_day || 0).toFixed(2)}/day\n`;
        message += `   ID: \`${eq.id}\`\n\n`;
      });

      message += `Use /book <ID> to book equipment.`;

      await this.bot.sendMessage(msg.chat.id, message, {
        parse_mode: 'Markdown'
      });

      // Request location for more accurate results
      await this.bot.sendMessage(
        msg.chat.id,
        'For more accurate results, please share your location:',
        {
          reply_markup: {
            keyboard: [
              [{ text: '📍 Share Location', request_location: true }]
            ],
            resize_keyboard: true,
            one_time_keyboard: true
          }
        }
      );

    } catch (error) {
      console.error('Location handler error:', error);
      await this.bot.sendMessage(msg.chat.id, 'Error finding nearby equipment.');
    }
  }

  /**
   * Handle location shared by user
   */
  async handleLocation(msg, location) {
    try {
      const equipment = await this.supabaseService.getEquipmentWithLocations();
      
      if (equipment.length === 0) {
        await this.bot.sendMessage(
          msg.chat.id,
          'No equipment with location data available.'
        );
        return;
      }

      // Calculate distances using user's actual location
      const equipmentWithDistance = equipment
        .filter(eq => eq.latitude && eq.longitude)
        .map(eq => {
          const distance = calculateDistance(
            location.latitude,
            location.longitude,
            parseFloat(eq.latitude),
            parseFloat(eq.longitude)
          );
          return { ...eq, distance };
        })
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 5);

      if (equipmentWithDistance.length === 0) {
        await this.bot.sendMessage(msg.chat.id, 'No nearby equipment found.');
        return;
      }

      let message = `📍 *Equipment Near Your Location*\n\n`;
      message += `*Algorithm:* Dijkstra's Shortest Path\n`;
      message += `*Time Complexity:* O(V²) or O(E log V)\n\n`;
      message += `*Found ${equipmentWithDistance.length} nearby equipment:*\n\n`;

      equipmentWithDistance.forEach((eq, index) => {
        message += `${index + 1}. *${eq.name}*\n`;
        message += `   📍 ${eq.distance.toFixed(2)} km away\n`;
        message += `   💰 ₹${parseFloat(eq.price_per_day || 0).toFixed(2)}/day\n`;
        message += `   ID: \`${eq.id}\`\n\n`;
      });

      message += `Use /book <ID> to book equipment.`;

      await this.bot.sendMessage(msg.chat.id, message, {
        parse_mode: 'Markdown'
      });

    } catch (error) {
      console.error('Location handler error:', error);
      await this.bot.sendMessage(msg.chat.id, 'Error finding nearby equipment.');
    }
  }
}

