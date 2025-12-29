<template>
  <div class="page-shell pixel-bg">
    <div class="w-full max-w-5xl">
      <!-- Header -->
      <div class="flex items-center mb-8">
        <back-button class="mr-4 static" />
        <h1 class="text-3xl font-bold text-pix-ink card-font uppercase tracking-wide">Cosmetics Shop</h1>
      </div>

      <!-- Main Panel -->
      <div class="pixel-panel p-6 md:p-8 bg-pix-paper min-h-[600px]">

        <!-- Tabs -->
        <div class="flex flex-wrap gap-2 md:gap-4 mb-8 border-b-4 border-pix-ink pb-4">
          <button
            @click="activeTab = 'avatars'"
            class="pixel-btn transition-transform"
            :class="activeTab === 'avatars' ? 'primary' : 'ghost border-2 border-pix-ink'"
          >
            Avatars
          </button>
          <button
            @click="activeTab = 'cardBacks'"
            class="pixel-btn transition-transform"
            :class="activeTab === 'cardBacks' ? 'primary' : 'ghost border-2 border-pix-ink'"
          >
            Card Backs
          </button>
          <button
            @click="activeTab = 'borders'"
            class="pixel-btn transition-transform"
            :class="activeTab === 'borders' ? 'primary' : 'ghost border-2 border-pix-ink'"
          >
            Borders
          </button>
        </div>

        <!-- Grid -->
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <div
            v-for="item in currentItems"
            :key="item.id"
            class="pixel-card p-4 flex flex-col items-center relative transition-transform hover:-translate-y-1"
            :class="{ 'bg-yellow-50': isEquipped(item.id) }"
          >

            <div v-if="isEquipped(item.id)" class="absolute -top-3 right-2 pixel-chip bg-pix-warning text-pix-ink font-bold z-10">
              EQUIPPED
            </div>

            <!-- Preview Placeholder -->
            <div class="w-24 h-24 pixel-inset bg-white mb-4 flex items-center justify-center text-4xl">
              {{ item.icon }}
            </div>

            <h3 class="font-bold text-center text-pix-ink mb-2">{{ item.name }}</h3>

            <div v-if="isUnlocked(item.id)" class="w-full mt-auto pt-2">
              <button
                v-if="!isEquipped(item.id)"
                @click="equip(item.id)"
                class="pixel-btn success w-full text-sm py-2"
              >
                EQUIP
              </button>
              <button
                v-else
                disabled
                class="pixel-btn ghost w-full text-sm py-2 opacity-50 cursor-default"
              >
                EQUIPPED
              </button>
            </div>

            <div v-else class="w-full mt-auto pt-2 text-center">
              <div class="text-xs text-pix-ink font-bold uppercase mb-2 opacity-70">Locked</div>
              <div class="pixel-chip bg-pix-ink text-white text-[10px] w-full block">
                {{ item.requirement }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import BackButton from '@/components/navigation/BackButton.vue'

export default {
    name: 'CosmeticsScreen',
    components: {
      BackButton
    },
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
        ...mapMutations(['equipCosmetic']),
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
