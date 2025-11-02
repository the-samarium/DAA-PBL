# Environment Setup Instructions

## Create .env File

Since `.env.example` is blocked by `.gitignore`, follow these steps:

### Option 1: Copy from template
```bash
cd telegram-bot
cp env.template .env
```

### Option 2: Create manually
Create a new file named `.env` in the `telegram-bot/` directory with the following content:

```env
# Telegram Bot Configuration
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
TELEGRAM_WEBHOOK_URL=https://your-domain.com/api/telegram/webhook

# Supabase Configuration
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Bot Server Configuration
BOT_PORT=3001
NODE_ENV=development

# Optional: API Keys
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

### Option 3: Use PowerShell (Windows)
```powershell
cd telegram-bot
Copy-Item env.template .env
```

## Getting Your Values

1. **TELEGRAM_BOT_TOKEN:**
   - Create a bot via [@BotFather](https://t.me/BotFather) on Telegram
   - Send `/newbot` and follow instructions
   - Copy the bot token provided

2. **SUPABASE_URL:**
   - Found in your Supabase project settings
   - Format: `https://xxxxx.supabase.co`

3. **SUPABASE_SERVICE_ROLE_KEY:**
   - Found in Supabase project settings > API
   - Use Service Role Key (not anon key) for bot operations

4. **BOT_PORT:**
   - Default: 3001
   - Change if you need a different port

## Verify Setup

After creating `.env`, verify it exists:
```bash
cd telegram-bot
ls -la .env  # Linux/Mac
dir .env     # Windows CMD
Get-ChildItem .env  # Windows PowerShell
```

The `.env` file should be ignored by git (in `.gitignore`), so it won't be committed to version control.

