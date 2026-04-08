const API_URL = `${import.meta.env.VITE_BASE_URL}/${import.meta.env.VITE_API_BASE_URL}`;

// Basic token retrieval - modify if you use a different storage key
const getAuthHeader = () => {
    const token = localStorage.getItem('auth_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

const VAULT_QUEUE_KEY = 'verbapix_vault_queue';

function getLocalQueue() {
    try {
        const data = localStorage.getItem(VAULT_QUEUE_KEY);
        return data ? JSON.parse(data) : [];
    } catch {
        return [];
    }
}

function saveLocalQueue(queue) {
    localStorage.setItem(VAULT_QUEUE_KEY, JSON.stringify(queue));
}

export default {
    /**
     * Save a sentence to the user's vault. Enqueues locally, and tries to sync immediately.
     */
    async saveToVault(sentence, metadata = {}) {
        const item = {
            id: Date.now().toString(),
            text: sentence,
            type: 'sentence',
            metadata: metadata,
            queuedAt: new Date().toISOString()
        };

        const queue = getLocalQueue();
        queue.push(item);
        saveLocalQueue(queue);

        // Try to sync right away, but don't fail if offline
        try {
            await this.syncVaultQueue();
            return { success: true, message: 'Saved and synced' };
        } catch (error) {
            console.warn('Saved locally, but sync failed:', error);
            return { success: true, message: 'Saved locally' };
        }
    },

    /**
     * Syncs all items in the local queue to the API
     */
    async syncVaultQueue() {
        const queue = getLocalQueue();
        if (queue.length === 0) return true;

        const syncedItemIds = [];

        for (const item of queue) {
            try {
                const response = await fetch(`${API_URL}/vault`, {
                    method: 'POST',
                    headers: {
                        ...getAuthHeader(),
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'X-App-Context': 'verbapix'
                    },
                    body: JSON.stringify({
                        text: item.text,
                        type: item.type,
                        metadata: item.metadata
                    })
                });

                if (response.ok) {
                    syncedItemIds.push(item.id);
                }
            } catch (error) {
                console.error('Failed to sync item:', item, error);
                // Stop syncing on first network failure to preserve order
                break;
            }
        }

        // Remove synced items from queue
        if (syncedItemIds.length > 0) {
            const newQueue = queue.filter(item => !syncedItemIds.includes(item.id));
            saveLocalQueue(newQueue);
        }

        return getLocalQueue().length === 0;
    },

    /**
     * Get pending sync count
     */
    getPendingSyncCount() {
        return getLocalQueue().length;
    },

    /**
     * Get items from the Vault
     */
    async getVaultItems(page = 1) {
        try {
            const response = await fetch(`${API_URL}/vault?page=${page}`, {
                method: 'GET',
                headers: {
                    ...getAuthHeader(),
                    'Accept': 'application/json',
                    'X-App-Context': 'verbapix'
                }
            });

            if (!response.ok) throw new Error(`HTTP Error ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('GVPixel Vault Get Items Error:', error);
            throw error;
        }
    },

    /**
     * Update an item in the Vault
     */
    async updateVaultItem(id, data) {
        try {
            const response = await fetch(`${API_URL}/vault/${id}`, {
                method: 'PATCH',
                headers: {
                    ...getAuthHeader(),
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-App-Context': 'verbapix'
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) throw new Error(`HTTP Error ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('GVPixel Vault Update Error:', error);
            throw error;
        }
    },

    /**
     * Delete an item in the Vault
     */
    async deleteVaultItem(id) {
        try {
            const response = await fetch(`${API_URL}/vault/${id}`, {
                method: 'DELETE',
                headers: {
                    ...getAuthHeader(),
                    'Accept': 'application/json',
                    'X-App-Context': 'verbapix'
                }
            });

            if (!response.ok) throw new Error(`HTTP Error ${response.status}`);
            return true;
        } catch (error) {
            console.error('GVPixel Vault Delete Error:', error);
            throw error;
        }
    },

    /**
     * Get Vault stats
     */
    async getVaultStats() {
        try {
            const response = await fetch(`${API_URL}/vault/stats`, {
                method: 'GET',
                headers: {
                    ...getAuthHeader(),
                    'Accept': 'application/json',
                    'X-App-Context': 'verbapix'
                }
            });

            if (!response.ok) {
                // Return empty stats block if it fails, maybe user has no stats yet or 404
                return {
                    totalItems: 0,
                    typeBreakdown: { word: 0, sentence: 0 },
                    streak: 0
                };
            }
            return await response.json();
        } catch (error) {
            console.error('GVPixel Vault Stats Error:', error);
            return {
                totalItems: 0,
                typeBreakdown: { word: 0, sentence: 0 },
                streak: 0
            };
        }
    }
};
