<template>
  <NavComponent :socket="socket" :menu="navMenuType" />
  <div class="grid grid-cols-[168px_1fr] h-screen">
    <!-- Sidebar -->
    <div class="p-4">
      <VerticalmenuCompnent :menu="menuType" :socket="socket" @menu-select="handleMenuSelect" />
    </div>
    <!-- Main Content Area -->
    <div class="p-4 overflow-y-auto">
      <div v-if="selectedContent === 'Hats'">
        <p class="text-lg">Here you can browse hats.</p>
        <div class="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-6">
          <div
            v-for="hat in shopData.hats"
            :key="hat.name"
            class="bg-gray-400 shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow duration-300"
          >
            <img
              :src="getImageUrl(hat.image)"
              :alt="hat.name"
              class="w-full h-40 object-contain rounded-md mb-4"
            />
            <h3 class="text-xl text-gray-800 font-semibold mb-2">{{ hat.name }}</h3>
            <p class="text-gray-600">Description: {{ hat.description }}</p>
            <p class="text-gray-800 font-bold mt-2">Price: ${{ hat.price }}</p>
          </div>
        </div>
      </div>

      <div v-else-if="selectedContent === 'Fish'">
        <p class="text-lg mb-4">Here is all the fish:</p>
        <div class="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-6">
          <div
            v-for="fish in shopData.fish"
            :key="fish.name"
            class="bg-gray-400 shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow duration-300"
          >
            <img
              :src="getImageUrl(fish.image)"
              :alt="fish.name"
              class="w-full h-40 object-contain rounded-md mb-4 fish-wiggle"
            />
            <h3 class="text-xl text-gray-800 font-semibold mb-2">{{ fish.name }}</h3>
            <p class="text-gray-600">Description: {{ fish.description }}</p>
            <p class="text-gray-800 font-bold mt-2">Price: ${{ fish.price }}</p>
          </div>
        </div>
      </div>

      <div v-else-if="selectedContent === 'Special'">
        <p class="text-lg">special items i guess?.</p>
        <div class="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-6">
          <div
            v-for="special in shopData.specials"
            :key="special.name"
            class="bg-gray-400 shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow duration-300"
          >
            <img
              :src="getImageUrl(special.image)"
              :alt="special.name"
              class="w-full h-40 object-contain rounded-md mb-4"
            />
            <h3 class="text-xl text-gray-800 font-semibold mb-2">{{ special.name }}</h3>
            <p class="text-gray-600">Description: {{ special.description }}</p>
            <p class="text-gray-800 font-bold mt-2">Price: ${{ special.price }}</p>
          </div>
        </div>
      </div>

      <div v-else>
        <p class="text-lg">Please select an option from the menu.</p>
      </div>
      <FishComponent :fishType="selectedFish" :hatType="selectedHat" :socket="socket" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import VerticalmenuCompnent from '@/components/VerticalMenuComponent.vue';
  import NavComponent from '@/components/NavComponent.vue';
  import FishComponent from '@/components/FishComponent.vue';
  import { ref, onMounted } from 'vue';
  import { io } from 'socket.io-client';

  const serverIP = sessionStorage.getItem("serverIP") || "http://localhost:3000";
  const socket = io(serverIP);

  onMounted(() => {
    socket.emit("getShopData", "en"); // Replace "en" with the desired language
    socket.on("shopData", (data) => {
      shopData.value = data;
      console.log("Received shop data:", data);
    });
    // Handle errors
    socket.on("error", (error) => {
      console.error("Error from server:", error.message);
    });
    socket.on('connect', () => {
    console.log('Connected to the server');
    });
  });

  const getImageUrl = (imageName: string) => {
    return new URL(`../assets/images/${imageName}`, import.meta.url).href;
  };

  interface ShopItem {
    name: string;
    description: string;
    price: number;
    image: string;
  }

  const shopData = ref<{
    hats: ShopItem[];
    fish: ShopItem[];
    specials: ShopItem[];
  }>({
    hats: [],
    fish: [],
    specials: []
  });
  const menuType = ref('shop');
  const navMenuType = ref('main'); // This can be changed to any other menu type as needed
  const selectedFish = ref('Mört'); // Initialize selected fish type
  const selectedHat = ref('Moose hat'); // Initialize selected hat type

  // Reactive variable to track selected content
  const selectedContent = ref('');
  // Function to handle menu selection
  function handleMenuSelect(option: string) {
    selectedContent.value = option;
  }
</script>

<style scoped>
</style>