# Debugging Telegram Bot Issues

## TELEGRAM_WEBHOOK_URL - NOT NEEDED for Polling Mode

**Important:** Your bot uses **polling mode** (not webhooks), so `TELEGRAM_WEBHOOK_URL` is **completely optional** and can be ignored for now.

### When to Use Webhooks:
- Only if you switch to webhook mode
- Format: `https://your-domain.com/api/telegram/webhook`
- Only needed for production deployment

## Troubleshooting "Can't Get Equipment"

### Issue 1: Bot Not Responding to Commands

**Check:**
1. Is bot running? Check console for "🤖 AgriLink Telegram Bot is running!"
2. Is `TELEGRAM_BOT_TOKEN` set correctly in `.env`?
3. Try `/start` command - should get welcome message

**Fix:**
```bash
# Check .env file exists
cd telegram-bot
cat .env  # or type .env on Windows
```

### Issue 2: Database Access Issues (Most Likely)

**Problem:** RLS (Row Level Security) policies might be blocking access.

**Check if data exists:**
```sql
-- Run in Supabase SQL Editor
SELECT COUNT(*) FROM harvesters;
SELECT * FROM harvesters LIMIT 5;
```

**Fix RLS Policies:**
The bot needs access to read data. Run this SQL:

```sql
-- Drop existing policy if exists
DROP POLICY IF EXISTS "harvesters_select_public" ON harvesters;

-- Create policy that allows bot to read (using service role key bypasses RLS)
-- OR create a policy that allows all reads
CREATE POLICY "harvesters_select_public" ON harvesters
FOR SELECT USING (true);

-- If using service role key, RLS is bypassed automatically
-- But if using anon key, you need the policy above
```

### Issue 3: Wrong Supabase Credentials

**Check your `.env` file:**

```env
# Required for bot
TELEGRAM_BOT_TOKEN=your_actual_token_here

# Supabase - use ONE of these options:

# Option A: Use NEXT_PUBLIC_ variables (simpler)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# Option B: Use service role key (recommended, bypasses RLS)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

**Get Service Role Key:**
1. Supabase Dashboard → Settings → API
2. Copy "service_role" key (not "anon" key)
3. Add to `.env` as `SUPABASE_SERVICE_ROLE_KEY`

### Issue 4: Test Database Connection

Add this test to `server.js` temporarily:

```javascript
// After supabaseService initialization
supabaseService.getAllEquipment()
  .then(data => {
    console.log('✅ Database connection OK');
    console.log(`✅ Found ${data.length} equipment items`);
    if (data.length > 0) {
      console.log('Sample:', data[0].name);
    }
  })
  .catch(err => {
    console.error('❌ Database error:', err);
  });
```

## Step-by-Step Debugging

### Step 1: Verify Bot Token
- Check `.env` has correct `TELEGRAM_BOT_TOKEN`
- Bot should respond to `/start`

### Step 2: Check Database Connection
- Restart bot and check console for errors
- Look for "Error fetching equipment" messages

### Step 3: Test Direct Database Query
Run in Supabase SQL Editor:
```sql
SELECT * FROM harvesters;
```

### Step 4: Check RLS Policies
Run in Supabase SQL Editor:
```sql
-- Check existing policies
SELECT * FROM pg_policies WHERE tablename = 'harvesters';

-- If no public read policy, create one:
DROP POLICY IF EXISTS "harvesters_select_public" ON harvesters;
CREATE POLICY "harvesters_select_public" ON harvesters
FOR SELECT USING (true);
```

### Step 5: Use Service Role Key
- Switch from anon key to service role key in `.env`
- Service role key bypasses RLS automatically

## Quick Fix SQL

If equipment exists but bot can't access it:

```sql
-- Allow public reads (for bot)
DROP POLICY IF EXISTS "harvesters_select_public" ON harvesters;
CREATE POLICY "harvesters_select_public" ON harvesters
FOR SELECT USING (true);

-- Or disable RLS temporarily for testing (NOT for production)
-- ALTER TABLE harvesters DISABLE ROW LEVEL SECURITY;
```

## Expected Behavior

✅ **Working:**
- `/start` → Welcome message
- `/search combine` → Shows equipment results
- `/recommend price` → Shows sorted equipment

❌ **Not Working:**
- Commands get no response
- Error messages in bot console
- "No equipment available" even though data exists

## Still Not Working?

1. Check bot console output for errors
2. Share the error message you see
3. Verify `.env` file is in `telegram-bot/` directory (not root)
4. Restart bot after changing `.env`

