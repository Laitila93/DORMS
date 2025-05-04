<template>
<div style="display: flex; flex-direction: column; align-items: center; gap: 4px;">
  <!-- Top row: image, text, etc. -->
  <div style="display: flex; align-items: center; gap: 8px; color: white">
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
</div>


</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { useShopData } from '@/composables/useShopData';
import { socket } from '@/composables/socket';
import { convertToDailyConsumption } from '@/composables/dataConverterProto';
import { calculateScore } from '@/composables/pointsPrototype';
import dummyData from '@/assets/raw_water_data.json';

const { shopData, shopUnlocks, equippedData, corridorId, xpScore } = useShopData();

/*Lines below to "onUnmounted" are for testing integrating Emils point algorithm and "real" water data. 
Functionality should be moved to server side later*/

const waterData = ref(null); // Water data received from the server
const dailyConsumption = ref(null); // Daily consumption data
const points = ref(null);

onMounted(() => {
  waterData.value = [...dummyData].reverse(); // Make a copy and reverse it
  dailyConsumption.value = convertToDailyConsumption(waterData.value);
  console.log('Daily consumption:', dailyConsumption);
  points.value = calculateScore({
    corridor: corridorId?.value,
    history: dailyConsumption.value?.history || [],
  });
  console.log('Points:', points.value);
  
  //To be used when "real" water data is available
  /*
  socket.emit('getDbWaterData'); // Emit event to get water data from the server
  console.log('Requesting water data...');
  socket.on('DbWaterData', (data: any) => {
    console.log('Water data received:', data);
    waterData.value = data; // Assign received data to waterData
    dailyConsumption.value = convertToDailyConsumption(waterData.value);
    console.log('Daily consumption:', dailyConsumption);
    points.value = calculateScore(dailyConsumption.value);
    console.log('Points:', points.value);
  });
  */
});
onUnmounted(() => {
  socket.off('DbWaterData'); // Clean up the socket listener when component is unmounted
});

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

const progressPercentage = computed(() => { // 0-100 progress since last unlock (not total). Can be edited to be total progress or whatever fits best
    return 100*((xpScore.value - lastItem.value.price) / (nextItem.value.price - lastItem.value.price));
});


</script>
<style scoped>
</style>