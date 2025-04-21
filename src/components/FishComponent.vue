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

const props = defineProps<{
  fishType: string;
  hatType: string;
  socket: any; // optional now, unused
  bounds: DOMRect | null;
}>();

// Define the structure of shop data
type ShopData = {
  fish: { name: string; description: string; price: number; image: string }[];
  hats: { name: string; description: string; price: number; image: string }[];
  specials: { name: string; description: string; price: number; image: string }[];
};
type ItemData = {
  name: string;
  description: string;
  price: number;
  image: string;
};

const shopData = ref<ShopData | null>(null);
const fishX = ref(100);
const fishY = ref(100);
const isFlipped = ref(false); // Tracks whether the fish is flipped
const fish = ref<ItemData | undefined>(undefined);
const hat = ref<ItemData | null>(null);

// Load from sessionStorage
onMounted(() => {
  const cached = sessionStorage.getItem('shopData');
  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      shopData.value = {
        fish: parsed.fish,
        hats: parsed.hats,
        specials: parsed.specials
      };
      findFish();
      findHat();
    } catch (err) {
      console.error("❌ Failed to parse sessionStorage shopData:", err);
    }
  } else {
    console.warn("⚠️ No shop data found in sessionStorage.");
  }

  scheduleMoveFish(); // Start the random movement
});

// Watch for changes in props
watch(() => props.fishType, findFish);
watch(() => props.hatType, findHat);

function findFish() {
  fish.value = shopData.value?.fish.find(f => f.name === props.fishType);
}

function findHat() {
  hat.value = shopData.value?.hats.find(h => h.name === props.hatType) || null;
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

<style scoped>

</style>