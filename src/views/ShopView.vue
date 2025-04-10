<template>
      <NavComponent :menu="navMenuType" />
      <div class="grid grid-cols-[168px_1fr] h-screen">
  <!-- Sidebar -->
  <div class="p-4">
    <VerticalmenuCompnent :menu="menuType" @menu-select="handleMenuSelect" />
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
  </div>
</div>

 
</template>

<script setup lang="ts">
import VerticalmenuCompnent from '@/components/VerticalMenuComponent.vue';
import NavComponent from '@/components/NavComponent.vue';
import { ref } from 'vue';
import shopData from '@/assets/shopData.json';

  const getImageUrl = (imageName: string) => {
    const images = import.meta.glob('@/assets/images/*');
    return new URL(`../assets/images/${imageName}`, import.meta.url).href;
  };

const menuType = ref('shop');
const navMenuType = ref('main'); // This can be changed to any other menu type as needed

// Reactive variable to track selected content
const selectedContent = ref('');

// Function to handle menu selection
function handleMenuSelect(option: string) {
  selectedContent.value = option;
}
// Function to generate random values for rotation and skew
function getRandomWiggleClass() {
  const rotateValue = (Math.random() * 4 - 2).toFixed(2); // Random rotate between -2deg and +2deg
  const skewValue = (Math.random() * 6 - 3).toFixed(2); // Random skew between -3deg and +3deg
  const duration = (Math.random() * 1.5 + 1).toFixed(2); // Random duration between 1 and 2.5 seconds
  
  return `fish-wiggle-${rotateValue}-${skewValue}-${duration}`;
}
</script>

<style scoped>
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