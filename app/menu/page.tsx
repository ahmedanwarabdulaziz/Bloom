import { getCachedCategories, getCachedLoyaltySettings, getCachedMenuItems } from "@/lib/public-data";
import MenuClient from "./MenuClient";

export const dynamic = 'force-dynamic';

export default async function MenuPage() {
    const [categories, items, loyalty] = await Promise.all([
        getCachedCategories(),
        getCachedMenuItems(),
        getCachedLoyaltySettings()
    ]);

    // Ensure we have some categories if empty to prevent UI breakage
    const safeCategories = categories.length > 0 ? categories : [];

    return <MenuClient categories={safeCategories} items={items} loyalty={loyalty} />;
}
