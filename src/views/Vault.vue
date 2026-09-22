<template>
    <div class="relative min-h-screen overflow-hidden home-shell pixel-bg text-slate-900 pb-20">
        <div class="bg-grid"></div>
        <div class="bg-glow bg-glow-1"></div>

        <header
            class="relative sticky top-0 z-10 flex items-center justify-between px-4 py-4 md:px-12 md:py-6 text-white border-b-2 border-black bg-pix-primary">
            <div class="flex items-center gap-4">
                <button @click="$router.push('/')" class="pixel-icon-btn bg-white text-black hover:bg-slate-200">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                </button>
                <h1 class="flex text-2xl font-bold leading-tight md:text-3xl card-font text-white drop-shadow-md">My
                    Vault</h1>
            </div>
        </header>

        <main class="relative z-10 w-full max-w-4xl px-4 py-8 mx-auto">

            <!-- Persistent action-error banner (does not replace the item list) -->
            <div v-if="actionError"
                class="pixel-panel bg-red-50 border-2 border-red-300 text-red-800 p-4 mb-6 font-pixel">
                {{ actionError }}
            </div>

            <!-- Loading State -->
            <div v-if="loading" class="text-center py-8">
                <p class="font-pixel text-xl animate-pulse">Loading vault data...</p>
            </div>

            <!-- Offline State -->
            <div v-else-if="offline" class="pixel-panel bg-pix-paper mb-8 p-6 text-center font-pixel">
                <p class="text-2xl font-bold text-pix-ink mb-2">Vault unavailable offline</p>
                <p v-if="pendingSync > 0" class="text-sm text-slate-600 mb-4">
                    {{ pendingSync }} sentence(s) saved locally and waiting to sync.
                </p>
                <p class="text-sm text-slate-600 mb-4">Connect to the internet and retry to view your vault.</p>
                <button @click="fetchData"
                    class="pixel-btn primary font-pixel text-sm py-1 px-3">Retry</button>
            </div>

            <!-- Error State -->
            <div v-else-if="error" class="pixel-panel bg-red-50 border-2 border-red-300 text-red-800 p-6 mb-8">
                <p class="font-bold mb-2">{{ error }}</p>
                <button @click="fetchData"
                    class="pixel-btn primary font-pixel text-sm py-1 px-3">Retry</button>
            </div>

            <!-- Success / Empty -->
            <template v-else>
                <!-- Stats Board -->
                <section v-if="stats"
                    class="pixel-panel bg-pix-paper mb-8 p-6 flex flex-wrap gap-6 justify-between items-center">
                    <div>
                        <h2 class="text-sm font-bold uppercase text-pix-ink opacity-70 mb-1">Total Items</h2>
                        <p class="text-3xl font-display text-pix-ink">{{ stats.totalItems || 0 }}</p>
                    </div>
                    <div>
                        <h2 class="text-sm font-bold uppercase text-pix-ink opacity-70 mb-1">Sentences</h2>
                        <p class="text-3xl font-display text-pix-primary">{{ stats.typeBreakdown?.sentence || 0 }}</p>
                    </div>
                    <div>
                        <h2 class="text-sm font-bold uppercase text-pix-ink opacity-70 mb-1">Streak</h2>
                        <p class="text-3xl font-display text-pix-warning">{{ stats.streak || 0 }} 🔥</p>
                    </div>
                </section>

                <!-- Sentences List -->
                <section class="space-y-4">
                    <div v-if="items.length === 0"
                        class="pixel-panel bg-white p-8 text-center text-slate-500 font-pixel">
                        <p class="text-xl mb-4">Your vault is empty!</p>
                        <p class="text-sm">Play a match and build sentences to save them here.</p>
                    </div>

                    <article v-else v-for="item in items" :key="item.id"
                        class="pixel-panel bg-white p-4 relative group hover:-translate-y-1 transition-transform">

                        <div v-if="editingId === item.id">
                            <textarea v-model="editNoteText"
                                class="w-full font-pixel text-sm p-3 border-2 border-black rounded bg-slate-50 mb-3 focus:outline-none focus:border-pix-primary"
                                rows="3" placeholder="Add your note here..."></textarea>
                            <div class="flex gap-2 justify-end">
                                <button @click="cancelEdit"
                                    class="pixel-btn text-xs py-1 px-3 bg-slate-300 text-black border-slate-500 shadow-[0_4px_0_#64748b]">Cancel</button>
                                <button @click="saveNote(item.id)" class="pixel-btn primary text-xs py-1 px-3">Save
                                    Note</button>
                            </div>
                        </div>

                        <div v-else>
                            <p class="text-lg md:text-xl font-bold mb-2">{{ item.text }}</p>

                            <div v-if="item.note" class="bg-yellow-50 border border-yellow-200 p-3 rounded mb-2 relative">
                                <p class="text-sm font-pixel text-slate-700 whitespace-pre-line">{{ item.note }}</p>
                            </div>

                            <div class="flex items-center gap-2 mt-4 pt-4 border-t border-slate-200">
                                <span
                                    class="text-xs px-2 py-1 bg-slate-100 rounded font-bold uppercase text-slate-500 mr-auto">
                                    {{ item.type || 'sentence' }}
                                </span>

                                <button @click="startEdit(item)"
                                    class="text-pix-primary hover:text-blue-700 font-bold text-sm px-2">
                                    {{ item.note ? 'Edit Note' : 'Add Note' }}
                                </button>
                                <button @click="deleteItem(item.id)"
                                    class="text-red-500 hover:text-red-700 font-bold text-sm px-2">
                                    Delete
                                </button>
                            </div>
                        </div>
                    </article>

                </section>
            </template>

        </main>
    </div>
</template>

<script>
import gvPixelService from '@/services/gvPixel';

export default {
    name: 'VaultView',
    data() {
        return {
            stats: null,
            items: [],
            loading: true,
            error: null,
            offline: false,
            actionError: null,
            pendingSync: 0,
            editingId: null,
            editNoteText: ''
        };
    },
    async mounted() {
        await this.fetchData();
    },
    methods: {
        isOfflineError(error) {
            if (typeof navigator !== 'undefined' && !navigator.onLine) return true;
            if (!error) return false;
            const message = error.message || '';
            return error.name === 'TypeError' ||
                /Failed to fetch|NetworkError|Load failed|Network request failed|network|offline/i.test(message);
        },

        updatePendingSync() {
            this.pendingSync = gvPixelService.getPendingSyncCount();
        },

        async fetchData() {
            this.loading = true;
            this.error = null;
            this.offline = false;
            this.actionError = null;
            this.updatePendingSync();
            try {
                const [statsData, itemsData] = await Promise.all([
                    gvPixelService.getVaultStats(),
                    gvPixelService.getVaultItems(1)
                ]);

                this.stats = statsData;
                // Assuming API returns { data: [...] } for pagination or just [...] array
                this.items = Array.isArray(itemsData) ? itemsData : (itemsData.data || []);
            } catch (err) {
                console.error('Failed to load vault data:', err);
                this.stats = null;
                this.items = [];
                this.offline = this.isOfflineError(err);
                this.error = this.offline
                    ? 'Vault is unavailable while offline.'
                    : 'Failed to load vault data. Please try again.';
            } finally {
                this.loading = false;
                this.updatePendingSync();
            }
        },

        startEdit(item) {
            this.editingId = item.id;
            this.editNoteText = item.note || '';
        },

        cancelEdit() {
            this.editingId = null;
            this.editNoteText = '';
        },

        async saveNote(id) {
            if (!this.editingId) return;

            try {
                await gvPixelService.updateVaultItem(id, { note: this.editNoteText });

                // Update local item
                const index = this.items.findIndex(i => i.id === id);
                if (index !== -1) {
                    // Merge updated properties or replace entirely based on API response structure
                    this.items[index] = { ...this.items[index], note: this.editNoteText };
                }

                this.actionError = null;
                this.cancelEdit();
            } catch (err) {
                console.error('Failed to save note:', err);
                this.actionError = this.isOfflineError(err)
                    ? 'Cannot save note while offline. It will sync when you are back online.'
                    : 'Failed to save note. Please try again.';
            }
        },

        async deleteItem(id) {
            if (!confirm('Are you sure you want to delete this item?')) return;

            try {
                await gvPixelService.deleteVaultItem(id);
                this.items = this.items.filter(i => i.id !== id);
                this.actionError = null;

                // Optimistically update stats if we want to
                if (this.stats && this.stats.totalItems > 0) {
                    this.stats.totalItems--;
                }
            } catch (err) {
                console.error('Failed to delete item:', err);
                this.actionError = this.isOfflineError(err)
                    ? 'Cannot delete item while offline. It will sync when you are back online.'
                    : 'Failed to delete item. Please try again.';
            }
        }
    }
}
</script>

<style scoped>
/* Ensure the vault looks consistent with VerbaPix styling */
</style>
