<template>
  <div
    class="w-full h-full bg-purple-900 flex flex-col items-center justify-center text-white"
  >
    <div class="my-1">4</div>
    <div class="my-1 flex flex-col">
      <div class="text-lg">
        <span class="border-b-1 border-white">brave</span>
      </div>
      <div class="text-xs flex flex-col my-1">
        <span>courageous</span>
        <span>fearless</span>
      </div>
      <div class="text-xs flex flex-col border-1 border-white rounded-md">
        <span>cowardly</span>
        <span>fearful</span>
      </div>
    </div>
    <div class="my-1 flex flex-col">
      <div>B</div>
      <div>queen/princess</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "adjective-card",
  data() {
    return {
      id: "",
      texts: [],
      point: 0,
      useFor: [],
      extraPoint: []
    };
  }
};
</script>
