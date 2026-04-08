import { getAuthToken } from './auth';
import { mockShopItems } from './mockShopData';

// Toggle this to switch between Real API and Mock Data
const USE_MOCK_DATA = true;

const BASE_URL = `${import.meta.env.VITE_BASE_URL}/${import.meta.env.VITE_API_BASE_URL}`;
const APP_SLUG = 'verbapix'; // Hardcoded for now based on context, or use env if available

/**
 * Fetch shop items
 */
export const getShopItems = async () => {
    if (USE_MOCK_DATA) {
        console.log('Using mock shop data');
        return new Promise(resolve => {
            setTimeout(() => resolve(mockShopItems), 500); // Simulate network delay
        });
    }

    const token = getAuthToken();
    const headers = {
        'Content-Type': 'application/json'
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        // Updated endpoint to match gvpixel-app: /api/v1/games/{appSlug}/store
        const response = await fetch(`${BASE_URL}/games/${APP_SLUG}/store`, {
            method: 'GET',
            headers
        });

        if (!response.ok) {
            throw new Error(`Shop API error: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Failed to fetch shop items:', error);
        throw error;
    }
};

/**
 * Buy an item (placeholder)
 */
export const buyItem = async (itemId) => {
    const token = getAuthToken();
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };

    // Use the base URL directly for checkout session
    const apiBase = `${import.meta.env.VITE_BASE_URL}/${import.meta.env.VITE_API_BASE_URL}`;

    const response = await fetch(`${apiBase}/checkout/session`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
            store_item_id: itemId,
            currency: 'USD'
        })
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to initiate checkout');
    }

    return await response.json();
};
