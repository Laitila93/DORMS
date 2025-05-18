<template>
  <NavComponent :socket="socket" :menu="menuType" />

  <div class="h-screen w-full p-[2%] pr-[3%]">
    <div class="grid gap-4 grid-cols-[75%_20%] grid-rows-[15%_85%] h-full">
      
      <!-- About / Header Section -->
      <div class="col-span-2 row-start-1 bg-secondary dark:bg-secondary-dark rounded-md p-4 h-full flex justify-between items-center">
        <div>
          <p class="text-xl text-text-headline">Unlockables & Challenges</p>
          <p class="text-s text-text dark:text-text-dark">
            Track your achievements and complete fun challenges to save water and earn rewards.
          </p>
        </div>
        <div class="hover:opacity-50">
          <button @click="showAboutModal = true">
            <img src="https://cdn-icons-png.flaticon.com/512/1/1176.png" alt="Info" width="50" height="50" />
          </button>
        </div>
      </div>

      <!-- Unlockables Section -->
      <div class="row-start-2 col-start-1 bg-secondary dark:bg-secondary-dark rounded-md p-4 overflow-y-auto">
        <p class="text-xl text-text-headline mb-2">Your Unlockables</p>
        <div class="text-lg font-semibold flex flex-col gap-2 h-fill overflow-y-scroll overflow-x-hidden">
          <div
            v-for="(unlock, index) in unlockables"
            :key="index"
            class="flex justify-between items-center bg-offWhite rounded-md font-inter shadow-md p-2"
          >
            <img :src="unlock.icon" alt="miniavatar" class="w-28 h-28 rounded-lg" />
            <div class="flex flex-col justify-center ml-4">
              <p class="text-text text-base">{{ unlock.name }}</p>
              <p class="text-text-dark text-sm">{{ unlock.description }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Challenges Section -->
      <div class="row-start-2 col-start-2 bg-secondary dark:bg-secondary-dark rounded-md p-4">
        <p class="text-xl text-text-headline mb-2 text-center">Daily Challenges</p>
        <div class="swiper challenges-swiper">
          <div class="swiper-wrapper">
            <div class="swiper-slide flex flex-col items-center justify-center" v-for="(challenge, i) in challenges" :key="i">
              <h3 class="text-xl text-text-headline">{{ challenge.title }}</h3>
              <p class="font-semibold text-text dark:text-text-dark text-center">{{ challenge.description }}</p>
            </div>
          </div>
          <div class="swiper-pagination mt-2"></div>
          <div class="flex justify-between mt-2">
            <div class="swiper-button-prev"></div>
            <div class="swiper-button-next"></div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- About Modal -->
  <ModalComponent v-model="showAboutModal">
    <template #header>About</template>
    <template #body>
      <p>This section tracks your unlockables and water-saving challenges. Come back every day to check your progress!</p>
    </template>
  </ModalComponent>
</template>

<script setup>
import { ref } from 'vue';
import { getSocket } from '@/composables/socket';
import NavComponent from '@/components/NavComponent.vue';
import ModalComponent from '@/components/ModalComponent.vue';
const socket = getSocket(); // Import the socket instance from socket.ts
const menuType = ref("tank");

// Reactive State
const showAboutModal = ref(false);

const unlockables = ref([
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
  }
]);

const challenges = ref([
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
