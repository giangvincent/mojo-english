<template>
  <div class="flex flex-col">
    <div class="h-64 flex flex-wrap">
      <div class="w-1/3">player 1</div>
      <div class="w-1/3">player 2</div>
      <div class="w-1/3">player 3</div>
    </div>
    <!-- Other players -->
    <div class="h-64 flex content-center justify-center">
      <div>Cards</div>
    </div>
    <!-- Table -->
    <div class="h-64 flex">
      <div class="w-1/7">card</div>
      <div class="w-1/7">card</div>
      <div class="w-1/7">card</div>
      <div class="w-1/7">card</div>
      <div class="w-1/7">card</div>
      <div class="w-1/7">card</div>
      <div class="w-1/7">card</div>
    </div>
    <!-- Player table -->
  </div>
</template>

<script>
export default {
  name: "playing-ground"
};
</script>

<style>
.w-1\/7 {
  width: 14.286%;
}
</style>
