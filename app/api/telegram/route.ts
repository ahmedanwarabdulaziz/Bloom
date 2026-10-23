import { NextRequest, NextResponse } from 'next/server';
import { getLoyaltyStats } from '@/app/admin/dashboard/actions';
import {
    allowedChatIds, formatReport, rangeKeyboard, reportKeyboard,
    REPORT_BUTTON, sendTelegramMessage, telegramCall,
} from '@/lib/telegram';

export const dynamic = 'force-dynamic';

// Telegram webhook: replies to the Report button and range choices for allowed chats only.
export async function POST(req: NextRequest) {
    const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
    if (!secret || req.headers.get('x-telegram-bot-api-secret-token') !== secret) {
        return NextResponse.json({ ok: false }, { status: 401 });
    }

    const update = await req.json();
    const allowed = allowedChatIds();

    if (update.callback_query) {
        const query = update.callback_query;
        const chatId: number | undefined = query.message?.chat?.id;
        await telegramCall('answerCallbackQuery', { callback_query_id: query.id });

        const days = Number(String(query.data || '').replace('report:', ''));
        if (chatId && allowed.includes(chatId) && [1, 7, 30].includes(days)) {
            const stats = await getLoyaltyStats(days);
            await sendTelegramMessage(chatId, formatReport(stats, days), rangeKeyboard);
        }
        return NextResponse.json({ ok: true });
    }

    const message = update.message;
    const chatId: number | undefined = message?.chat?.id;
    if (!chatId) return NextResponse.json({ ok: true });

    if (!allowed.includes(chatId)) {
        await sendTelegramMessage(chatId, `This bot is private. Your chat ID is <code>${chatId}</code>.`);
        return NextResponse.json({ ok: true });
    }

    const text: string = message.text || '';
    if (text === REPORT_BUTTON || text.startsWith('/report')) {
        await sendTelegramMessage(chatId, 'Which period?', rangeKeyboard);
    } else {
        await sendTelegramMessage(
            chatId,
            '👋 Bloom Loyalty bot is active.\nYou will get an alert every time a customer taps Join or skips the popup.\nTap <b>📊 Report</b> any time for stats.',
            reportKeyboard
        );
    }
    return NextResponse.json({ ok: true });
}
