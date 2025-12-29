<template>
  <div class="page-shell pixel-bg">
    <div class="w-full max-w-5xl">
      <!-- Header -->
      <div class="flex items-center mb-8">
        <back-btn class="mr-4 static" />
        <h1 class="text-3xl font-bold text-pix-ink card-font uppercase tracking-wide">Market</h1>
      </div>

      <!-- Main Panel -->
      <div class="pixel-panel p-6 md:p-8 bg-pix-paper min-h-[600px]">
        <div class="flex flex-wrap items-center justify-center gap-6">

          <!-- Card 1 -->
          <div class="pixel-card bg-orange-100 p-4 w-72 flex flex-col items-center">
            <div class="pixel-inset bg-white w-full h-48 mb-4 flex items-center justify-center overflow-hidden">
               <img
                class="w-32 pixelated"
                src="https://user-images.githubusercontent.com/2805249/64069899-8bdaa180-cc97-11e9-9b19-1a9e1a254c18.png"
                alt="Peace Lily"
              />
            </div>
            <div class="w-full text-pix-ink">
              <span class="text-xs font-bold uppercase opacity-70">Indoor</span>
              <div class="flex justify-between items-center mt-1">
                <span class="font-bold text-lg">Peace Lily</span>
                <span class="pixel-chip bg-orange-500 text-white font-bold">$36.00</span>
              </div>
              <button class="pixel-btn primary w-full mt-4 text-sm">BUY</button>
            </div>
          </div>

          <!-- Card 2 -->
          <div class="pixel-card bg-teal-100 p-4 w-72 flex flex-col items-center">
             <div class="pixel-inset bg-white w-full h-48 mb-4 flex items-center justify-center overflow-hidden">
               <img
                class="w-32 pixelated"
                src="https://user-images.githubusercontent.com/2805249/64069998-305de300-cc9a-11e9-8ae7-5a0fe00299f2.png"
                alt="Monstera"
              />
             </div>
            <div class="w-full text-pix-ink">
              <span class="text-xs font-bold uppercase opacity-70">Outdoor</span>
              <div class="flex justify-between items-center mt-1">
                <span class="font-bold text-lg">Monstera</span>
                <span class="pixel-chip bg-teal-500 text-white font-bold">$45.00</span>
              </div>
              <button class="pixel-btn primary w-full mt-4 text-sm">BUY</button>
            </div>
          </div>

          <!-- Card 3 -->
          <div class="pixel-card bg-purple-100 p-4 w-72 flex flex-col items-center">
             <div class="pixel-inset bg-white w-full h-48 mb-4 flex items-center justify-center overflow-hidden">
              <img
                class="w-32 pixelated"
                src="https://user-images.githubusercontent.com/2805249/64069899-8bdaa180-cc97-11e9-9b19-1a9e1a254c18.png"
                alt="Oak Tree"
              />
             </div>
            <div class="w-full text-pix-ink">
              <span class="text-xs font-bold uppercase opacity-70">Outdoor</span>
              <div class="flex justify-between items-center mt-1">
                <span class="font-bold text-lg">Oak Tree</span>
                <span class="pixel-chip bg-purple-500 text-white font-bold">$68.50</span>
              </div>
              <button class="pixel-btn primary w-full mt-4 text-sm">BUY</button>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BackBtn from '@/components/navigation/BackButton.vue'

export default {
  name: 'market-view',
  components: {
    BackBtn
  }
}
</script>
