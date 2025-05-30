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
import { useShopData } from '@/composables/useShopData';
import { getSocket } from '@/composables/socket';
import { useScoreData } from '@/composables/useScoreData';
import { useProgressData } from '@/composables/useProgressData';
import type { ShopData } from "@/composables/shopTypes";

const socket = getSocket();

const { shopData } = useShopData(socket);
const { xpScore, feedbackScore } = useScoreData(socket);
const { nextItem, progressPercentage } = useProgressData(shopData.value as ShopData, xpScore.value);
</script>

<style scoped>
/* Ensure the bars fill their parent height */
.relative > .absolute {
  transition: width 0.3s;
}
</style>