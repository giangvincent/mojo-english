<template>
    <div class="min-h-screen bg-gray-900 text-white p-4 pb-20">
        <div class="flex items-center mb-6">
            <button @click="$router.push('/')" class="mr-4 p-2 bg-gray-800 rounded-full hover:bg-gray-700">
                ←
            </button>
            <h1 class="text-2xl font-bold">Cosmetics Shop</h1>
        </div>

        <!-- Tabs -->
        <div class="flex gap-4 mb-6 border-b border-gray-700 pb-2">
            <button @click="activeTab = 'avatars'" class="pb-2 px-2 font-bold transition-colors"
                :class="activeTab === 'avatars' ? 'text-yellow-400 border-b-2 border-yellow-400' : 'text-gray-400'">
                Avatars
            </button>
            <button @click="activeTab = 'cardBacks'" class="pb-2 px-2 font-bold transition-colors"
                :class="activeTab === 'cardBacks' ? 'text-yellow-400 border-b-2 border-yellow-400' : 'text-gray-400'">
                Card Backs
            </button>
            <button @click="activeTab = 'borders'" class="pb-2 px-2 font-bold transition-colors"
                :class="activeTab === 'borders' ? 'text-yellow-400 border-b-2 border-yellow-400' : 'text-gray-400'">
                Borders
            </button>
        </div>

        <!-- Grid -->
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div v-for="item in currentItems" :key="item.id"
                class="bg-gray-800 rounded-xl p-4 flex flex-col items-center border border-gray-700 relative"
                :class="{ 'border-yellow-500 bg-gray-750': isEquipped(item.id) }">

                <div v-if="isEquipped(item.id)" class="absolute top-2 right-2 text-yellow-500 text-xs font-bold">
                    EQUIPPED
                </div>

                <!-- Preview Placeholder -->
                <div
                    class="w-20 h-20 bg-gray-700 rounded-lg mb-4 flex items-center justify-center text-3xl shadow-inner">
                    {{ item.icon }}
                </div>

                <h3 class="font-bold text-center mb-1">{{ item.name }}</h3>

                <div v-if="isUnlocked(item.id)" class="w-full mt-2">
                    <button v-if="!isEquipped(item.id)" @click="equip(item.id)"
                        class="w-full bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold py-2 rounded transition-colors">
                        Equip
                    </button>
                    <button v-else disabled
                        class="w-full bg-gray-600 text-gray-300 text-sm font-bold py-2 rounded cursor-default">
                        Equipped
                    </button>
                </div>

                <div v-else class="w-full mt-2 text-center">
                    <div class="text-xs text-gray-500 mb-2">Locked</div>
                    <div class="text-xs text-yellow-600 bg-yellow-900 bg-opacity-20 px-2 py-1 rounded">
                        {{ item.requirement }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
    name: 'CosmeticsScreen',
    data() {
        return {
            activeTab: 'avatars',
            // Hardcoded catalog for now
            catalog: {
                avatars: [
                    { id: 'default-avatar', name: 'Default', icon: '👤', requirement: 'None' },
                    { id: 'avatar-present-badge', name: 'Present Pro', icon: '🎓', requirement: 'Achieve: Present Pro' },
                    { id: 'avatar-past-badge', name: 'Past Pilot', icon: '✈️', requirement: 'Achieve: Past Pilot' },
                    { id: 'avatar-trophy', name: 'Champion', icon: '🏆', requirement: 'Achieve: Victory Lap' },
                    { id: 'avatar-collector', name: 'Collector', icon: '🖼️', requirement: 'Achieve: Art Collector' },
                    { id: 'weekly-star', name: 'Weekly Star', icon: '⭐', requirement: 'Mission: Weekly Builder' }
                ],
                cardBacks: [
                    { id: 'default-back', name: 'Classic', icon: '🎴', requirement: 'None' },
                    { id: 'card-back-rainbow', name: 'Rainbow', icon: '🌈', requirement: 'Achieve: Tense Boss' },
                    { id: 'card-back-combo', name: 'Combo Master', icon: '🔥', requirement: 'Achieve: Bonus Hunter' }
                ],
                borders: [
                    { id: 'default-border', name: 'Standard', icon: '⬜', requirement: 'None' },
                    { id: 'border-factory', name: 'Industrial', icon: '🏭', requirement: 'Achieve: Sentence Factory' },
                    { id: 'border-perfect', name: 'Perfectionist', icon: '✨', requirement: 'Achieve: Perfect Round' },
                    { id: 'border-ultra', name: 'Ultra', icon: '⚡', requirement: 'Achieve: Ultra Combo' }
                ]
            }
        }
    },
    computed: {
        ...mapState({
            unlockedItems: state => state.progression.unlocks.cosmetics || [],
            equipped: state => state.progression.cosmetics.equipped
        }),
        currentItems() {
            return this.catalog[this.activeTab]
        }
    },
    methods: {
        ...mapMutations(['equipCosmetic']), // Need to add this mutation
        isUnlocked(id) {
            if (id.startsWith('default-')) return true
            return this.unlockedItems.includes(id)
        },
        isEquipped(id) {
            if (this.activeTab === 'avatars') return this.equipped.avatar === id || (id === 'default-avatar' && !this.equipped.avatar)
            if (this.activeTab === 'cardBacks') return this.equipped.cardBack === id || (id === 'default-back' && !this.equipped.cardBack)
            if (this.activeTab === 'borders') return this.equipped.border === id || (id === 'default-border' && !this.equipped.border)
            return false
        },
        equip(id) {
            let type = 'avatar'
            if (this.activeTab === 'cardBacks') type = 'cardBack'
            if (this.activeTab === 'borders') type = 'border'

            this.equipCosmetic({ type, id })
        }
    }
}
</script>
