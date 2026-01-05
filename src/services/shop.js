import { getAuthToken } from './auth';
import { mockShopItems } from './mockShopData';

// Toggle this to switch between Real API and Mock Data
const USE_MOCK_DATA = true;

const API_URL = import.meta.env.STORE_URL ? 'https://gvpixel_app.ddev.site/api/v1/verbapix' : 'https://gvpixel.app/api/v1/verbapix';

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
        const response = await fetch(`${API_URL}/store`, {
            method: 'GET',
            headers
        });

        if (!response.ok) {
            throw new Error(`Shop API error: ${response.statusText}`);
        }

        const data = await response.json();
        return data; // Assuming data is the array of items or object containing items
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

    // Construct the endpoint URL appropriately
    // Since API_URL ends in /verbapix (usually), we might need to adjust logic if the backend structure is strict.
    // However, looking at the user's request, the endpoint is /api/v1/checkout/session.
    // The current API_URL logic is:
    // const API_URL = import.meta.env.STORE_URL ? '.../api/v1/verbapix' : '.../api/v1/verbapix';
    // We can try to derive the base URL from API_URL or just use the same host.

    // Safest bet: Use the same origin/host logic as API_URL but point to /checkout/session
    // Let's assume API_URL base is good, but we need to step up if it includes 'verbapix'

    let baseUrl = API_URL;
    if (baseUrl.endsWith('/verbapix')) {
        baseUrl = baseUrl.replace('/verbapix', '');
    }

    const response = await fetch(`${baseUrl}/checkout/session`, {
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
