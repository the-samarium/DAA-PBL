/**
 * Quick test script to verify database connection
 * Run: node test-connection.js
 */

import dotenv from 'dotenv';
import { SupabaseService } from './services/supabaseService.js';

dotenv.config();

console.log('🔍 Testing Database Connection...\n');

// Check environment variables
const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('Environment Check:');
console.log('  SUPABASE_URL:', supabaseUrl ? '✅ Set' : '❌ Missing');
console.log('  SUPABASE_KEY:', supabaseKey ? '✅ Set' : '❌ Missing');
console.log('  Key Type:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Service Role ✅' : 'Anon Key');
console.log('');

// Test database connection
const service = new SupabaseService();

service.getAllEquipment()
  .then(data => {
    console.log('✅ Database Connection: SUCCESS');
    console.log(`✅ Found ${data.length} equipment items\n`);
    
    if (data.length > 0) {
      console.log('Sample Equipment:');
      data.slice(0, 3).forEach((eq, i) => {
        console.log(`  ${i + 1}. ${eq.name} - ₹${eq.price_per_day}/day`);
      });
    } else {
      console.log('⚠️  No equipment found in database');
      console.log('   Run CREATE_AND_INSERT.sql to add sample data');
    }
  })
  .catch(error => {
    console.error('❌ Database Connection: FAILED');
    console.error('Error:', error.message);
    console.error('Code:', error.code);
    console.error('\nPossible issues:');
    console.error('  1. Wrong Supabase URL or Key');
    console.error('  2. RLS policies blocking access');
    console.error('  3. Table does not exist');
    console.error('  4. Network connectivity issue');
  });

