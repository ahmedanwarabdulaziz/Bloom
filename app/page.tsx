import { getCachedMenuItems } from '@/lib/public-data';
import HomeClient from './HomeClient';

// Ensure the page fetches dynamic data if menu items change
export const dynamic = 'force-dynamic';

export default async function Home() {
    const items = await getCachedMenuItems();
    const featuredItems = items.filter(item => item.isFeatured);
    
    return <HomeClient featuredItems={featuredItems} />;
}
