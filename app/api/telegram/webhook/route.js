/**
 * Telegram Webhook Route
 * Next.js API route for Telegram webhook
 * 
 * Note: For full bot functionality, use the separate bot server (telegram-bot/server.js)
 * This webhook route can be used to forward requests to the bot server or handle basic commands
 */

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Only create Supabase client if credentials are available
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

// Simplified command handling (without Telegram bot library dependency)
async function handleCommand(msg, command, args) {
  // Basic command responses without requiring node-telegram-bot-api
  switch (command) {
    case '/start':
      return `🌾 Welcome to AgriLink Bot!\n\nUse /help for available commands.\n\nFor full functionality, use the bot server.`;
    case '/help':
      return `Commands:\n/search - Search equipment\n/recommend - Get recommendations\n/nearby - Find nearby equipment\n\nNote: Full bot runs as separate server.`;
    default:
      return 'Command not available via webhook. Please use the bot server for full functionality.';
  }
}

// Send message via Telegram Bot API (using fetch instead of library)
async function sendTelegramMessage(chatId, text) {
  if (!BOT_TOKEN) {
    console.error('TELEGRAM_BOT_TOKEN not configured');
    return null;
  }

  try {
    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
      }),
    });
    
    return await response.json();
  } catch (error) {
    console.error('Error sending Telegram message:', error);
    return null;
  }
}

export async function POST(request) {
  try {
    if (!BOT_TOKEN) {
      return NextResponse.json(
        { error: 'Bot token not configured' },
        { status: 500 }
      );
    }

    const update = await request.json();

    if (update.message) {
      const msg = update.message;
      
      if (msg.text && msg.text.startsWith('/')) {
        const parts = msg.text.split(' ');
        const command = parts[0];
        const args = parts.slice(1).join(' ');
        
        const response = await handleCommand(msg, command, args);
        
        // Send response via Telegram API
        await sendTelegramMessage(msg.chat.id, response);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  return NextResponse.json({
    message: 'Telegram webhook endpoint',
    status: 'active'
  });
}

