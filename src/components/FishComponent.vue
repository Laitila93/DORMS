<template>
    <!-- Fish container -->
    <div
      class="absolute transition-all duration-2000 ease-in-out fish-wiggle"
      :style="{ top: `${fishY}px`, left: `${fishX}px` }"
    >
    <!-- Fish image -->
        <img
            v-if="fish"
            :key="fish.name"
            :src="fish.image"
            :alt="fish.name"
            class="w-full h-40 object-contain rounded-md mb-4"
        />
      <!-- Hat image positioned relative to the fish -->
      <img
        v-if="hat"
        :key="hat.name"
        :src="hat.image"
        :alt="hat.name"
        class="w-17 absolute"
        :style="{
          top: '-15px',   // adjust as needed
          left: '70px', // adjust to align with fish's head
        }"
      />
    </div>

    <!-- Button to move fish -->
    <button
      class="absolute bottom-5 left-5 bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-300 cursor-pointer"
      @click="moveFish"
    >
      Move Fish
    </button>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';

const props = defineProps<{
  fishType: string;
  hatType: string;
  socket: any; // optional now, unused
}>();

// Define the structure of shop data
type ShopData = {
  fish: { name: string; description: string; price: number; image: string }[];
  hats: { name: string; description: string; price: number; image: string }[];
  specials?: any[];
};

const shopData = ref<ShopData | null>(null);
const fishX = ref(100);
const fishY = ref(100);
const fish = ref<{ name: string; description: string; price: number; image: string } | undefined>(undefined);
const hat = ref<{ name: string; description: string; price: number; image: string } | null>(null);

// Load from sessionStorage
onMounted(() => {
  const cached = sessionStorage.getItem('shopData');
  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      shopData.value = {
        fish: parsed.fish,
        hats: parsed.hats,
      };
      findFish();
      findHat();
    } catch (err) {
      console.error("❌ Failed to parse sessionStorage shopData:", err);
    }
  } else {
    console.warn("⚠️ No shop data found in sessionStorage.");
  }
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
  fishX.value = Math.random() * 800;
  fishY.value = Math.random() * 600;
}
</script>

<style scoped>

</style>