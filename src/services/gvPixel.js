const API_URL = `${import.meta.env.VITE_BASE_URL}/${import.meta.env.VITE_API_BASE_URL}`;

// Basic token retrieval - modify if you use a different storage key
const getAuthHeader = () => {
    const token = localStorage.getItem('auth_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export default {
    /**
     * Save a sentence to the user's vault
     * @param {string} sentence - The full sentence text
     * @param {object} metadata - Optional game context (score, mode, etc.)
     */
    async saveToVault(sentence, metadata = {}) {
        try {
            const response = await fetch(`${API_URL}/vault`, {
                method: 'POST',
                headers: {
                    ...getAuthHeader(),
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    content: sentence,
                    type: 'sentence', // Explicit type for your GVPixel backend
                    metadata: metadata
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP Error ${response.status}`);
            }

            return await response.json();

        } catch (error) {
            console.error('GVPixel Vault Error:', error);
            throw error;
        }
    }
};
