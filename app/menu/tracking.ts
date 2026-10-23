'use server';

import { adminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { notifyAll } from '@/lib/telegram';

// Daily counters live in analytics_daily/{YYYY-MM-DD} (Toronto time).
export type LoyaltyEvent = 'menu_open' | 'popup_shown' | 'popup_join' | 'popup_skip' | 'points_click';

const ALLOWED_EVENTS: LoyaltyEvent[] = ['menu_open', 'popup_shown', 'popup_join', 'popup_skip', 'points_click'];

export async function trackLoyaltyEvent(event: LoyaltyEvent, firstVisitToday = false) {
    // Server actions are public endpoints, so only accept known event names.
    if (!ALLOWED_EVENTS.includes(event)) return;

    const day = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Toronto' }).format(new Date());
    const update: Record<string, FieldValue | string> = {
        date: day,
        [event]: FieldValue.increment(1),
    };
    if (event === 'menu_open' && firstVisitToday) {
        update.menu_open_unique = FieldValue.increment(1);
    }

    try {
        const ref = adminDb.collection('analytics_daily').doc(day);
        await ref.set(update, { merge: true });

        // menu_open is only tracked for NFC tag visits, so each one is a scan.
        const headlines: Partial<Record<LoyaltyEvent, string>> = {
            menu_open: firstVisitToday
                ? '📲 <b>NFC scan: new phone today</b>'
                : '📲 <b>NFC scan: same phone again today</b>',
            popup_join: '✅ <b>A customer tapped Join</b>',
            popup_skip: '❌ <b>A customer skipped the popup</b>',
        };
        const headline = headlines[event];

        if (headline) {
            const today = (await ref.get()).data() || {};
            const time = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Toronto', hour: 'numeric', minute: '2-digit' }).format(new Date());
            await notifyAll(
                `${headline} at ${time}\n` +
                `Today: ${today.popup_join || 0} joins · ${today.popup_skip || 0} skips · ${today.menu_open || 0} NFC scans`
            );
        }
    } catch (error) {
        console.error("Failed to track loyalty event:", error);
    }
}
