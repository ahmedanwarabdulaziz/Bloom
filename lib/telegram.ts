import type { DailyStats } from '@/app/admin/dashboard/actions';

const API = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}`;

// Only these chats get alerts and may request reports (comma-separated in env).
export const allowedChatIds = (): number[] =>
    (process.env.TELEGRAM_CHAT_IDS || '')
        .split(',')
        .map(id => Number(id.trim()))
        .filter(id => !Number.isNaN(id) && id !== 0);

export const REPORT_BUTTON = '📊 Report';
export const SETTINGS_BUTTON = '⚙️ Settings';

// Persistent buttons under the chat's text box.
export const reportKeyboard = {
    keyboard: [[{ text: REPORT_BUTTON }, { text: SETTINGS_BUTTON }]],
    resize_keyboard: true,
    is_persistent: true,
};

export const rangeKeyboard = {
    inline_keyboard: [[
        { text: 'Today', callback_data: 'report:1' },
        { text: '7 days', callback_data: 'report:7' },
        { text: '30 days', callback_data: 'report:30' },
    ]],
};

export async function telegramCall(method: string, body: Record<string, unknown>) {
    if (!process.env.TELEGRAM_BOT_TOKEN) return;
    try {
        const res = await fetch(`${API}/${method}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });
        if (!res.ok) console.error(`Telegram ${method} failed:`, await res.text());
    } catch (error) {
        console.error(`Telegram ${method} failed:`, error);
    }
}

export async function sendTelegramMessage(chatId: number, text: string, replyMarkup?: object) {
    await telegramCall('sendMessage', { chat_id: chatId, text, parse_mode: 'HTML', reply_markup: replyMarkup });
}

export async function notifyAll(text: string) {
    await Promise.all(allowedChatIds().map(id => sendTelegramMessage(id, text)));
}

export function settingsMessage(popupEnabled: boolean, pointsButtonEnabled: boolean) {
    const status = (on: boolean) => (on ? '🟢 ON' : '🔴 OFF');
    return {
        text: [
            '⚙️ <b>Menu Loyalty Settings</b>',
            '',
            `Sign-up popup: <b>${status(popupEnabled)}</b>`,
            `My Points button: <b>${status(pointsButtonEnabled)}</b>`,
            '',
            'Tap a button to switch it.',
        ].join('\n'),
        keyboard: {
            inline_keyboard: [
                [{ text: popupEnabled ? 'Turn popup OFF' : 'Turn popup ON', callback_data: 'toggle:popupEnabled' }],
                [{ text: pointsButtonEnabled ? 'Turn My Points OFF' : 'Turn My Points ON', callback_data: 'toggle:pointsButtonEnabled' }],
            ],
        },
    };
}

const pct = (part: number, whole: number) => (whole > 0 ? `${Math.round((part / whole) * 100)}%` : '–');

export function formatReport(stats: DailyStats[], days: number): string {
    const sum = (key: keyof Omit<DailyStats, 'date'>) => stats.reduce((s, d) => s + d[key], 0);
    const shown = sum('popup_shown');
    const joined = sum('popup_join');
    const skipped = sum('popup_skip');
    const label = days === 1 ? `Today (${stats[0]?.date})` : `Last ${days} days`;

    return [
        `📊 <b>Bloom Report: ${label}</b>`,
        '',
        `📲 NFC scans: <b>${sum('menu_open')}</b> (${sum('menu_open_unique')} unique phones)`,
        `🪧 Popup shown: <b>${shown}</b>`,
        `✅ Tapped Join: <b>${joined}</b> (${pct(joined, shown)})`,
        `❌ Skipped: <b>${skipped}</b> (${pct(skipped, shown)})`,
        `⭐ My Points taps: <b>${sum('points_click')}</b>`,
    ].join('\n');
}
