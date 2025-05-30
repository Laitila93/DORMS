<template>
  <div class="h-screen w-full p-[2%] pr-[3%]">
    <div class="grid gap-4 grid-cols-[75%_25%] grid-rows-[8%_92%] h-full">
      
      <!-- About / Header Section -->  
      <div class="col-span-2 row-start-1 bg-secondary dark:bg-secondary-dark rounded-md pt-2 h-full flex relative">
          <!-- Progress Bar -->
        <div class="absolute  left-1/2 -translate-x-1/2 z-0 w-full flex justify-center pointer-events-none overflow-hidden mb-1">
          <div style="width: 85%; pointer-events: auto;">
            <ProgressBarComponent />
          </div>
        </div>
          <button @click="showAboutModal=true" class="absolute hover:opacity-50 pt-1 left-3">
            <img src="https://cdn-icons-png.flaticon.com/512/1/1176.png" alt="Info" width="40" height="40">
          </button>
          <NavComponent :socket="socket" :menu="menuType" class="absolute pt-2 right-4"/>
      </div>

      <!-- Unlockables Section -->
      <div class="row-start-2 col-start-1 bg-secondary dark:bg-secondary-dark rounded-md p-4 overflow-y-auto">
        <p class="text-xl text-text-headline mb-2">Your Unlockables</p>
        <div class="text-lg font-semibold flex flex-col gap-2 h-fill overflow-x-hidden">
          <div
            v-for="item in sortedItems"
            :key="item.id"
            class="flex items-center gap-4 bg-background-light dark:bg-background-dark rounded-md font-inter shadow-md p-2"
              :style="{
                filter: item.price > xpScore ? 'grayscale(100%)' : 'none',
                opacity: item.price > xpScore ? 0.6 : 1
              }"
          >
            <img :src="item.image" class="w-16 h-16 object-contain rounded" />
            <div class="min-w-0">
              <h3 class="text-lg font-bold truncate">{{ item.name }}</h3>
              <p class="text-sm truncate">{{ item.description }}</p>
              <p class="text-sm text-yellow-400">Unlocked at: {{ item.price }} XP</p>

            </div>
          </div>  
        </div>
      </div>

      <!-- Challenges Section -->
      <div class="row-start-2 col-start-2 bg-secondary dark:bg-secondary-dark rounded-md p-4 overflow-y-auto">
        <p class="text-xl text-text-headline mb-2 text-center">Challenges</p>
        <div class="text-lg font-semibold flex flex-col gap-2 h-fill overflow-x-hidden">
          <div
            v-for="(challenge, index) in challenges"
            :key="index"
            class="flex items-center bg-background-light dark:bg-background-dark rounded-md font-inter shadow-md p-2"
          >
            <img :src="challenge.icon" alt="miniavatar" class="w-28 h-28 rounded-lg" />
            <div class="flex flex-col ml-4 text-text dark:text-text-dark">
              <p class="text-base text-headline">{{ challenge.name }}</p>
              <p class="text-sm">{{ challenge.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- About Modal -->
  <ModalComponent v-model="showAboutModal">
{{ aboutChallenges.text }}
  </ModalComponent>
</template>

<script setup>
import { ref, computed } from 'vue';
import { getSocket } from '@/composables/socket';
import NavComponent from '@/components/NavComponent.vue';
import ModalComponent from '@/components/ModalComponent.vue';
import ProgressBarComponent from '@/components/ProgressBarComponent.vue';
import { useShopData } from '@/composables/useShopData';
import { useScoreData } from '@/composables/useScoreData';

import aboutChallenges from '@/assets/about-challenges.json';
const socket = getSocket(); // Import the socket instance from socket.ts
const { shopData } = useShopData(socket);
const menuType = ref("tank");
const { xpScore } = useScoreData(socket);
const showAboutModal = ref(false);

// Flatten and normalize all items with a common shape
const sortedItems = computed(() => {
  const data = shopData.value;

  if (!data) {
    return [];
  }

  const fishItems = (data.fish || []).map(fish => ({
    id: `fish-${fish.fishID}`,
    name: fish.name,
    description: fish.description,
    price: fish.price,
    image: fish.image,
    rarity: fish.rarity,
    type: "Fish"
  }));

  const hatItems = (data.hats || []).map(hat => ({
    id: `hat-${hat.hatID}`,
    name: hat.name,
    description: hat.description,
    price: hat.price,
    image: hat.image,
    type: "Hat"
  }));

  const specialItems = (data.specials || []).map(special => ({
    id: `special-${special.specialID}`,
    name: special.name,
    description: special.description,
    price: special.price,
    image: special.image,
    type: "Special"
  }));

  const allItems = [...fishItems, ...hatItems, ...specialItems];

  return allItems.sort((a, b) => a.price - b.price);
});


const challenges = ref([
  {
    name: "Eco Showerhead",
    description: "Reduces water flow without compromising pressure.",
    icon: "https://cdn-icons-png.flaticon.com/512/883/883407.png"
  },
  {
    name: "Smart Timer",
    description: "Lets you time showers effectively.",
    icon: "https://cdn-icons-png.flaticon.com/512/2910/2910791.png"
  },
  {
    name: "Water Badge",
    description: "Earned for 5 consecutive days of saving water.",
    icon: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
  },
    {
    name: "Smart Timer",
    description: "Lets you time showers effectively.",
    icon: "https://cdn-icons-png.flaticon.com/512/2910/2910791.png"
  },
    {
    name: "Smart Timer",
    description: "Lets you time showers effectively.",
    icon: "https://cdn-icons-png.flaticon.com/512/2910/2910791.png"
  },
    {
    name: "Smart Timer",
    description: "Lets you time showers effectively.",
    icon: "https://cdn-icons-png.flaticon.com/512/2910/2910791.png"
  },
]);

const tips = ref([
  {
    title: "Keep It Short & Sweet",
    description: "Try a shorter shower today, every minute counts!"
  },
  {
    title: "Pause While You Soap",
    description: "Turn off the water while you lather—it’s a small action with a big impact."
  },
  {
    title: "Brush Smart",
    description: "Don’t let the tap run while brushing your teeth—turn it off and save!"
  },
  {
    title: "Shower Together",
    description: "Shower with a friend—it’s fun and saves water!"
  },
  {
    title: "Cool Water, Smarter Way",
    description: "Keep a jug of water in the fridge instead of running the tap for cold water."
  }
]);
</script>

<style scoped>
.bg-offWhite {
  background-color: #f8f8f8;
}
.font-inter {
  font-family: 'Inter', sans-serif;
}
</style>
