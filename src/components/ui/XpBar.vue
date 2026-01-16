<template>
  <div class="xp-shell" :aria-label="`Level ${level} XP progress`">
    <div class="xp-header">
      <span class="chip">Lv {{ level }}</span>
      <span class="value">{{ currentXp }} / {{ xpToNext }}</span>
    </div>
    <div class="bar">
      <div class="fill" :style="{ width: fillWidth }"></div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  currentXp: { type: Number, required: true },
  xpToNext: { type: Number, required: true },
  level: { type: Number, required: true }
})

const fillWidth = computed(() => {
  if (props.xpToNext <= 0) return '0%'
  const pct = Math.min(100, Math.max(0, (props.currentXp / props.xpToNext) * 100))
  return `${pct}%`
})
</script>

<style scoped>
.xp-shell {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 6px;
  color: #e5e7eb;
}
.xp-header {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  letter-spacing: 0.01em;
}
.chip {
  padding: 4px 8px;
  border-radius: 999px;
  background: rgba(16, 185, 129, 0.18);
  color: #a7f3d0;
  font-weight: 700;
}
.value {
  font-variant-numeric: tabular-nums;
  color: #cbd5e1;
}
.bar {
  position: relative;
  width: 100%;
  height: 8px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  overflow: hidden;
}
.fill {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  background: linear-gradient(135deg, #22c55e, #10b981);
  border-radius: 999px;
  box-shadow: 0 4px 16px rgba(16, 185, 129, 0.35);
  transition: width 180ms ease;
}
</style>
