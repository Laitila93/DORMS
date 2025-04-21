<template>
  <NavComponent :socket="socket" :menu="navMenuType" />
  <div class="grid grid-cols-[168px_1fr] h-screen">
    <!-- Sidebar -->
    <div class="p-4">
      <VerticalmenuCompnent :menu="menuType" :socket="socket" @menu-select="handleMenuSelect" />
    </div>
    <!-- Main Content Area -->
    <div ref="waterRef" class="p-4 overflow-y-auto">
      <div v-if="selectedContent === 'Hats'">
        <p class="text-lg">Here you can browse hats.</p>
        <div class="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-6">
          <div
            v-for="hat in shopData.hats"
            :key="hat.name"
            
            class="bg-gray-400 shadow-md rounded-lg p-4"
          >
            <img
              :src="hat.image"
              :alt="hat.name"
              class="w-full h-40 object-contain rounded-md mb-4"
            />
            <h3 class="text-xl text-gray-800 font-semibold mb-2">{{ hat.name }}</h3>
            <p class="text-gray-600">Description: {{ hat.description }}</p>
            <p class="text-gray-800 font-bold mt-2">Price: ${{ hat.price }}</p>
            <button 
              v-if="shopUnlocks.hats.includes(hat.hatID)" 
              @click="handleHatSelect(hat.name)"
              class="mt-2 bg-blue-500 text-white py-2 px-4 rounded  hover:bg-gray-600 transition-shadow duration-300 cursor-pointer">
              Equipp
            </button>
            <button v-else class="mt-2 bg-green-500 text-white py-2 px-4 rounded">Buy</button>
          </div>
        </div>
      </div>

      <div v-else-if="selectedContent === 'Fish'">
        <p class="text-lg mb-4">Here is all the fish:</p>
        <div class="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-6">
          <div
            v-for="fish in shopData.fish"
            :key="fish.name"
            class="bg-gray-400 shadow-md rounded-lg p-4"
          >
            <img
              :src="fish.image"
              :alt="fish.name"
              class="w-full h-40 object-contain rounded-md mb-4 fish-wiggle"
            />
            <h3 class="text-xl text-gray-800 font-semibold mb-2">{{ fish.name }}</h3>
            <p class="text-gray-600">Description: {{ fish.description }}</p>
            <p class="text-gray-800 font-bold mt-2">Price: ${{ fish.price }}</p>
            <button v-if="shopUnlocks.fish.includes(fish.fishID)" 
              @click="handleFishSelect(fish.name)" 
              class="mt-2 bg-blue-500 text-white py-2 px-4 rounded  hover:bg-gray-600 transition-shadow duration-300 cursor-pointer">
              Equipp
            </button>
            <button v-else class="mt-2 bg-green-500 text-white py-2 px-4 rounded">
              Buy
            </button>
          </div>
        </div>
      </div>

      <div v-else-if="selectedContent === 'Special'">
        <p class="text-lg">special items i guess?.</p>
        <div class="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-6">
          <div
            v-for="special in shopData.specials"
            :key="special.name"
            class="bg-gray-400 shadow-md rounded-lg p-4 hover:bg-gray-600 transition-shadow duration-300 cursor-pointer"
          >
            <img
              :src="special.image"
              :alt="special.name"
              class="w-full h-40 object-contain rounded-md mb-4"
            />
            <h3 class="text-xl text-gray-800 font-semibold mb-2">{{ special.name }}</h3>
            <p class="text-gray-600">Description: {{ special.description }}</p>
            <p class="text-gray-800 font-bold mt-2">Price: ${{ special.price }}</p>
            <button v-if="shopUnlocks.specials.includes(special.specialID)" class="mt-2 bg-blue-500 text-white py-2 px-4 rounded">Equipp</button>
            <button v-else class="mt-2 bg-green-500 text-white py-2 px-4 rounded">Buy</button>
          </div>
        </div>
      </div>

      <div v-else>
        <p class="text-lg">Please select an option from the menu.</p>
      </div>
      <FishComponent :key="steve":fishType="selectedFish" :hatType="selectedHat" :socket="socket" :bounds="waterBounds" />
      <FishComponent :key="steve":fishType="'Le poisson steve'" :hatType="''" :socket="socket" :bounds="waterBounds"/>
      <FishComponent :key="steve":fishType="selectedFish" :hatType="'Pirate Hat'" :socket="socket" :bounds="waterBounds"/>
      <FishComponent :key="steve":fishType="'Le poisson steve'" :hatType="''" :socket="socket" :bounds="waterBounds"/>
      <FishComponent :key="steve":fishType="'Le poisson steve'" :hatType="''" :socket="socket" :bounds="waterBounds"/>
    </div>
  </div>
</template>

<script setup lang="ts">
  import VerticalmenuCompnent from '@/components/VerticalMenuComponent.vue';
  import NavComponent from '@/components/NavComponent.vue';
  import FishComponent from '@/components/FishComponent.vue';
  import { ref, onMounted } from 'vue';
  import { socket } from '@/composables/socket';

  const waterRef = ref<HTMLElement | null>(null);
  const waterBounds = ref<DOMRect | null>(null);

  //const isAuthenticated = !!sessionStorage.getItem('authToken');
  const cachedData = sessionStorage.getItem('shopData');
  const cachedUnlocks = sessionStorage.getItem('shopUnlocks');
  const corridorId = 1; // Default value if not set
  const shopUnlocks = ref<{
    hats: number[];
    fish: number[];
    specials: number[];
  }>({
    hats: [],
    fish: [],
    specials: []
  });
  onMounted(() => {
    if (cachedData) {
      shopData.value = JSON.parse(cachedData);
      refreshSteve();
    } else {
      socket.emit("getShopData", "en");
    }
        
    if (cachedUnlocks) {
      shopUnlocks.value = JSON.parse(cachedUnlocks);
      console.log("Cached unlocks:", shopUnlocks.value);
    } else {
      socket.emit("getUnlocks", corridorId);
      console.log("Requesting shop unlocks for corridor ID:", corridorId);
    }

    socket.on("shopData", (data) => {
      // Transform server keys to match component expectations
      const normalizedData = {
        fish: data.fishes,     // ✅ rename
        hats: data.hats,
        specials: data.specials
      };
      console.log("Received shop data:", normalizedData);
      shopData.value = normalizedData;

      sessionStorage.setItem('shopData', JSON.stringify(normalizedData));
      refreshSteve(); // Refresh FishComponent when new data is received
    });

    socket.on("shopUnlocks", (data) => {
      const normalizedUnlocks = {
        fish: data.fishes.map((f: any) => f.fishID),
        hats: data.hats.map((h: any) => h.hatID),
        specials: data.specials.map((s: any) => s.specialID)
      };

      console.log("Received shop Unlocks:", normalizedUnlocks);
      shopUnlocks.value = normalizedUnlocks;
      sessionStorage.setItem('shopUnlocks', JSON.stringify(normalizedUnlocks));
    });

    // Handle errors
    socket.on("error", (error) => {
      console.error("Error from server:", error.message);
    });
      socket.on('connect', () => {
      console.log('Connected to the server');
    });
    if (waterRef.value) { //sets bounds for movement 
      waterBounds.value = waterRef.value.getBoundingClientRect();
    }
  });

  interface BaseShopItem {
  name: string;
  description: string;
  price: number;
  image: string;
}

interface HatItem extends BaseShopItem {
  hatID: number;
}

interface FishItem extends BaseShopItem {
  fishID: number;
}

interface SpecialItem extends BaseShopItem {
  specialID: number;
}

const shopData = ref<{
  hats: HatItem[];
  fish: FishItem[];
  specials: SpecialItem[];
}>({
  hats: [],
  fish: [],
  specials: []
});

  const menuType = ref('shop');
  const navMenuType = ref('main'); // This can be changed to any other menu type as needed
  const selectedFish = ref(''); // Initialize selected fish type
  const selectedHat = ref(''); // Initialize selected hat type
  const steve = ref(0); // Reactive key for NavComponent

  const refreshSteve = () => {
    steve.value++; // Increment the key to force re-render
  };

  // Reactive variable to track selected content
  const selectedContent = ref('');
  // Function to handle menu selection
  function handleMenuSelect(option: string) {
    selectedContent.value = option;
  }
  function handleFishSelect(fishType: string) {
    selectedFish.value = fishType;
  }
  function handleHatSelect(hatType: string) {
    selectedHat.value = hatType;
  }
</script>

<style scoped>
</style>