<template>
  <div
    class="relative w-40 h-56 pixel-card flex flex-col overflow-hidden select-none transition-transform hover:scale-105 p-1"
    :class="{ 'ring-4 ring-retro-primary': isSelected, 'opacity-50': isUsed }">
    <div class="w-full h-full border-2 border-white flex flex-col relative">
      <!-- Header: Points -->
      <div
        class="absolute top-1 right-1 bg-pix-warning text-pix-ink border border-pix-ink w-6 h-6 flex items-center justify-center text-xs font-bold z-10 card-font">
        {{ displayPoints }}
      </div>

      <!-- Image Area -->
      <div class="h-2/3 w-full bg-gray-200 overflow-hidden border-b-2 border-pix-ink">
        <img v-if="card.image" :src="`/assets/images/${card.image}`" class="w-full h-full object-cover pixelated"
          alt="card image" @error="handleImageError" />
        <div v-else class="w-full h-full flex items-center justify-center text-gray-400 text-xs card-font">No Image
        </div>
      </div>

      <!-- Content Area -->
      <div
        class="h-1/3 w-full flex flex-col justify-between p-2 bg-pix-paper border-t-2 border-pix-ink card-font overflow-y-auto cursor-auto">

        <!-- NOUN: Singular/Plural -->
        <div v-if="card.type === 'Noun'" class="flex flex-col gap-1 h-full justify-center">
          <div v-if="card.singular" @click.stop="selectChoice('singular', card.singular, 'singular')"
            class="cursor-pointer hover:bg-pix-warning p-1 text-center"
            :class="{ 'font-bold text-pix-ink underline': selectedChoiceKey === 'singular', 'text-gray-600': selectedChoiceKey !== 'singular' }">
            <span class="text-sm uppercase font-bold">{{ card.singular.text }}</span>
          </div>
          <div v-if="card.plural" @click.stop="selectChoice('plural', card.plural, 'plural')"
            class="cursor-pointer hover:bg-pix-warning p-1 text-center"
            :class="{ 'font-bold text-pix-ink underline': selectedChoiceKey === 'plural', 'text-gray-600': selectedChoiceKey !== 'plural' }">
            <span class="text-sm uppercase font-bold">{{ card.plural.text }}</span>
          </div>
        </div>

        <!-- ADJECTIVE: Main/Synonyms/Antonyms -->
        <div v-else-if="card.type === 'Adj' && card.content" class="flex flex-col h-full gap-1 overflow-y-auto">
          <!-- Main Word -->
          <div v-if="card.content.main"
            @click.stop="selectChoice('main', { text: card.content.main, point: card.point, type: 'main' })"
            class="cursor-pointer text-center border-b border-gray-400 pb-1"
            :class="{ 'font-bold text-pix-ink underline bg-pix-warning': selectedChoiceKey === 'main' }">
            {{ card.content.main }}
          </div>
          <!-- Synonyms -->
          <div v-if="card.content.additional && card.content.additional.synonym"
            class="flex flex-wrap gap-1 justify-center">
            <span v-for="(syn, idx) in card.content.additional.synonym" :key="'syn-' + idx"
              @click.stop="selectChoice('syn-' + idx, { text: syn, point: card.point, type: 'synonym' })"
              class="cursor-pointer text-[10px] bg-white border border-gray-300 px-1 hover:bg-pix-warning"
              :class="{ 'bg-pix-warning font-bold': selectedChoiceKey === 'syn-' + idx }">
              {{ syn }}
            </span>
          </div>
          <!-- Antonyms -->
          <div v-if="card.content.additional && card.content.additional.antonym"
            class="flex flex-wrap gap-1 justify-center border-t border-gray-300 pt-1">
            <span v-for="(ant, idx) in card.content.additional.antonym" :key="'ant-' + idx"
              @click.stop="selectChoice('ant-' + idx, { text: ant, point: card.point, type: 'antonym' })"
              class="cursor-pointer text-[10px] text-gray-500 hover:text-pix-ink"
              :class="{ 'text-pix-ink font-bold underline': selectedChoiceKey === 'ant-' + idx }">
              {{ ant }}
            </span>
          </div>
        </div>

        <!-- ADVERB: Text Choices -->
        <div v-else-if="card.type === 'Adverb' && card.content" class="flex flex-col h-full gap-1 overflow-y-auto">
          <template v-for="(group, gIdx) in card.content" :key="'adv-g-'+gIdx">
            <!-- If group has .text array -->
            <template v-if="group.text && Array.isArray(group.text)">
              <div v-for="(txt, tIdx) in group.text" :key="'adv-t-' + gIdx + '-' + tIdx"
                @click.stop="selectChoice('adv-' + gIdx + '-' + tIdx, { text: txt, point: card.point, type: 'adverb' })"
                class="cursor-pointer text-center hover:bg-pix-warning p-0.5"
                :class="{ 'bg-pix-warning font-bold': selectedChoiceKey === 'adv-' + gIdx + '-' + tIdx }">
                {{ txt }}
              </div>
            </template>
            <!-- If group is just a string (fallback) -->
            <template v-else-if="typeof group === 'string'">
              <div @click.stop="selectChoice('adv-s-' + gIdx, { text: group, point: card.point, type: 'adverb' })"
                class="cursor-pointer text-center hover:bg-pix-warning p-0.5"
                :class="{ 'bg-pix-warning font-bold': selectedChoiceKey === 'adv-s-' + gIdx }">
                {{ group }}
              </div>
            </template>
            <!-- If group is object but text is missing (edge case) -->
          </template>
        </div>

        <!-- CONJUNCTION: List of options -->
        <div v-else-if="card.type === 'Conj' && card.content" class="flex flex-col h-full justify-around">
          <div v-for="(item, idx) in card.content" :key="'conj-' + idx"
            @click.stop="selectChoice('conj-' + idx, { text: item.text, point: item.point, type: 'conj' })"
            class="cursor-pointer text-center p-1 border-b border-gray-200 last:border-0 hover:bg-pix-warning"
            :class="{ 'bg-pix-warning font-bold': selectedChoiceKey === 'conj-' + idx }">
            <span class="text-lg">{{ item.text }}</span>
            <span class="text-[10px] text-gray-500 ml-1">({{ item.point }})</span>
          </div>
        </div>

        <!-- PREPOSITION: Complex Layout (Simplified List) -->
        <div v-else-if="card.type === 'Prep'"
          class="flex flex-wrap gap-1 justify-center h-full content-start overflow-y-auto">
          <!-- Top Common Preps -->
          <div v-for="p in ['with', 'to', 'from', 'over', 'into', 'at', 'for', 'about', 'of']" :key="p"
            @click.stop="selectChoice('prep-' + p, { text: p, point: card.point, type: 'prep' })"
            class="cursor-pointer text-[10px] px-1 border border-gray-300 hover:bg-pix-warning"
            :class="{ 'bg-pix-warning font-bold': selectedChoiceKey === 'prep-' + p }">
            {{ p }}
          </div>
          <!-- Bottom Special -->
          <div v-for="p in ['away from', 'over to', 'away']" :key="p"
            @click.stop="selectChoice('prep-' + p, { text: p, point: card.point, type: 'prep' })"
            class="cursor-pointer text-[10px] px-1 border border-gray-300 bg-gray-100 hover:bg-pix-warning"
            :class="{ 'bg-pix-warning font-bold': selectedChoiceKey === 'prep-' + p }">
            {{ p }}
          </div>
        </div>

        <!-- HELPING VERB: List -->
        <div v-else-if="card.type === 'HelpingVerb' && card.content" class="flex flex-col gap-1 h-full overflow-y-auto">
          <template v-for="(group, gIdx) in card.content" :key="'hv-g-'+gIdx">
            <div v-for="(tObj, tIdx) in group.texts" :key="'hv-t-' + gIdx + '-' + tIdx"
              @click.stop="selectChoice('hv-' + gIdx + '-' + tIdx, { text: tObj.text, point: group.point, type: 'helping' })"
              class="cursor-pointer text-center p-1 border-b border-gray-200 hover:bg-pix-warning"
              :class="{ 'bg-pix-warning font-bold': selectedChoiceKey === 'hv-' + gIdx + '-' + tIdx }">
              <span v-html="tObj.text"></span>
            </div>
          </template>
        </div>

        <!-- EXTRA INFORMATION: Top / Bottom -->
        <div v-else-if="card.type === 'ExtraInformation'" class="flex flex-col h-full justify-between">
          <!-- Top Option (Bonus Point Logic usually) -->
          <div v-if="card.bonusPoint && card.bonusPoint[0]"
            @click.stop="selectChoice('ex-top', { text: card.bonusPoint[0].content.join('/'), point: card.bonusPoint[0].point, type: 'extra' })"
            class="cursor-pointer text-center p-1 border-b border-gray-300 hover:bg-pix-warning flex-1 flex items-center justify-center"
            :class="{ 'bg-pix-warning font-bold': selectedChoiceKey === 'ex-top' }">
            {{ card.bonusPoint[0].content.join('/') }}
          </div>
          <!-- Bottom Option -->
          <div v-if="card.content && card.content[1]"
            @click.stop="selectChoice('ex-bot', { text: card.content[1].text[0], point: card.point || 0, type: 'extra' })"
            class="cursor-pointer text-center p-1 hover:bg-pix-warning flex-1 flex items-center justify-center"
            :class="{ 'bg-pix-warning font-bold': selectedChoiceKey === 'ex-bot' }">
            {{ card.content[1].text[0] }}
          </div>
        </div>

        <!-- GENERIC/FALLBACK -->
        <div v-else class="text-center flex items-center justify-center h-full">
          <span class="font-bold text-xl text-pix-ink leading-none break-words uppercase">{{ displayContent.text
          }}</span>
        </div>

        <!-- ID Code -->
        <div class="text-[10px] text-gray-400 font-mono absolute bottom-1 right-1 opacity-50">{{ card.id }}</div>
      </div>

      <!-- Syntax Bars (Bottom) -->
      <!-- Simplified representation: Just a colored bar at the bottom for now -->
      <div class="h-2 w-full" :style="{ backgroundColor: syntaxColor }"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed, ref, watch } from 'vue';
import { VerbaCard, SyntaxColor } from '@/types/verba';

export default defineComponent({
  name: 'CardComponent',
  props: {
    card: {
      type: Object as PropType<VerbaCard>,
      required: true
    },
    isInteractive: {
      type: Boolean,
      default: true
    },
    isSelected: Boolean,
    isUsed: Boolean
  },
  setup(props, { emit }) {
    const selectedChoiceKey = ref<string>('');
    const selectedContent = ref<any>(null);

    // Initialize default selection based on card type
    const initSelection = () => {
      if (props.card.type === 'Noun') {
        selectedChoiceKey.value = 'singular';
        if (props.card.singular) {
          selectedContent.value = { ...props.card.singular, grammaticalNumber: 'singular' };
        }
      }
      // For other types, we might default to the first option or let user choose.
      // Let's default to nothing selected (or first available) to force interaction or show state?
      // Actually for N-Back/Gameplay, usually a default is good.
      else if (props.card.type === 'Adj' && props.card.content) {
        selectedChoiceKey.value = 'main';
        if (props.card.content && props.card.content.main) {
          selectedContent.value = { text: props.card.content.main, point: props.card.point, type: 'main' };
        }
      }
      // ... Add other defaults if needed, or leave null to require user click
    };

    // Watch for card changes to reset selection
    watch(() => props.card.id, () => {
      initSelection();
    }, { immediate: true });


    const hasChoices = computed(() => {
      // Legacy Noun check
      return !!(props.card.singular && props.card.plural);
    });

    const displayContent = computed(() => {
      // Fallback or generic display used for simple types
      if (selectedContent.value) return selectedContent.value;

      if (props.card.content && Array.isArray(props.card.content) && props.card.content.length > 0) {
        // Handle simple content array
        const first = props.card.content[0];
        // Extra logic for object wrappers
        if (first.text && Array.isArray(first.text)) return { text: first.text[0], point: props.card.point };
        if (first.text) return first;
        return { text: first, point: 0 };
      }
      return { text: props.card.type, point: 0 };
    });

    const displayPoints = computed(() => {
      return selectedContent.value ? selectedContent.value.point : props.card.point || 0;
    });

    const syntaxColor = computed(() => {
      // Map Type to Color
      switch (props.card.type) {
        case 'Noun': return 'purple';
        case 'Adj': return 'purple';
        case 'Verb': return 'green';
        case 'Prep': return 'red';
        case 'Time': return 'orange';
        case 'HelpingVerb': return 'blue';
        case 'Adverb': return 'pink';
        case 'ExtraInformation': return 'yellow';
        default: return 'gray';
      }
    });

    const selectChoice = (key: string, content: any, typeInfo: string = '') => {
      if (!props.isInteractive) return;

      selectedChoiceKey.value = key;
      selectedContent.value = content;

      // Emit event to notify parent of selection change with enriched data
      emit('selection-change', {
        id: props.card.id,
        choiceKey: key,
        typeInfo,
        content: content
      });
    };

    const handleImageError = (e: Event) => {
      (e.target as HTMLImageElement).style.display = 'none';
    };

    return {
      selectedChoiceKey,
      hasChoices,
      displayContent,
      displayPoints,
      syntaxColor,
      selectChoice,
      handleImageError
    };
  }
});
</script>
