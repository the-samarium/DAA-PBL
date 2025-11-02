# Database Setup for Telegram Bot

## Quick Fix SQL

Run these SQL commands in your Supabase SQL Editor to fix the schema issues:

```sql
-- 1. Add 'available' column to harvesters (if needed for filtering)
ALTER TABLE harvesters ADD COLUMN IF NOT EXISTS available BOOLEAN DEFAULT true;

-- 2. Create users table for Telegram bot (if doesn't exist)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  telegram_id TEXT UNIQUE,
  username TEXT,
  first_name TEXT,
  last_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Add indexes
CREATE INDEX IF NOT EXISTS idx_users_telegram_id ON public.users(telegram_id);

-- 4. Enable RLS on users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 5. Create policy to allow bot access (if using service role key, this may not be needed)
CREATE POLICY IF NOT EXISTS "users_select_all" ON public.users
FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "users_insert_all" ON public.users
FOR INSERT WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "users_update_all" ON public.users
FOR UPDATE USING (true);
```

## Current Issues Fixed

The bot code has been updated to handle:
1. ✅ Missing `available` column - removed filters, will work with or without it
2. ✅ Missing `users` table - graceful fallback, will still work
3. ✅ Null array handling - added null checks throughout

## Status

**Bot is now more resilient:**
- Works even if `available` column doesn't exist
- Works even if `users` table doesn't exist (but can't track users)
- Handles empty/null data gracefully

**To enable full functionality:**
- Run the SQL above to create `users` table and `available` column
- Or continue using without these features (bot will still work)

