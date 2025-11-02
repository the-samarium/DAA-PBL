#!/bin/bash

# Quick script to set Telegram webhook
# Usage: ./setup-webhook.sh YOUR_BOT_TOKEN

if [ -z "$1" ]; then
    echo "❌ Error: Bot token required"
    echo "Usage: ./setup-webhook.sh YOUR_BOT_TOKEN"
    exit 1
fi

BOT_TOKEN=$1
WEBHOOK_URL="https://agrilink-daa-pbl.vercel.app/api/telegram/webhook"

echo "🔗 Setting webhook URL: $WEBHOOK_URL"
echo ""

# Set webhook
RESPONSE=$(curl -s -X POST "https://api.telegram.org/bot${BOT_TOKEN}/setWebhook?url=${WEBHOOK_URL}")

echo "Response:"
echo $RESPONSE | jq .

echo ""
echo "✅ Done! Check if webhook is set:"
echo "curl \"https://api.telegram.org/bot${BOT_TOKEN}/getWebhookInfo\""


