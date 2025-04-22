<template>
  <div
    class="absolute transition-all duration-5000 ease-in-out fish-wiggle"
    :style="{
      top: `${fishY}px`,
      left: `${fishX}px`
    }"
  >
  <img
  v-if="fish"
  :key="fish.name"
  :src="fish.image"
  :alt="fish.name"
  class="w-full h-40 object-contain rounded-md mb-4"
  :style="{ transform: isFlipped ? 'scaleX(-1)' : 'scaleX(1)' }"
/>

<img
  v-if="hat"
  :key="hat.name"
  :src="hat.image"
  :alt="hat.name"
  class="w-17 absolute"
  :style="{
    top: '-15px',
    left: '50%', // Center the hat horizontally
    transform: 'translateX(-50%)', // Adjust to center relative to the fish
  }"
/>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useShopData } from '@/composables/useShopData'; // Import the composable for shop data
const props = defineProps<{
  fishType: string;
  hatType: string;
  socket: any; // optional now, unused
  bounds: DOMRect | null;
}>();

const { shopData,  } = useShopData();
const fishX = ref(100);
const fishY = ref(100);
const isFlipped = ref(false); // Tracks whether the fish is flipped
let fish = ref(shopData.value?.fish.find(f => f.name === props.fishType) || null);
let hat = ref(shopData.value?.hats.find(h => h.name === props.hatType) || null);


onMounted(() => {
  scheduleMoveFish(); // Start the random movement
});

// Watch for changes in props
watch(() => props.fishType, () => {
  fish.value = findFish() || null;
});
watch(() => props.hatType, () => {
  hat.value = findHat() || null;
});

function findFish() {
  const fishes = shopData.value?.fish.find(f => f.name === props.fishType);
  return fishes;
}

function findHat() {
  const hat = shopData.value?.hats.find(h => h.name === props.hatType) || null;
  return hat;
}

function moveFish() {

  /*Add z-axis that changes size and makes fishes darker*/ 
  
  const waterBounds = props.bounds;
  if (!waterBounds) return;

  const fishWidth = 100; //theese values will probably need adjustment, weird behaivour close to bounds
  const fishHeight = 100;

  const newX = Math.random() * (waterBounds.width - fishWidth);
  const newY = Math.random() * (waterBounds.height - fishHeight);

  if (newX < fishX.value) {
    isFlipped.value = true;
  } else {
    isFlipped.value = false;
  }

  fishX.value = newX;
  fishY.value = newY;
}

function scheduleMoveFish() {
  const randomDelay = Math.random() * 9000 + 2000; // Random delay between 2s and 5s
  setTimeout(() => {
    moveFish(); // Move the fish
    scheduleMoveFish(); // Schedule the next move
  }, randomDelay);
}
</script>