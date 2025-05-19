<template>
<div class="barWrapper flex flex-col items-center gap-2">

  <!-- Top row: image, text, etc. -->
  <div 
    v-if="nextItem"
    style="display: flex; align-items: center; gap: 8px; color: white"
  >
    <span>Next: {{ nextItem.price }} XP</span>
    <img :src="nextItem.image" style="width: 40px; height: 40px; object-fit: contain;" />
    <span>{{ nextItem.name }}</span>
  </div>

  <div class="flex w-full max-w-[1000px] gap-4">
    <div class="relative flex-1 h-12 border-2 border-black rounded overflow-hidden">
      <div :style="{width: progressPercentage + '%', backgroundColor: 'green'}" class="absolute inset-y-0 left-0"></div>
    <div class="absolute inset-0 flex items-center justify-center text-white text-xl">
      XP: {{ xpScore }}
    </div>
    </div>
    <!-- Feedback bar, no color atm, partially AI-generated-->
     <div class="relative flex-1 h-12 border-2 border-black rounded overflow-hidden">
     <div :style="{ width: feedbackScore + '%', background: feedbackScore <= 50 ? 'green' :`linear-gradient(to right, green 0%, green \${(50/feedbackScore) * 100}%, yellow \${(75/feedbackScore) * 100}%, red 100%)`}" class="absolute inset-y-0 left-0"></div>
     <div class="absolute inset-0 flex items-center justify-between px-2 text-white text-sm">
      <span>Low</span>
      <span>High</span>
     </div>
    </div>
  </div>

</div>

</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { useShopData } from '@/composables/useShopData';
import { getSocket } from '@/composables/socket';
import { useScoreData } from '@/composables/useScoreData';
const socket = getSocket(); // Import the socket instance from socket.ts

const { shopData } = useShopData(socket);
const { xpScore, feedbackScore } = useScoreData(socket);
console.log("xpScore", xpScore.value);
console.log("feedbackScore", feedbackScore.value);

const nextFish = computed(() => {
    const lockedFish = shopData.value?.fish
        .filter(fish => fish.price > xpScore.value)
        .sort((a, b) => a.price - b.price); // sort by price ascending

    return lockedFish?.[0]; // return cheapest locked fish
});

const nextHat = computed(() => {
    const lockedHats = shopData.value?.hats
        .filter(hat => hat.price > xpScore.value)
        .sort((a, b) => a.price - b.price);

    return lockedHats?.[0]; // return cheapest locked hat
});

const nextItem = computed(() => {
    const fish = nextFish.value;
    const hat = nextHat.value;

    if (!fish) return hat;
    if (!hat) return fish;

    return fish.price < hat.price ? fish : hat;
});

const lastFish = computed(() => {
    const unlockedFish = shopData.value?.fish
        .filter(fish => fish.price <= xpScore.value)
        .sort((a, b) => b.price - a.price); // sort by price descending

    return unlockedFish?.[0]; // return most expensive unlocked fish
});

const lastHat = computed(() => {
    const unlockedHats = shopData.value?.hats
        .filter(hat => hat.price <= xpScore.value)
        .sort((a, b) => b.price - a.price);

    return unlockedHats?.[0]; // return most expensive unlocked hat
});

const lastItem = computed(() => {
    const fish = lastFish.value;
    const hat = lastHat.value;

    if (!fish) return hat;
    if (!hat) return fish;

    return fish.price > hat.price ? fish : hat;
});

const progressPercentage = computed(() => {
  if (!nextItem.value || !lastItem.value) {
    return 100; // User has unlocked everything or something is missing
  }

  const totalDiff = nextItem.value.price - lastItem.value.price;
  if (totalDiff <= 0) return 100; // Avoid division by zero or negative progress

  return 100 * ((xpScore.value - lastItem.value.price) / totalDiff);
});



</script>
<style scoped>
</style>