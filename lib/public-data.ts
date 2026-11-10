import { unstable_cache } from 'next/cache';
import { getCategories } from '@/app/admin/categories/actions';
import { getMenuItems } from '@/app/admin/menu-items/actions';
import { getLoyaltySettings } from '@/app/admin/settings/actions';
import { PUBLIC_DATA_TAG } from '@/lib/cache-tags';

// Public pages read through this cache so a page view does not cost a
// Firestore read per menu item. Admin edits clear it with revalidateTag,
// and the hourly revalidate is only a safety net.

const options = { tags: [PUBLIC_DATA_TAG], revalidate: 3600 };

export const getCachedCategories = unstable_cache(getCategories, ['public-categories'], options);
export const getCachedMenuItems = unstable_cache(getMenuItems, ['public-menu-items'], options);
export const getCachedLoyaltySettings = unstable_cache(getLoyaltySettings, ['public-loyalty-settings'], options);
