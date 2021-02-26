<template>
  <div
    class="relative w-full h-full py-2 bg-pink-700 flex flex-col content-between items-center justify-center text-white"
  >
    <div class="m-2 absolute right-0 top-0">{{ card.point }}</div>
    <div
      class="my-1 flex flex-col"
      v-if="typeof card.content[0].text !== 'undefined'"
    >
      <div
        class="my-1 pb-1 border-b-2 border-black flex flex-col justify-center"
      >
        <span
          v-for="(content, index) in card.content[0].text"
          :key="'content-' + index"
          >{{ content }}</span
        >
        <div class="flex justify-center">
          <meaning-type
            :type="type"
            v-for="(type, index) in card.content[0].type"
            :key="'type-' + index"
          ></meaning-type>
        </div>
      </div>
      <div class="my-1 flex flex-col justify-center text-xs">
        <div class="flex justify-center">
          <meaning-type
            :type="type"
            v-for="(type, index) in card.content[1].type"
            :key="'type-' + index"
          ></meaning-type>
        </div>
        <span
          v-for="(content, index) in card.content[1].text"
          :key="'content-' + index"
          >{{ content }}</span
        >
      </div>
    </div>
    <div
      class="my-1 flex flex-col"
      v-if="typeof card.content[0].text === 'undefined'"
    >
      <div
        class="my-1"
        v-for="(content, index) in card.content"
        :key="'content-' + index"
      >
        <span>{{ content }}</span>
      </div>
    </div>

    <div class="ml-2 my-1 flex absolute bottom-0 left-0 z-10">
      <div
        class="p-1 bg-gray-200 rounded-md border-1 border-black text-black text-sxs md:text-xs"
      >
        {{ card.id }}
      </div>
    </div>
  </div>
</template>

<script>
import MeaningType from "@/components/cards/TypeSentence/Meaning.vue";
import Meaning from "./TypeSentence/Meaning.vue";
import { mapState } from "vuex";
export default {
  name: "adverb",
  props: {
    card: Object
  },
  components: {
    MeaningType
  },
  computed: {
    ...mapState({
      cardColors: state => state.playing.cardColors
    })
  }
};

Meaning;
</script>
