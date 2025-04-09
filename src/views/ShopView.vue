<template>

    <VerticalmenuCompnent :menu="menuType" @menu-select="handleMenuSelect" />
    <NavComponent :menu="navMenuType" />
    <div class="container mx-auto mt-16 p-4 flex items-center justify-center min-h-screen">
     
      <!-- Conditional Content -->
      <div v-if="selectedContent === 'Hats'">
        <p class="text-lg">Here you can browse hats.</p>
      </div>
      <div v-else-if="selectedContent === 'Fish'">
  <p class="text-lg mb-4">Here is all the fish:</p>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    <div
      v-for="fish in fishData"
      :key="fish.name"
      class="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow duration-300"
    >
      <!-- Fish Image -->
      <!-- use `getImageUrl` method to dynamically generate the image path -->
      <img
        :src="getImageUrl(fish.image)"
        :alt="fish.name"
        class="w-full h-40 object-cover rounded-md mb-4"
        />

      <!-- Fish Details -->
      <h3 class="text-xl text-gray-800 font-semibold mb-2">{{ fish.name }}</h3>
      <p class="text-gray-600">Description: {{ fish.description }}</p>
      <p class="text-gray-800 font-bold mt-2">Price: ${{ fish.price }}</p>
    </div>
  </div>
</div>
      <div v-else-if="selectedContent === 'Special'">
        <p class="text-lg">special items i guess?.</p>
      </div>
      <div v-else>
        <p class="text-lg">Please select an option from the menu.</p>
      </div>
    </div> 
</template>

<script setup lang="ts">
import VerticalmenuCompnent from '@/components/VerticalMenuComponent.vue';
import NavComponent from '@/components/NavComponent.vue';
import { ref } from 'vue';
import fishData from '@/assets/fish.json';

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
</script>

<style scoped>
</style>