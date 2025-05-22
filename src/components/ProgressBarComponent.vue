<template>
  <div class="flex w-full gap-4 h-full">
    <!-- XP Progress Bar -->
    <div class="relative flex-1 border-2 border-black rounded overflow-hidden h-full min-h-[3rem]">
      <div
        class="absolute inset-y-0 left-0 transition-all duration-300"
        :style="{
          width: progressPercentage + '%',
          backgroundColor: 'green',
        }"
      ></div>
      <div class="absolute inset-0 flex items-center justify-center text-white text-xl pointer-events-none">
        XP: {{ xpScore }}
      </div>
    </div>

    <!-- Next Item Info -->
    <div
      v-if="nextItem"
      class="flex items-center gap-2 text-white"
      style="min-width: 0;"
    >
      <span class="truncate">Next: {{ nextItem.price }} XP</span>
      <img :src="nextItem.image" class="w-10 h-10 object-contain" />
      <span class="truncate">{{ nextItem.name }}</span>
    </div>

    <!-- Feedback Bar -->
    <div class="relative flex-1 border-2 border-black rounded overflow-hidden h-full min-h-[3rem]">
      <div
        class="absolute left-0 top-0 h-full transition-all duration-300"
        :style="{
          width: feedbackScore + '%',
          background: feedbackScore <= 50
            ? 'green'
            : `linear-gradient(to right, green 0%, yellow 50%, red 100%)`
        }"
      ></div>
      <div class="absolute inset-0 flex items-center justify-between px-2 text-white text-sm pointer-events-none">
        <span>Low</span>
        <span>High</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useShopData } from '@/composables/useShopData';
import { getSocket } from '@/composables/socket';
import { useScoreData } from '@/composables/useScoreData';
const socket = getSocket();

const { shopData } = useShopData(socket);
const { xpScore, feedbackScore } = useScoreData(socket);

const nextFish = computed(() => {
  const lockedFish = shopData.value?.fish
    .filter(fish => fish.price > xpScore.value)
    .sort((a, b) => a.price - b.price);
  return lockedFish?.[0];
});

const nextHat = computed(() => {
  const lockedHats = shopData.value?.hats
    .filter(hat => hat.price > xpScore.value)
    .sort((a, b) => a.price - b.price);
  return lockedHats?.[0];
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
    .sort((a, b) => b.price - a.price);
  return unlockedFish?.[0];
});

const lastHat = computed(() => {
  const unlockedHats = shopData.value?.hats
    .filter(hat => hat.price <= xpScore.value)
    .sort((a, b) => b.price - a.price);
  return unlockedHats?.[0];
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
    return 100;
  }
  const totalDiff = nextItem.value.price - lastItem.value.price;
  if (totalDiff <= 0) return 100;
  return 100 * ((xpScore.value - lastItem.value.price) / totalDiff);
});
</script>

<style scoped>
/* Ensure the bars fill their parent height */
.relative > .absolute {
  transition: width 0.3s;
}
</style>