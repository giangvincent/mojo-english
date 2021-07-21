<template>
  <div
    class="w-full h-full bg-yellow-700 flex flex-wrap items-center justify-center relative"
  >
    <div class="my-1 mx-2 absolute right-0 top-0">{{ card.point }}</div>
    <div
      class="px-1 pt-2 pb-6 flex flex-col w-full h-full text-xs items-center"
    >
      <div class="w-full h-1/2 flex flex-col items-center justify-end pb-1">
        <span>{{ card.content[0].text }}</span>
        <span v-if="card.content[0].type && card.content[0].type == 'singular'">
          <svg
            class="w-3 h-3 text-black"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </span>
      </div>
      <hr class="w-2/3 border-b-1 border-black" />
      <div class="w-full h-1/2 flex flex-col items-center pt-1">
        <span v-if="card.content[1].type && card.content[1].type == 'singular'">
          <svg
            class="w-3 h-3 text-black"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </span>
        <span v-if="card.content[1].type && card.content[1].type == 'plural'">
          <svg
            class="w-3 h-3 text-black"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
        </span>
        <span>{{ card.content[1].text }}</span>
      </div>
    </div>

    <div class="my-0.5 flex absolute bottom-0 w-full text-black">
      <div class="w-5 -mt-0.5">
        <div
          v-if="card.previousCards[0] == 'Noun'"
          class="h-1/2 p-0.5 bg-white rounded-tr-md border-t-1 border-r-1 border-black"
        >
          <svg
            class="w-3 h-3"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div
          v-if="card.previousCards[0] == 'Location'"
          class="w-10 h-1/2 p-0.5 bg-white rounded-tr-md border-t-1 border-r-1 border-black flex"
        >
          <svg
            class="w-3 h-3"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"
            />
          </svg>
          <span class="text-sxs">C/D</span>
        </div>
        <div
          v-if="card.previousCards[1] && card.previousCards[1] == 'Verb'"
          class="h-1/2 bg-green-800 rounded-tr-md border-t-1 border-r-1 border-black"
        ></div>
        <div
          v-if="card.previousCards.length == 1"
          class="h-1/2 bg-white border-b-1 border-black"
        ></div>
      </div>
      <!-- previous card colors -->
      <div class="w-full -ml-3 relative">
        <div class="flex justify-center mb-0.5">
          <div
            v-if="card.condition[0].type == 'Location'"
            class="w-4 h-4"
          ></div>
          <div
            v-if="
              card.condition[0].type == 'Noun' &&
              card.condition[0].categories[1] == 'animal'
            "
            class="bg-black w-4 h-4 rounded-sm p-0.5 mr-0.5"
          >
            <svg
              class="text-white"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M9 3a1 1 0 012 0v5.5a.5.5 0 001 0V4a1 1 0 112 0v4.5a.5.5 0 001 0V6a1 1 0 112 0v5a7 7 0 11-14 0V9a1 1 0 012 0v2.5a.5.5 0 001 0V4a1 1 0 012 0v4.5a.5.5 0 001 0V3z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <div
            v-if="
              card.condition[0].type == 'Noun' &&
              card.condition[0].categories[0] == 'person'
            "
            class="bg-black w-4 h-4 rounded-sm p-0.5"
          >
            <svg
              class="text-white"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
        </div>

        <!-- plural -->
        <div
          class="text-sxs md:text-sm flex bg-white rounded-md border-1 border-gray-700"
        >
          <div
            class="p-0.5 border-r-1 border-gray-800 flex items-center justify-center"
          >
            {{ card.id }}
          </div>
          <div class="flex items-center justify-between p-0.5">
            <span
              class="flex"
              v-html="card.bonusPoint[0].content.join('/')"
            ></span>
            <span>+{{ card.bonusPoint[0].point }}</span>
          </div>
        </div>
        <!-- bonus point -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Extra-Information-card',
  props: {
    card: Object
  },
  data () {
    return {}
  }
}
</script>
