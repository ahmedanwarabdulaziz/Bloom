'use server';

import { adminDb } from '@/lib/firebase-admin';

export interface DailyStats {
    date: string;
    menu_open: number;
    menu_open_unique: number;
    popup_shown: number;
    popup_join: number;
    popup_skip: number;
    points_click: number;
    welcome_shown: number;
}

export async function getLoyaltyStats(days: number): Promise<DailyStats[]> {
    const dates: string[] = [];
    const fmt = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Toronto' });
    for (let i = 0; i < days; i++) {
        dates.push(fmt.format(new Date(Date.now() - i * 86400000)));
    }

    const refs = dates.map(d => adminDb.collection('analytics_daily').doc(d));
    const snaps = await adminDb.getAll(...refs);

    return snaps.map((snap, i) => {
        const d = snap.data() || {};
        return {
            date: dates[i],
            menu_open: d.menu_open || 0,
            menu_open_unique: d.menu_open_unique || 0,
            popup_shown: d.popup_shown || 0,
            popup_join: d.popup_join || 0,
            popup_skip: d.popup_skip || 0,
            points_click: d.points_click || 0,
            welcome_shown: d.welcome_shown || 0,
        };
    });
}
