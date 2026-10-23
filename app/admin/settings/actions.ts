'use server';

import { adminDb } from '@/lib/firebase-admin';
import { uploadFileToR2 } from '@/lib/storage-utils';
import { revalidatePath } from 'next/cache';

export interface HomepageSettings {
    topAdImage: string;
    topAdTitle?: string;
    topAdDesc?: string;
    middleAdImage: string;
    middleAdTitle?: string;
    middleAdDesc?: string;
    bottomAdImage: string;
    bottomAdTitle?: string;
    bottomAdDesc?: string;
}

const SETTINGS_DOC_PATH = 'settings/homepage';

export async function getHomepageSettings(): Promise<HomepageSettings | null> {
    const doc = await adminDb.doc(SETTINGS_DOC_PATH).get();
    if (!doc.exists) {
        return null;
    }
    return doc.data() as HomepageSettings;
}

export async function saveHomepageSettings(formData: FormData) {
    const topAdImageFile = formData.get('topAdImageFile') as File | null;
    const middleAdImageFile = formData.get('middleAdImageFile') as File | null;
    const bottomAdImageFile = formData.get('bottomAdImageFile') as File | null;

    let topAdImage = formData.get('existingTopAdImage') as string || '';
    let middleAdImage = formData.get('existingMiddleAdImage') as string || '';
    let bottomAdImage = formData.get('existingBottomAdImage') as string || '';

    const topAdTitle = formData.get('topAdTitle') as string || '';
    const topAdDesc = formData.get('topAdDesc') as string || '';
    const middleAdTitle = formData.get('middleAdTitle') as string || '';
    const middleAdDesc = formData.get('middleAdDesc') as string || '';
    const bottomAdTitle = formData.get('bottomAdTitle') as string || '';
    const bottomAdDesc = formData.get('bottomAdDesc') as string || '';

    if (topAdImageFile && topAdImageFile.size > 0) {
        try {
            topAdImage = await uploadFileToR2(topAdImageFile, 'settings/ads');
        } catch (error) {
            console.error("Failed to upload top ad image:", error);
        }
    }

    if (middleAdImageFile && middleAdImageFile.size > 0) {
        try {
            middleAdImage = await uploadFileToR2(middleAdImageFile, 'settings/ads');
        } catch (error) {
            console.error("Failed to upload middle ad image:", error);
        }
    }

    if (bottomAdImageFile && bottomAdImageFile.size > 0) {
        try {
            bottomAdImage = await uploadFileToR2(bottomAdImageFile, 'settings/ads');
        } catch (error) {
            console.error("Failed to upload bottom ad image:", error);
        }
    }

    const data: HomepageSettings = {
        topAdImage,
        topAdTitle,
        topAdDesc,
        middleAdImage,
        middleAdTitle,
        middleAdDesc,
        bottomAdImage,
        bottomAdTitle,
        bottomAdDesc,
    };

    await adminDb.doc(SETTINGS_DOC_PATH).set(data, { merge: true });

    revalidatePath('/admin/settings');
    revalidatePath('/');
}

export interface LoyaltySettings {
    popupEnabled: boolean;
    pointsButtonEnabled: boolean;
    squareLink: string;
    title: string;
    description: string;
    joinButtonText: string;
    skipButtonText: string;
    pointsButtonText: string;
    image?: string;
}

const LOYALTY_DOC_PATH = 'settings/loyalty';

const DEFAULT_LOYALTY_SETTINGS: LoyaltySettings = {
    popupEnabled: false,
    pointsButtonEnabled: false,
    squareLink: 'https://app.squareup.com/loyalty/MLQYCAYRKH8H8',
    title: 'Your Coffee Pays You Back ☕',
    description: 'Every $1 = 1 point. Every 100 points = $10 OFF.\nJoin free in 10 seconds with just your phone number and start earning on today\'s order!',
    joinButtonText: 'Start Earning, It\'s Free',
    skipButtonText: 'No thanks, I\'ll skip the rewards',
    pointsButtonText: 'My Points',
    image: '',
};

export async function getLoyaltySettings(): Promise<LoyaltySettings> {
    try {
        const doc = await adminDb.doc(LOYALTY_DOC_PATH).get();
        return { ...DEFAULT_LOYALTY_SETTINGS, ...(doc.exists ? doc.data() : {}) };
    } catch (error) {
        console.error("Failed to load loyalty settings:", error);
        return DEFAULT_LOYALTY_SETTINGS;
    }
}

export async function saveLoyaltySettings(formData: FormData) {
    const imageFile = formData.get('loyaltyImageFile') as File | null;
    let image = formData.get('existingLoyaltyImage') as string || '';

    if (imageFile && imageFile.size > 0) {
        try {
            image = await uploadFileToR2(imageFile, 'settings/loyalty');
        } catch (error) {
            console.error("Failed to upload loyalty image:", error);
        }
    }

    const text = (key: keyof LoyaltySettings) =>
        (formData.get(key) as string || '').trim() || (DEFAULT_LOYALTY_SETTINGS[key] as string);

    const data: LoyaltySettings = {
        popupEnabled: formData.get('popupEnabled') === 'true',
        pointsButtonEnabled: formData.get('pointsButtonEnabled') === 'true',
        squareLink: text('squareLink'),
        title: text('title'),
        description: text('description'),
        joinButtonText: text('joinButtonText'),
        skipButtonText: text('skipButtonText'),
        pointsButtonText: text('pointsButtonText'),
        image,
    };

    await adminDb.doc(LOYALTY_DOC_PATH).set(data, { merge: true });

    revalidatePath('/admin/settings');
    revalidatePath('/menu');
}
