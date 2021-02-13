<template>
  <div class="flex flex-col relative h-full">
    <div class="flex flex-wrap content-center items-center">
      <div class="m-2">
        <figure>
          <img
            class="w-20 rounded-md border-2 border-gray-500"
            src="@/assets/images/default-avatar.jpg"
            alt=""
            srcset=""
          />
        </figure>
        player 1
      </div>
      <div class="m-2">
        <figure>
          <img
            class="w-20 rounded-md border-2 border-gray-500"
            src="@/assets/images/default-avatar.jpg"
            alt=""
            srcset=""
          />
        </figure>
        player 2
      </div>
      <div class="m-2">
        <figure>
          <img
            class="w-20 rounded-md border-2 border-gray-500"
            src="@/assets/images/default-avatar.jpg"
            alt=""
            srcset=""
          />
        </figure>
        player 3
      </div>
    </div>
    <!-- Other players -->

    <!-- Table -->
    <div class="flex absolute bottom-0 w-full p-2 bg-gray-700">
      <div class="absolute top-0 -mt-10 left-0 right-0">
        <div>Cards</div>
      </div>
      <div
        class="w-1/7 h-28 xs:h-32 md:h-48 m-1 bg-gray-300 rounded-md border-2 border-white"
      >
        card
      </div>
      <div
        class="w-1/7 h-28 xs:h-32 md:h-48 m-1 bg-gray-300 rounded-md border-2 border-white"
      >
        card
      </div>
      <div
        class="w-1/7 h-28 xs:h-32 md:h-48 m-1 bg-gray-300 rounded-md border-2 border-white"
      >
        card
      </div>
      <div
        class="w-1/7 h-28 xs:h-32 md:h-48 m-1 bg-gray-300 rounded-md border-2 border-white"
      >
        card
      </div>
      <div
        class="w-1/7 h-28 xs:h-32 md:h-48 m-1 bg-gray-300 rounded-md border-2 border-white"
      >
        card
      </div>
      <div
        class="w-1/7 h-28 xs:h-32 md:h-48 m-1 bg-gray-300 rounded-md border-2 border-white"
      >
        card
      </div>
      <div
        class="w-1/7 h-28 xs:h-32 md:h-48 m-1 bg-gray-300 rounded-md border-2 border-white"
      >
        card
      </div>
    </div>
    <!-- Player table -->
  </div>
</template>

<script>
export default {
  name: "playing-ground",
};
</script>

<style>
.w-1\/7 {
  width: 14.286%;
}
</style>
