<template>
    <!-- Fish container -->
    <div
      class="absolute transition-all duration-2000 ease-in-out"
      :style="{ top: `${fishY}px`, left: `${fishX}px` }"
    >
    <!-- Fish image -->
        <img
            v-if="fish"
            :key="fish.name"
            :src="getImageUrl(fish.image)"
            :alt="fish.name"
            class="w-full h-40 object-contain rounded-md mb-4 fish-wiggle"
        />
      <!-- Hat image positioned relative to the fish -->
      <img
        v-if="hat"
        :key="hat.name"
        :src="getImageUrl(hat.image)"
        :alt="hat.name"
        class="w-17 absolute fish-wiggle"
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
  import { ref, onMounted } from 'vue';

  const props = defineProps<{
    fishType: string;
    hatType: string;
    socket: any;
  }>();

  onMounted(() => {
    // Use props.socket instead of socket
    props.socket.emit("getShopData", "en"); // Replace "en" with the desired language
    props.socket.on("shopData", (data: ShopData) => {
    shopData.value = data;
    findFish(); // Call findFish after receiving data
    findHat(); // Call findHat after receiving data
    });
  });

  // Define the structure of shop data
  type ShopData = {
    fish: { name: string; description: string; price: number; image: string }[];
    hats: { name: string; description: string; price: number; image: string }[];
  };

  const shopData = ref<ShopData | null>(null);
  const fishX = ref(100);
  const fishY = ref(100);
  const fish = ref<{ name: string; description: string; price: number; image: string } | undefined>(undefined);
  const hat = ref<{ name: string; description: string; price: number; image: string } | null>(null); // Initialize hat as null

  const getImageUrl = (imageName: string) => {
    return new URL(`../assets/images/${imageName}`, import.meta.url).href;
  };


  function findFish() {
      // Find the fish in the shop data
      fish.value = shopData.value?.fish.find(f => f.name === props.fishType) || undefined; // Handle undefined case
  }
  function findHat() {
      // Find the hat in the shop data
      hat.value = shopData.value?.hats.find(h => h.name === props.hatType) || null; // Assign null if undefined
  }

  function moveFish() {
      // Move to random position
      fishX.value = Math.random() * 800
      fishY.value = Math.random() * 600
  }
</script>

<style scoped>

</style>