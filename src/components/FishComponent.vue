<template>
  <div
    class="absolute"
    :class="{ 'glow-effect': fishIsBeingStyled, 'blurred': isBlurred }"
    :style="{
      top: `${fishY}px`,
      left: `${fishX}px`,
      transition: 'top 5s, left 5s, z-index 5s',
      zIndex: `${fishZ}`,
      transform: isBlurred? `scale(${randomScale})` : `scale(1)`
    }"
    @click="() => {fishClicked()}"
  >
    <!--Selected Fish and Hat swimming around in tank-->
    <div class="fish-wiggle">
      <!--Fish -->
      <img
      v-if="fish"
      :key="fish.name"
      :src="fish.image"
      :alt="fish.name"
      class="w-24 h-24 object-contain "
      :style="{ transform: isFlipped ? 'scaleX(-1)' : 'scaleX(1)' }"
      />
      <!-- Hat -->
      <img
        v-if="hat"
        :key="hat.name"
        :src="hat.image"
        :alt="hat.name"
        class="w-12 absolute"
        :style="{
          top: '-15px',
          left: '50%', // Center the hat horizontally
          transform: `translateX(-50%) ${isFlipped ? 'scaleX(-1)' : 'scaleX(1)'}`, // Adjust to center relative to the fish
        }"
      />
    </div>

    <!-- Hat Selector Box -->
    <div
      v-if="showHatSelector"
      class="absolute z-50 bg-white/40 border border-gray-300 p-4 rounded-xl w-64 h-60 flex flex-col items-center backdrop-blur-md"
      style="top: -220px; left: -250px;"
    >
      <div class="relative flex items-center justify-center w-full h-32">
        <button @click.stop="prevHat"  class="bg-blue-400 hover:bg-blue-500 text-white font-bold text-2x1 px-4 py-1 rounded-full shadow transition duration-300">
          ←
        </button>
        <img
          v-if="currentHat"
          :src="currentHat.image"
          :alt="currentHat.name"
          class="h-24 object-contain"
          :style="{
            filter: isHatAvailable ? 'none' : 'grayscale(100%)',
            opacity: isHatAvailable ? 1 : 0.6
          }"
        />
        <div v-else class="text-gray-500 flex justify-center items-center w-24 h-24 font-bold">
          No hat
        </div>
        <button @click.stop="nextHat" class="bg-blue-400 hover:bg-blue-500 text-white font-bold text-2x1 px-4 py-1 rounded-full shadow transition duration-300">
          →
        </button>
      </div>
      <div class="mt-2 h-5 text-sm font-semibold">
        <p v-if="currentHat">
          {{ currentHat.name }}
        </p>
      </div>
      <div v-if="isHatAvailable">
        <button @click.stop="applyHat" class="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded">
        Select
        </button>
      </div>
      <div v-else>
        Unlocks at {{ currentHat?.price }} XP
      </div>

    </div>

    <!-- Fish Selector Box -->
    <div
      v-if="showFishSelector"
      class="absolute z-50 bg-white/40 border border-gray-300 p-4 rounded-xl w-64 h-60 flex flex-col items-center backdrop-blur-md"
      style="top: -220px; left: 50px;"
    >
      <div class="relative flex items-center justify-center w-full h-32">
        <button @click.stop="prevFish"  class="bg-blue-400 hover:bg-blue-500 text-white font-bold text-2x1 px-4 py-1 rounded-full shadow transition duration-300">←</button>

        <img
          v-if="currentFish"
          :src="currentFish.image"
          :alt="currentFish.name"
          class="h-24 object-contain"
          :style="{
            filter: isFishAvailable ? 'none' : 'grayscale(100%)',
            opacity: isFishAvailable ? 1 : 0.6
          }"
        />
        <button @click.stop="nextFish" class="bg-blue-400 hover:bg-blue-500 text-white font-bold text-2x1 px-4 py-1 rounded-full shadow transition duration-300">→</button>
      </div>
      <p class="mt-2 text-sm font-semibold" v-if="currentFish">
        {{ currentFish.name }}
      </p>
      <div v-if="isFishAvailable"> 
        <button @click.stop="applyFish" class="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded">
        Select
        </button>
      </div>
      <div v-else>
        Unlocks at {{ currentFish?.price }} XP
      </div>

    </div>

  </div>

</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useFishBehavior } from '@/composables/useFishBehavior';

const props = defineProps<{
  fishType: string;
  hatType: string;
  socket: any;
  waterBounds: DOMRect | null;
  position: number;
  rockBounds: DOMRect | null;
  isBlurred: boolean;
}>();

const {
  fish, hat, fishX, fishY, fishZ, randomScale, isFlipped,
  fishIsBeingStyled, showHatSelector, showFishSelector,
  currentHat, currentFish, currentHatIndex, currentFishIndex,
  fishClicked, prevHat, nextHat, prevFish, nextFish,
  applyHat, applyFish, isHatAvailable, isFishAvailable,
  scheduleMoveFish
} = useFishBehavior(props);

onMounted(() => {
  scheduleMoveFish();
});
</script>
