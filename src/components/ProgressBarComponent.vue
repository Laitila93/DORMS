<template>
<div style="display: flex; flex-direction: column; align-items: center; gap: 4px;">
  <!-- Top row: image, text, etc. -->
  <div 
    v-if="nextItem"
    style="display: flex; align-items: center; gap: 8px; color: white"
  >
    <span>Next: {{ nextItem.price }} XP</span>
    <img :src="nextItem.image" style="width: 40px; height: 40px; object-fit: contain;" />
    <span>{{ nextItem.name }}</span>
  </div>

  <!-- Progress bar conatiner -->
  <div style="
    width: 100%; 
    max-width: 500px; 
    border: 3px solid #ccc; 
    height: 50px; 
    position: relative; 
    background-color: transparent; 
    overflow: hidden; 
    border-radius: 4px; 
    border-color: black;
    "
  >
  <!-- Progress bar -->
    <div
      :style="{
        width: progressPercentage + '%',
        height: '100%',
        backgroundColor: 'green',
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 1
      }"
    ></div>
    <div
      style="position: absolute; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: white; font-size: 24px; z-index: 2;"
    >
      XP: {{ xpScore }}
    </div>
  </div>
  
  <!-- Feedback bar -->
  <div style="width: 100%; max-width: 500px; margin-top: 12px;">
    <div style="text-align: center; color: white; font-size: 16px; margin-bottom: 4px;">
      Today's water consumption:
    </div>
    <div style="
      width: 100%;
      height: 50px;
      position: relative;
      border: 3px solid #ccc;
      border-color: black;
      border-radius: 4px;
      background-color: transparent;
      overflow: hidden;
      color: white;
      font-size: 14px;
    ">
      <!-- Filled part of the bar, AI help with color gradient -->
      <div
        :style="{
          width: feedbackScore + '%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 1,
          background: feedbackScore <= 50
            ? 'green'
            : `linear-gradient(
                to right,
                green 0%,
                green ${(50 / feedbackScore) * 100}%,
                yellow ${(75 / feedbackScore) * 100}%,
                red 100%
              )`
        }"
      ></div>
      <!-- Text inside the bar -->
      <div
        style="position: absolute; width: 100%; height: 100%; display: flex; align-items: center; justify-content: space-between; padding: 0 8px; z-index: 2;"
      >
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
const socket = getSocket(); // Import the socket instance from socket.ts

const { shopData, shopUnlocks, equippedData, corridorId, xpScore, feedbackScore } = useShopData();


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