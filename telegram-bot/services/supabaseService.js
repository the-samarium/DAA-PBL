/**
 * Supabase Service for Telegram Bot
 * Handles database operations for equipment, users, bookings
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

// Support both naming conventions:
// 1. Bot-specific env vars (SUPABASE_URL, SUPABASE_ANON_KEY)
// 2. Next.js env vars (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY)
const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY 
  || process.env.SUPABASE_ANON_KEY 
  || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase credentials not found in environment variables. Please set SUPABASE_URL and SUPABASE_ANON_KEY (or NEXT_PUBLIC_ versions)');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

export class SupabaseService {
  /**
   * Get all available equipment
   */
  async getAllEquipment() {
    const { data, error } = await supabase
      .from('harvesters')
      .select('*');
      // Note: Removed .eq('available', true) as 'available' column may not exist

    if (error) {
      console.error('Error fetching equipment:', error);
      return [];
    }
    return data || [];
  }

  /**
   * Get equipment by ID
   */
  async getEquipmentById(id) {
    const { data, error } = await supabase
      .from('harvesters')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Search equipment by name
   */
  async searchEquipmentByName(query) {
    const { data, error } = await supabase
      .from('harvesters')
      .select('*')
      .ilike('name', `%${query}%`)
      .limit(20);
      // Note: Removed .eq('available', true) as 'available' column may not exist

    if (error) {
      console.error('Error searching equipment:', error);
      return [];
    }
    return data || [];
  }

  /**
   * Get equipment by price range
   */
  async getEquipmentByPriceRange(minPrice, maxPrice) {
    const { data, error } = await supabase
      .from('harvesters')
      .select('*')
      .gte('price_per_day', minPrice)
      .lte('price_per_day', maxPrice)
      .order('price_per_day', { ascending: true });
      // Note: Removed .eq('available', true) as 'available' column may not exist

    if (error) {
      console.error('Error fetching equipment by price:', error);
      return [];
    }
    return data || [];
  }

  /**
   * Get user by Telegram ID
   * Note: Uses auth.users table if 'users' table doesn't exist
   */
  async getUserByTelegramId(telegramId) {
    // Try public.users table first
    let { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('telegram_id', telegramId)
      .single();

    // If table doesn't exist, return null (will create entry)
    if (error && error.code === 'PGRST205') {
      console.log('users table not found, will create entry');
      return null;
    }
    
    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching user:', error);
      return null;
    }
    
    return data;
  }

  /**
   * Create or update user from Telegram
   * Creates in public.users table (must be created via SQL first)
   */
  async upsertTelegramUser(telegramUser) {
    try {
      const { data, error } = await supabase
        .from('users')
        .upsert({
          telegram_id: telegramUser.id.toString(),
          username: telegramUser.username || null,
          first_name: telegramUser.first_name || null,
          last_name: telegramUser.last_name || null,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'telegram_id'
        })
        .select()
        .single();

      if (error) {
        // If users table doesn't exist, log but don't fail
        if (error.code === 'PGRST205') {
          console.log('users table not found. Create it using telegram-bot-schema.sql');
          return { telegram_id: telegramUser.id.toString(), ...telegramUser };
        }
        throw error;
      }
      return data;
    } catch (error) {
      console.error('Error upserting user:', error);
      // Return a basic user object so bot doesn't fail
      return { telegram_id: telegramUser.id.toString(), ...telegramUser };
    }
  }

  /**
   * Get user's rentals
   */
  async getUserRentals(telegramId) {
    try {
      const user = await this.getUserByTelegramId(telegramId);
      if (!user || !user.id) {
        // Try to get rentals using telegram_id directly if users table doesn't exist
        // This requires rentals table to have telegram_id column
        return [];
      }

      const { data, error } = await supabase
        .from('rentals')
        .select('*, harvesters(*)')
        .eq('user_id', user.id)
        .order('rent_date', { ascending: false });

      if (error) {
        console.error('Error fetching rentals:', error);
        return [];
      }
      return data || [];
    } catch (error) {
      console.error('Error in getUserRentals:', error);
      return [];
    }
  }

  /**
   * Create rental
   */
  async createRental(userId, harvesterId, rentalDays, totalPrice, customerInfo) {
    const rentDate = new Date();
    const returnDate = new Date();
    returnDate.setDate(returnDate.getDate() + rentalDays);

    const { data, error } = await supabase
      .from('rentals')
      .insert({
        user_id: userId,
        harvester_id: harvesterId,
        rental_days: rentalDays,
        total_price: totalPrice,
        rent_date: rentDate.toISOString(),
        return_date: returnDate.toISOString(),
        customer_name: customerInfo.name,
        contact_number: customerInfo.contact,
        delivery_address: customerInfo.address
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Get equipment with location data
   */
  async getEquipmentWithLocations() {
    try {
      // Assuming you have location columns or a separate locations table
      const { data, error } = await supabase
        .from('harvesters')
        .select('*')
        .not('latitude', 'is', null)
        .not('longitude', 'is', null);
        // Note: Removed .eq('available', true) as 'available' column may not exist

      if (error) {
        console.error('Error fetching equipment with locations:', error);
        // If latitude/longitude columns don't exist, return all equipment
        const { data: allData } = await supabase
          .from('harvesters')
          .select('*');
        return allData || [];
      }
      return data || [];
    } catch (error) {
      console.error('Error in getEquipmentWithLocations:', error);
      return [];
    }
  }
}

