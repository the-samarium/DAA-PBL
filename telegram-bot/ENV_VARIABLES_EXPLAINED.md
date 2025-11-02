# Environment Variables Explained

## Quick Answer: Yes, you can use `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`

The bot code has been updated to support both naming conventions. However, there are important considerations:

## Two Options

### Option 1: Reuse Next.js Variables (Easier)
If you've already added these to your root `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**You need to:**
1. Create `telegram-bot/.env` file
2. Add these same variables (can copy from root `.env.local`)
3. The bot will automatically use them

**Example `telegram-bot/.env`:**
```env
TELEGRAM_BOT_TOKEN=your_bot_token
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
BOT_PORT=3001
```

### Option 2: Use Service Role Key (Recommended for Production)
For better security and functionality, use the Service Role Key:

```env
TELEGRAM_BOT_TOKEN=your_bot_token
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
BOT_PORT=3001
```

## Important Differences

### `NEXT_PUBLIC_SUPABASE_ANON_KEY` (Anon Key)
- ✅ Will work for basic operations
- ⚠️ Subject to Row Level Security (RLS) policies
- ⚠️ May have restrictions on some operations
- ✅ Safe for client-side use (public)

### `SUPABASE_SERVICE_ROLE_KEY` (Service Role Key)
- ✅ Bypasses RLS (can access all data)
- ✅ Required for operations like:
  - Creating users via bot
  - Inserting rentals on behalf of users
  - Admin operations
- ⚠️ **NEVER** expose this in client-side code
- ✅ Perfect for server-side bot operations

## Recommendation

**For Development:** 
- You can use `NEXT_PUBLIC_SUPABASE_ANON_KEY` to get started quickly

**For Production:**
- Use `SUPABASE_SERVICE_ROLE_KEY` for full bot functionality
- Keep anon key for Next.js frontend

## Where to Get Service Role Key

1. Go to your Supabase project dashboard
2. Settings → API
3. Copy "service_role" key (not "anon" key)
4. Add it to `telegram-bot/.env` as `SUPABASE_SERVICE_ROLE_KEY`

## Priority Order

The bot checks environment variables in this order:
1. `SUPABASE_SERVICE_ROLE_KEY` (best for bot)
2. `SUPABASE_ANON_KEY`
3. `NEXT_PUBLIC_SUPABASE_ANON_KEY` (fallback)

This means if you set both, it will prefer the service role key.

## Current Setup Status

✅ **Yes, your setup is okay!** The bot will work with:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Just make sure they're in the `telegram-bot/.env` file (or the bot server can access them from your root `.env.local` if you're loading them globally).

