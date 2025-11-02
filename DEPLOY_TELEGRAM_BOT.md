# Deploy Telegram Bot to Production (Vercel)

This guide explains how to make your Telegram bot live using Vercel deployment.

## Prerequisites

✅ Your Next.js website is deployed on Vercel at: `https://agrilink-daa-pbl.vercel.app/`
✅ You have a Telegram Bot Token from [@BotFather](https://t.me/BotFather)

## Step 1: Configure Environment Variables in Vercel

1. **Go to Vercel Dashboard**
   - Visit [vercel.com](https://vercel.com)
   - Select your project: `agrilink-daa-pbl`

2. **Navigate to Settings → Environment Variables**

3. **Add the following environment variables:**

   ```
   TELEGRAM_BOT_TOKEN=your_bot_token_here
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   NEXT_PUBLIC_SITE_URL=https://agrilink-daa-pbl.vercel.app
   ```

   **Important:**
   - Replace `your_bot_token_here` with your actual Telegram bot token
   - Replace Supabase credentials with your actual values
   - `NEXT_PUBLIC_SITE_URL` should match your Vercel deployment URL

4. **Select Environments:** Check all (Production, Preview, Development)

5. **Click "Save"**

6. **Redeploy:** Go to Deployments → Click "..." on latest deployment → "Redeploy"

## Step 2: Verify Webhook Endpoint

After redeployment, verify your webhook endpoint is accessible:

1. **Open browser and visit:**
   ```
   https://agrilink-daa-pbl.vercel.app/api/telegram/webhook
   ```

2. **Expected response:**
   ```json
   {
     "message": "Telegram webhook endpoint is active",
     "status": "ready",
     "url": "https://agrilink-daa-pbl.vercel.app/api/telegram/webhook"
   }
   ```

## Step 3: Set Webhook URL with Telegram

You need to tell Telegram where to send messages. Use one of these methods:

### Method 1: Using curl (Recommended)

Open your terminal/command prompt and run:

```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook?url=https://agrilink-daa-pbl.vercel.app/api/telegram/webhook"
```

**Replace `<YOUR_BOT_TOKEN>`** with your actual bot token.

**Example:**
```bash
curl -X POST "https://api.telegram.org/bot123456789:ABCdefGHIjklMNOpqrsTUVwxyz/setWebhook?url=https://agrilink-daa-pbl.vercel.app/api/telegram/webhook"
```

### Method 2: Using Browser

Open this URL in your browser (replace `<YOUR_BOT_TOKEN>`):

```
https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook?url=https://agrilink-daa-pbl.vercel.app/api/telegram/webhook
```

### Method 3: Using Telegram Bot API Website

1. Visit: https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook
2. Add parameter: `url=https://agrilink-daa-pbl.vercel.app/api/telegram/webhook`
3. Click "Send"

### Expected Response

If successful, you'll see:

```json
{
  "ok": true,
  "result": true,
  "description": "Webhook was set"
}
```

## Step 4: Verify Webhook is Set

Check if webhook is configured correctly:

```bash
curl "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getWebhookInfo"
```

**Expected response:**
```json
{
  "ok": true,
  "result": {
    "url": "https://agrilink-daa-pbl.vercel.app/api/telegram/webhook",
    "has_custom_certificate": false,
    "pending_update_count": 0
  }
}
```

## Step 5: Test Your Bot

1. **Open Telegram**
2. **Search for your bot** (by username from BotFather)
3. **Send `/start`** command
4. **You should receive a welcome message!**

Try these commands:
- `/help` - See all available commands
- `/search combine` - Search for equipment
- `/recommend price` - Get price recommendations
- `/recommend rating` - Get top-rated equipment
- `/recommend popular` - Get popular equipment

## Troubleshooting

### Bot Not Responding?

1. **Check Environment Variables:**
   - Go to Vercel Dashboard → Settings → Environment Variables
   - Verify `TELEGRAM_BOT_TOKEN` is set correctly
   - Redeploy after adding variables

2. **Check Webhook Status:**
   ```bash
   curl "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getWebhookInfo"
   ```
   
   Look for:
   - `url` should match your Vercel URL
   - `pending_update_count` shows unprocessed messages
   - `last_error_date` and `last_error_message` show recent errors

3. **Check Vercel Logs:**
   - Go to Vercel Dashboard → Your Project → Deployments
   - Click on latest deployment → "Functions" tab
   - Check `/api/telegram/webhook` logs for errors

4. **Verify Bot Token:**
   ```bash
   curl "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getMe"
   ```
   
   Should return bot information if token is valid.

### "Webhook was set" but Bot Not Working?

1. **Clear webhook and reset:**
   ```bash
   # Delete webhook
   curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/deleteWebhook"
   
   # Set webhook again
   curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook?url=https://agrilink-daa-pbl.vercel.app/api/telegram/webhook"
   ```

2. **Check SSL Certificate:**
   - Vercel provides SSL automatically
   - Ensure URL uses `https://` not `http://`

3. **Test endpoint manually:**
   Visit: `https://agrilink-daa-pbl.vercel.app/api/telegram/webhook`
   Should return JSON response (not error)

### "Unauthorized" or "Bad Request" Errors?

- **Check bot token:** Make sure it's correct and hasn't been revoked
- **Check URL format:** Must be `https://` with full path `/api/telegram/webhook`
- **Redeploy:** After changing environment variables, always redeploy

### Commands Not Working?

1. **Check Supabase credentials** in Vercel environment variables
2. **Check Vercel function logs** for database connection errors
3. **Verify data exists:** Run test in Supabase SQL Editor:
   ```sql
   SELECT * FROM harvesters LIMIT 5;
   ```

## Important Notes

1. **Webhook vs Polling:**
   - ✅ **Webhook mode (production):** Used now - Telegram sends updates to your server
   - ❌ **Polling mode (development):** Was used locally - bot asks Telegram for updates

2. **Environment Variables:**
   - Must be set in Vercel Dashboard
   - Changes require redeployment
   - Use `NEXT_PUBLIC_` prefix for client-accessible variables

3. **HTTPS Required:**
   - Telegram only accepts HTTPS webhooks
   - Vercel provides SSL automatically
   - Never use `http://` for webhooks

4. **Webhook Security:**
   - Consider adding secret token validation
   - Check Telegram IP ranges if needed
   - Monitor for unusual activity

## Success Checklist

- [ ] Environment variables set in Vercel
- [ ] Project redeployed after adding variables
- [ ] Webhook endpoint accessible (GET request works)
- [ ] Webhook URL set with Telegram API
- [ ] `getWebhookInfo` shows correct URL
- [ ] Bot responds to `/start` command
- [ ] All commands work correctly

## Next Steps

After deployment:

1. **Monitor Vercel logs** for any errors
2. **Test all commands** thoroughly
3. **Share bot username** with users
4. **Monitor usage** via Vercel analytics

## Support

If you encounter issues:
1. Check Vercel function logs
2. Check Telegram webhook info
3. Verify all environment variables
4. Test webhook endpoint manually

Your bot should now be live and accessible 24/7! 🎉


