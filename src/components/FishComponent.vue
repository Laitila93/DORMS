<template>
  <div
    class="absolute"
    :style="{
      top: `${fishY}px`,
      left: `${fishX}px`,
      transition: 'top 5s, left 5s'
    }"
    @click="() => { toggleHatSelector(); toggleFishSelector(); }"
  >
  <div class="fish-wiggle">
  <img
  v-if="fish"
  :key="fish.name"
  :src="fish.image"
  :alt="fish.name"
  class="w-24 h-24 object-contain "
  :style="{ transform: isFlipped ? 'scaleX(-1)' : 'scaleX(1)' }"
/>

<img
  v-if="hat"
  :key="hat.name"
  :src="hat.image"
  :alt="hat.name"
  class="w-12 absolute"
  :style="{
    top: '-15px',
    left: '50%', // Center the hat horizontally
    transform: 'translateX(-50%)', // Adjust to center relative to the fish
  }"
/>
</div>
<!-- Hat Selector Box -->
<div
  v-if="showHatSelector"
  class="absolute z-50 bg-white border border-black p-4 rounded shadow w-64 flex flex-col items-center"
  style="top: -220px; left: -250px;"
>
  <div class="relative flex items-center justify-center w-full h-32">
    <button @click.stop="prevHat"  class="toggle-button">←</button>

    <img
      v-if="currentHat"
      :src="currentHat.image"
      :alt="currentHat.name"
      class="h-24 object-contain"
    />
    
    <div v-else class="text-gray-500">No hat</div>

    <button @click.stop="nextHat" class="toggle-button">→</button>
  </div>
  <p class="mt-2 text-sm font-semibold" v-if="currentHat">
    {{ currentHat.name }}
  </p>
  <button v-if="isHatAvailable" @click.stop="applyHat" class="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded">
    set hat
  </button>
</div>
<!-- Fish Selector Box -->
<div
  v-if="showFishSelector"
  class="absolute z-50 bg-white border border-black p-4 rounded shadow w-64 flex flex-col items-center"
  style="top: -220px; left: 50px;"
>
  <div class="relative flex items-center justify-center w-full h-32">
    <button @click.stop="prevFish"  class="toggle-button">←</button>

    <img
      v-if="currentFish"
      :src="currentFish.image"
      :alt="currentFish.name"
      class="h-24 object-contain"
    />
    <button @click.stop="nextFish" class="toggle-button">→</button>
  </div>
  <p class="mt-2 text-sm font-semibold" v-if="currentFish">
    {{ currentFish.name }}
  </p>
  <button v-if="isFishAvailable" @click.stop="applyFish" class="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded">
    set fish
  </button>
</div>

</div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
import { useShopData } from '@/composables/useShopData'; // Import the composable for shop data
const props = defineProps<{
  fishType: string;
  hatType: string;
  socket: any; // optional now, unused
  bounds: DOMRect | null;
}>();

const { shopData, shopUnlocks } = useShopData();
const fishX = ref(100);
const fishY = ref(100);
const isFlipped = ref(false); // Tracks whether the fish is flipped
let fish = ref(shopData.value?.fish.find(f => f.name === props.fishType) || null);
let hat = ref(shopData.value?.hats.find(h => h.name === props.hatType) || null);

const showHatSelector = ref(false);
const showFishSelector = ref(false);
const currentHatIndex = ref<number>(-1); // -1 = no hat
const currentFishIndex = ref<number>(0); 

const toggleHatSelector = () => {
  showHatSelector.value = !showHatSelector.value;
};

const toggleFishSelector = () => {
  showFishSelector.value = !showFishSelector.value;
};

const currentHat = computed(() => {
  if (!shopData.value || !shopData.value.hats.length || currentHatIndex.value === -1) return null;
  return shopData.value.hats[currentHatIndex.value];
});
const currentFish = computed(() => {
  if (!shopData.value || !shopData.value.fish.length || currentFishIndex.value === -1) return null;
  return shopData.value.fish[currentFishIndex.value];
});

function prevHat() {
  if (!shopData.value || !shopData.value.hats.length) return;

  if (currentHatIndex.value === -1) {
    currentHatIndex.value = shopData.value.hats.length - 1;
  } else {
    currentHatIndex.value -= 1;
    if (currentHatIndex.value < -1) {
      currentHatIndex.value = shopData.value.hats.length - 1;
    }
  }
}

function prevFish() {
  if (!shopData.value || !shopData.value.fish.length) return;
  currentFishIndex.value =
    (currentFishIndex.value - 1 + shopData.value.fish.length) % shopData.value.fish.length;
}


function nextHat() {
  if (!shopData.value || !shopData.value.hats.length) return;

  currentHatIndex.value = (currentHatIndex.value + 1) % (shopData.value.hats.length + 1);
  if (currentHatIndex.value === shopData.value.hats.length) {
    currentHatIndex.value = -1; // Back to "no hat"
  }
}

function nextFish() {
  if (!shopData.value || !shopData.value.fish.length) return;
  currentFishIndex.value = (currentFishIndex.value + 1) % shopData.value.fish.length;
}

function applyHat() {
  hat.value = currentHat.value || null;;
  showHatSelector.value = false;
}

function applyFish() {
  fish.value = currentFish.value || null;;
  showFishSelector.value = false;
}

const isHatAvailable = computed(() => {
    if (!shopUnlocks.value || !shopUnlocks.value.hats) return false;
    for (const unlockedHat of shopUnlocks.value.hats) {
      if (unlockedHat === currentHatIndex.value + 1 || currentHatIndex.value === -1) {
        return true;
      }
    }
    return false;
})

const isFishAvailable = computed(() => {
  console.log("unlocked fish: ", shopUnlocks.value?.fish || []);
    for (const unlockedFish of (shopUnlocks.value?.fish || [])) {
      if (unlockedFish === currentFishIndex.value + 1 || currentFishIndex.value === -1) {
        return true;
      }
    }
    return false;
})

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
  const waterBounds = props.bounds;
  if (!waterBounds) return;

  const fishWidth = 100;
  const fishHeight = 100;

  const newX = Math.random() * (waterBounds.width - fishWidth);
  const newY = Math.random() * (waterBounds.height - fishHeight);

  // Update the direction before changing position
  if (newX < fishX.value) {
    isFlipped.value = true;
  } else {
    isFlipped.value = false;
  }

  // Update position values - the CSS transition will apply to these changes
  fishX.value = newX;
  fishY.value = newY;
}

function scheduleMoveFish() {
  const randomDelay = Math.random() * 9000 + 2000; // Random delay between 2s and 5s
  setTimeout(() => {
    if (!showHatSelector.value){
      moveFish();// Move the fish if not selected
    }
    scheduleMoveFish(); // Schedule the next move
  }, randomDelay);
}
</script>

<style scoped>
.toggle-button{
  color: white;
  font-size: x-large;
  background-color: blue;
}

@keyframes swim-wiggle {
  0%, 100% {
    transform: rotate(0deg) skewX(0deg) translateY(0px);
  }
  25% {
    transform: rotate(2deg) skewX(3deg) translateY(-3px);
  }
  50% {
    transform: rotate(0deg) skewX(0deg) translateY(0px);
  }
  75% {
    transform: rotate(-2deg) skewX(-3deg) translateY(3px);
  }
}

.fish-wiggle {
  animation: swim-wiggle 3s infinite ease-in-out;
}
</style>