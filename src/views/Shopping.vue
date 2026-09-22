<template>
    <div class="page-shell pixel-bg">
        <div class="w-full max-w-5xl">
            <!-- Header -->
            <div class="flex items-center mb-8">
                <back-btn class="mr-4 static" />
                <h1 class="text-3xl font-bold text-white card-font uppercase tracking-wide">Shopping</h1>
            </div>

            <!-- Main Panel -->
            <div class="pixel-panel p-6 md:p-8 bg-pix-paper min-h-[600px]">

                <!-- Loading State -->
                <div v-if="loading" class="flex justify-center items-center h-64">
                    <div class="text-2xl font-bold text-pix-ink animate-pulse">Loading Shop...</div>
                </div>

                <!-- Offline State -->
                <div v-else-if="offline" class="flex flex-col justify-center items-center h-64 text-center">
                    <div class="text-xl font-bold text-pix-ink mb-4">Shop unavailable offline</div>
                    <p class="text-sm text-slate-600 mb-4">
                        {{ pendingSync }} item(s) saved locally and waiting to sync.
                    </p>
                    <button @click="fetchItems" class="pixel-btn primary">Retry</button>
                </div>

                <!-- Error State -->
                <div v-else-if="error" class="flex flex-col justify-center items-center h-64 text-center">
                    <div class="text-xl font-bold text-red-600 mb-4">{{ error }}</div>
                    <button @click="fetchItems" class="pixel-btn primary">Retry</button>
                </div>

                <!-- Success / Empty -->
                <div v-else>
                    <!-- Tabs -->
                    <div class="flex flex-wrap gap-2 md:gap-4 mb-8 border-b-4 border-pix-ink pb-4">
                        <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id"
                            class="pixel-btn transition-transform"
                            :class="activeTab === tab.id ? 'primary' : 'ghost border-2 border-pix-ink'">
                            {{ tab.label }}
                        </button>
                    </div>

                    <!-- Grid -->
                    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        <div v-for="item in currentItems" :key="item.id"
                            class="pixel-card p-4 flex flex-col items-center relative transition-transform hover:-translate-y-1"
                            :class="{ 'bg-yellow-50': isEquipped(item) }">

                            <!-- Equipped Badge -->
                            <div v-if="isEquipped(item)"
                                class="absolute -top-3 right-2 pixel-chip bg-pix-warning text-pix-ink font-bold z-10">
                                EQUIPPED
                            </div>

                            <!-- Preview / Image -->
                            <div
                                class="w-24 h-24 pixel-inset bg-white mb-4 flex items-center justify-center overflow-hidden">
                                <img v-if="item.image" :src="item.image" class="w-20 pixelated" :alt="item.name" />
                                <span v-else class="text-4xl">{{ item.icon || item.requirement || '📦' }}</span>
                            </div>

                            <h3 class="font-bold text-center text-pix-ink mb-2">{{ item.name }}</h3>

                            <!-- Actions -->
                            <div class="w-full mt-auto pt-2">
                                <!-- Case: Owned -->
                                <template v-if="isOwned(item)">
                                    <button v-if="isEquippable(item) && !isEquipped(item)" @click="equip(item)"
                                        class="pixel-btn success w-full text-sm py-2">
                                        EQUIP
                                    </button>
                                    <button v-else-if="isEquippable(item) && isEquipped(item)" disabled
                                        class="pixel-btn ghost w-full text-sm py-2 opacity-50 cursor-default">
                                        EQUIPPED
                                    </button>
                                    <div v-else class="text-center text-sm font-bold text-green-600">OWNED</div>
                                </template>

                                <!-- Case: Not Owned (billing removed, Q6) -->
                                <div v-else class="text-center">
                                    <div class="text-xs text-pix-ink font-bold uppercase mb-2 opacity-70">Locked
                                    </div>
                                    <div
                                        class="pixel-chip bg-pix-ink text-white text-[10px] w-full block">
                                        {{ item.requirement || 'Unlock through progression' }}
                                    </div>
                                </div>
                            </div>

                        </div>

                        <!-- Empty State -->
                        <div v-if="currentItems.length === 0"
                            class="col-span-full text-center py-12 text-gray-500">
                            No items found in this category.
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import BackBtn from '@/components/navigation/BackButton.vue'
import { getShopItems } from '@/services/shop'
import gvPixelService from '@/services/gvPixel'

export default {
    name: 'ShoppingView',
    components: {
        BackBtn
    },
    data() {
        return {
            items: [],
            loading: true,
            error: null,
            offline: false,
            pendingSync: 0,
            activeTab: 'all',
            tabs: [
                { id: 'all', label: 'All Items' },
                { id: 'plant', label: 'Plants' },
                { id: 'avatar', label: 'Avatars' },
                { id: 'cardBack', label: 'Card Backs' },
                { id: 'border', label: 'Borders' }
            ]
        }
    },
    computed: {
        ...mapState({
            unlockedItems: state => state.progression?.unlocks?.cosmetics || [],
            equipped: state => state.progression?.cosmetics?.equipped,
            userBalance: state => state.user?.balance
        })
    },
    async mounted() {
        await this.fetchItems();
    },
    methods: {
        ...mapMutations(['equipCosmetic', 'unlockCosmetic']),

        isOfflineError(error) {
            if (typeof navigator !== 'undefined' && !navigator.onLine) return true;
            if (!error) return false;
            const message = error.message || '';
            return error.name === 'TypeError' ||
                /Failed to fetch|NetworkError|Load failed|Network request failed|network|offline/i.test(message);
        },

        async fetchItems() {
            this.loading = true;
            this.error = null;
            this.offline = false;

            if (typeof navigator !== 'undefined' && !navigator.onLine) {
                this.offline = true;
                this.loading = false;
                this.pendingSync = gvPixelService.getPendingSyncCount();
                return;
            }

            try {
                const data = await getShopItems();
                // Expected data structure: { items: [...] } or [...]
                // Adjusting based on standard response assumption
                this.items = Array.isArray(data) ? data : (data.items || []);
            } catch (err) {
                this.items = [];
                this.offline = this.isOfflineError(err);
                this.error = this.offline
                    ? 'Shop is unavailable while offline.'
                    : 'Failed to load shop items. Please try again.';
            } finally {
                this.loading = false;
                this.pendingSync = gvPixelService.getPendingSyncCount();
            }
        },

        isOwned(item) {
            // Plants logic might be different (e.g. infinite buy? or one time?)
            // For cosmetics:
            if (item.id.startsWith('default-')) return true;

            // Check if ID is in unlocked list
            return this.unlockedItems.includes(item.id);
        },

        isEquippable(item) {
            return ['avatar', 'cardBack', 'border'].includes(item.type);
        },

        isEquipped(item) {
            if (!this.isEquippable(item)) return false;
            if (!this.equipped) return false;

            if (item.type === 'avatar') return this.equipped.avatar === item.id || (item.id === 'default-avatar' && !this.equipped.avatar);
            if (item.type === 'cardBack') return this.equipped.cardBack === item.id || (item.id === 'default-back' && !this.equipped.cardBack);
            if (item.type === 'border') return this.equipped.border === item.id || (item.id === 'default-border' && !this.equipped.border);

            return false;
        },

        equip(item) {
            this.equipCosmetic({ type: item.type, id: item.id });
        }
    }
}
</script>
