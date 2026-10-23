'use server';

import { adminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

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
        await adminDb.collection('analytics_daily').doc(day).set(update, { merge: true });
    } catch (error) {
        console.error("Failed to track loyalty event:", error);
    }
}
