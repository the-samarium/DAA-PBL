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
    
    // Simple location mapping for common cities (can be expanded)
    this.locationMap = {
      'delhi': { latitude: 28.6139, longitude: 77.2090, name: 'Delhi' },
      'mumbai': { latitude: 19.0760, longitude: 72.8777, name: 'Mumbai' },
      'bangalore': { latitude: 12.9716, longitude: 77.5946, name: 'Bangalore' },
      'chennai': { latitude: 13.0827, longitude: 80.2707, name: 'Chennai' },
      'kolkata': { latitude: 22.5726, longitude: 88.3639, name: 'Kolkata' },
      'hyderabad': { latitude: 17.3850, longitude: 78.4867, name: 'Hyderabad' },
      'pune': { latitude: 18.5204, longitude: 73.8567, name: 'Pune' },
      'ahmedabad': { latitude: 23.0225, longitude: 72.5714, name: 'Ahmedabad' },
      'jaipur': { latitude: 26.9124, longitude: 75.7873, name: 'Jaipur' },
      'lucknow': { latitude: 26.8467, longitude: 80.9462, name: 'Lucknow' }
    };
  }

  /**
   * Geocode location query to coordinates
   * @param {string} query - Location query string
   * @returns {Object|null} - {latitude, longitude, name} or null
   */
  geocodeLocation(query) {
    const queryLower = query.toLowerCase().trim();
    
    // Check exact match first
    if (this.locationMap[queryLower]) {
      return this.locationMap[queryLower];
    }
    
    // Check partial matches
    for (const [key, value] of Object.entries(this.locationMap)) {
      if (key.includes(queryLower) || queryLower.includes(key)) {
        return value;
      }
    }
    
    return null;
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
      // Get equipment with latitude and longitude from database
      const equipment = await this.supabaseService.getEquipmentWithLocations();
      
      if (equipment.length === 0) {
        await this.bot.sendMessage(
          msg.chat.id,
          'No equipment with location data available. Equipment must have latitude and longitude values.'
        );
        return;
      }

      // Geocode the location query to get coordinates
      const userLocation = this.geocodeLocation(locationQuery);
      
      if (!userLocation) {
        await this.bot.sendMessage(
          msg.chat.id,
          `Location "${locationQuery}" not recognized.\n\nTry: Delhi, Mumbai, Bangalore, Chennai, Kolkata, Hyderabad, Pune, Ahmedabad, Jaipur, or Lucknow.\n\nOr share your location using the button below.`,
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
        return;
      }

      // Calculate distances using Haversine formula (Dijkstra concept for distance calculation)
      // Filter equipment with valid latitude/longitude and calculate distances
      const equipmentWithDistance = equipment
        .filter(eq => {
          // Ensure latitude and longitude exist and are valid numbers
          const lat = parseFloat(eq.latitude);
          const lon = parseFloat(eq.longitude);
          return !isNaN(lat) && !isNaN(lon) && 
                 lat >= -90 && lat <= 90 && 
                 lon >= -180 && lon <= 180;
        })
        .map(eq => {
          // Parse latitude and longitude from database (they're DECIMAL/Double type)
          const eqLat = parseFloat(eq.latitude);
          const eqLon = parseFloat(eq.longitude);
          
          // Calculate distance using Haversine formula (O(1) time complexity)
          const distance = calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            eqLat,
            eqLon
          );
          
          return { 
            ...eq, 
            distance,
            // Store parsed coordinates for reference
            parsedLat: eqLat,
            parsedLon: eqLon
          };
        })
        .sort((a, b) => a.distance - b.distance) // Sort by distance (greedy approach)
        .slice(0, 5); // Get top 5 nearest

      if (equipmentWithDistance.length === 0) {
        await this.bot.sendMessage(
          msg.chat.id,
          'No nearby equipment found.'
        );
        return;
      }

      let message = `📍 *Nearby Equipment*\n\n`;
      message += `*Your Location:* ${userLocation.name} (${userLocation.latitude}, ${userLocation.longitude})\n`;
      message += `*Algorithm:* Haversine Distance + Greedy Selection\n`;
      message += `*Time Complexity:* O(n) where n = equipment count\n`;
      message += `*Distance Formula:* Haversine (calculates great-circle distance)\n\n`;
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

      // Calculate distances using user's actual location (shared via Telegram)
      // Filter and validate latitude/longitude from database
      const equipmentWithDistance = equipment
        .filter(eq => {
          // Ensure latitude and longitude exist and are valid numbers
          const lat = parseFloat(eq.latitude);
          const lon = parseFloat(eq.longitude);
          return !isNaN(lat) && !isNaN(lon) && 
                 lat >= -90 && lat <= 90 && 
                 lon >= -180 && lon <= 180;
        })
        .map(eq => {
          // Parse latitude and longitude from database columns
          const eqLat = parseFloat(eq.latitude);
          const eqLon = parseFloat(eq.longitude);
          
          // Calculate distance using Haversine formula
          const distance = calculateDistance(
            location.latitude,  // User's location from Telegram
            location.longitude, // User's location from Telegram
            eqLat,              // Equipment latitude from database
            eqLon               // Equipment longitude from database
          );
          
          return { 
            ...eq, 
            distance,
            parsedLat: eqLat,
            parsedLon: eqLon
          };
        })
        .sort((a, b) => a.distance - b.distance) // Sort by distance
        .slice(0, 5); // Get top 5 nearest

      if (equipmentWithDistance.length === 0) {
        await this.bot.sendMessage(msg.chat.id, 'No nearby equipment found.');
        return;
      }

      let message = `📍 *Equipment Near Your Location*\n\n`;
      message += `*Your Location:* ${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}\n`;
      message += `*Algorithm:* Haversine Distance + Greedy Selection\n`;
      message += `*Time Complexity:* O(n) where n = equipment count\n`;
      message += `*Distance Formula:* Haversine (great-circle distance)\n\n`;
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

