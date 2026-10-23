import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { getLoyaltyStats } from '@/app/admin/dashboard/actions';
import { getLoyaltySettings } from '@/app/admin/settings/actions';
import {
    allowedChatIds, formatReport, rangeKeyboard, reportKeyboard, settingsMessage,
    REPORT_BUTTON, SETTINGS_BUTTON, sendTelegramMessage, telegramCall,
} from '@/lib/telegram';

export const dynamic = 'force-dynamic';

const TOGGLES = ['popupEnabled', 'pointsButtonEnabled'] as const;

async function sendSettings(chatId: number) {
    const settings = await getLoyaltySettings();
    const { text, keyboard } = settingsMessage(settings.popupEnabled, settings.pointsButtonEnabled);
    await sendTelegramMessage(chatId, text, keyboard);
}

// Telegram webhook: reports, stats ranges and on/off toggles, for allowed chats only.
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
        const data = String(query.data || '');

        if (!chatId || !allowed.includes(chatId)) {
            await telegramCall('answerCallbackQuery', { callback_query_id: query.id });
            return NextResponse.json({ ok: true });
        }

        if (data.startsWith('report:')) {
            await telegramCall('answerCallbackQuery', { callback_query_id: query.id });
            const days = Number(data.replace('report:', ''));
            if ([1, 7, 30].includes(days)) {
                const stats = await getLoyaltyStats(days);
                await sendTelegramMessage(chatId, formatReport(stats, days), rangeKeyboard);
            }
        } else if (data.startsWith('toggle:')) {
            const key = data.replace('toggle:', '') as typeof TOGGLES[number];
            if (TOGGLES.includes(key)) {
                const current = await getLoyaltySettings();
                const updated = { ...current, [key]: !current[key] };
                await adminDb.doc('settings/loyalty').set({ [key]: updated[key] }, { merge: true });

                const label = key === 'popupEnabled' ? 'Popup' : 'My Points button';
                await telegramCall('answerCallbackQuery', {
                    callback_query_id: query.id,
                    text: `${label} is now ${updated[key] ? 'ON' : 'OFF'}`,
                });
                // Refresh the same settings message in place.
                const { text, keyboard } = settingsMessage(updated.popupEnabled, updated.pointsButtonEnabled);
                await telegramCall('editMessageText', {
                    chat_id: chatId,
                    message_id: query.message.message_id,
                    text,
                    parse_mode: 'HTML',
                    reply_markup: keyboard,
                });
            }
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
    } else if (text === SETTINGS_BUTTON || text.startsWith('/settings')) {
        await sendSettings(chatId);
    } else {
        await sendTelegramMessage(
            chatId,
            '👋 Bloom Loyalty bot is active.\nYou will get an alert for every NFC scan and every time a customer taps Join or skips the popup.\nTap <b>📊 Report</b> for stats or <b>⚙️ Settings</b> to switch the popup and My Points button on or off.',
            reportKeyboard
        );
    }
    return NextResponse.json({ ok: true });
}
