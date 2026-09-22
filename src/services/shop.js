import { mockShopItems } from './mockShopData';

// T21: billing removed from scope (Q6). Shop is cosmetics-only; items are
// unlocked via progression/achievements, never via money.

/**
 * Fetch shop items (mock only — real API path removed per Q6).
 */
export const getShopItems = async () => {
    console.log('Using mock shop data');
    return new Promise(resolve => {
        setTimeout(() => resolve(mockShopItems), 500);
    });
};
