<template>
  <NavComponent :key="navKey" :socket="socket" :menu="menuType" />
  
  <div class="h-screen w-full p-[2%] pr-[3%]">
    <div class="grid gap-4 grid-cols-[75%_20%] grid-rows-[85%_15%] h-full">
      
      <!-- Background Image Section -->
      <div class="row-start-1 col-start-1 relative w-full h-full border-2 bg-cover bg-center bg-background dark:bg-background-dark" ref="waterRef" style="background-image: url('https://i.imgur.com/9T34bA9.png')">
        
        <!-- Progress Bar -->
        <div class="absolute top-4 left-1/2 -translate-x-1/2 z-0 w-full flex justify-center pointer-events-none">
          <div style="width: 60%; pointer-events: auto;">
            <ProgressBarComponent />
          </div>
        </div>

        <!-- Fish Component -->
        <FishComponent
          v-for="(fish, index) in equippedFishWithHats"
          :key="fish.fishId"
          :fishType="fish.fishType"
          :hatType="fish.hatType"
          :socket="socket"
          :waterBounds="waterBounds"
          :position="index + 1"
          :rockBounds="rockBounds"
          :isBlurred="areFishesBlurred"
        />

        <!-- Rock Image -->
        <div 
          ref="rockRef" 
          class="absolute w-1/3 h-full flex items-end left-3/4 -translate-x-1/2"
          style="z-index:20"
        >
          <img src="../assets/rockFormationFinalCut.png" />
        </div>

        <!-- Blur Button -->
        <button 
          class="absolute bottom-0 left-0 flex items-center justify-center p-2 bg-red-600 hover:bg-red-700 text-white w-20 h-10 rounded-md" 
          @click="() => {blurFishes();}"
        >
          Blur
        </button>     
      </div>
      
      <!-- Sidebar Section -->
      <div class="row-start-1 col-start-2 grid grid-rows-3 gap-4 h-full"> 
        
        <!-- News and Updates -->
        <div class="bg-secondary dark:bg-secondary-dark text-center rounded-md p-4">
          <button @click="showNewsModal=true" class="text-text-headline hover:text-primary">News and Updates</button>
          <ul class="font-semibold text-l text-text dark:text-text-dark">
            <li> - Fire alarm maintenance between 12:00-16:30</li>
            <li> - Available dormrooms in corridor 5</li>
          </ul>
        </div>

        <!-- Challenges Section -->
        <div class="bg-secondary dark:bg-secondary-dark text-center rounded-md p-4">
          <div class="swiper challenges-swiper">
            <div class="swiper-wrapper">
              <div class="swiper-slide flex flex-col items-center justify-center">
                <router-link to="/challenges" class="text-text-headline hover:text-primary">Daily challenges</router-link>
                <p class="font-semibold text-2xl text-text dark:text-text-dark">Use less than 20L hot water</p>
              </div>
              <div class="swiper-slide">
                <router-link to="/challenges" class="text-text-headline hover:text-primary">Weekly challenges</router-link>
                <p class="font-semibold text-2xl text-text dark:text-text-dark">Use less water than corridor 4</p>
              </div>
              <div class="swiper-slide">
                <router-link to="/challenges" class="text-text-headline hover:text-primary">Weekly challenges</router-link>
              </div>
            </div>
            <div class="swiper-pagination"></div>
            <div class="">
              <div class="swiper-button-prev"></div>
              <div class="swiper-button-next"></div>
            </div>
          </div>
        </div>

        <!-- Stats Section -->
        <div class="bg-secondary dark:bg-secondary-dark text-center rounded-md p-4">
          <div class="swiper stats-swiper">
            <div class="swiper-wrapper">
              <div class="swiper-slide flex flex-col items-center justify-center">
                <router-link to="/stats" class="text-text-headline hover:text-primary">Average shower time</router-link>
                <p class="font-semibold text-5xl text-text dark:text-text-dark">8m 12s</p>
              </div>
              <div class="swiper-slide">
                <router-link to="/stats" class="text-text-headline hover:text-primary">Yesterday's water consumption</router-link>
                <p class="font-semibold text-5xl text-text dark:text-text-dark">1230 litres</p>
              </div>
              <div class="swiper-slide">
                <router-link to="/stats" class="text-text-headline hover:text-primary">Average water temperature</router-link>
                <p class="font-semibold text-5xl text-text dark:text-text-dark">25,7°C</p>
              </div>
            </div>
            <div class="swiper-pagination"></div>
            <div class="">
              <div class="swiper-button-prev"></div>
              <div class="swiper-button-next"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- About Section -->
      <div class="col-span-2 row-start-2 bg-secondary dark:bg-secondary-dark rounded-md p-4 h-full">
        <p class="ml-2 text-text-headline">About</p>
        <p class="ml-2 text-s text-text dark:text-text-dark">
          Welcome to the aquarium! Here you can see all of your fishes, decorations, and accessories. Click on a fish to start.
          Click on the side grids to see more detailed updates, challenges, and stats.
        </p>
      </div>
    </div>
  </div>
  
  <!-- Modal Component for News -->
  <ModalComponent v-model="showNewsModal">
    NEWS AND UPDATES
  </ModalComponent>
</template>


<script setup lang="ts">
import NavComponent from '@/components/NavComponent.vue';
import { computed, onMounted, ref, watch } from 'vue';
import FishComponent from '@/components/FishComponent.vue';
import { getSocket } from '@/composables/socket';
const socket = getSocket(); // Import the socket instance from socket.ts
import { useShopData} from '@/composables/useShopData';
import RockComponent from '@/components/RockComponent.vue';
import ProgressBarComponent from '@/components/ProgressBarComponent.vue';
import Swiper from 'swiper/bundle';
import 'swiper/css/bundle';
import '@/assets/custom-swiper.css'
import ModalComponent from '@/components/ModalComponent.vue';

const menuType = ref('tank');
socket.on('connect', () => {
  console.log('Connected to the server');
});

const showNewsModal = ref(false);
const waterLevel = ref(65); // Initial water level
const { shopData, shopUnlocks, equippedData } = useShopData(socket);

const waterRef = ref<HTMLElement | null>(null);
const waterBounds = ref<DOMRect | null>(null);

const rockRef = ref<HTMLElement | null>(null); // Reference to to the root div of the rock
const rockBounds = ref<DOMRect | null>(null); // Bounds of the rock

const areFishesBlurred = ref(false) //Fishes are not blurred by default

const equippedFishWithHats = computed(() => { //problem is likely here, logs return inconsistent w. database, but somewhat consistent w screen
  console.log("equippedFish: ", equippedData.value?.fish);
  console.log("equippedHats: ", equippedData.value?.hats);
  if (!equippedData.value?.fish || !shopData.value?.fish || !shopData.value?.hats) {
    console.log("equippedFishWithHats did not recieve data");
    return []; // Still loading
  }

  return equippedData.value.fish.map((equippedFish, index) => { 
    const fishData = shopData.value?.fish.find(f => f.fishID === equippedFish);
    const hatEquip = equippedData.value?.hats[index]; //use index to get the correct hat for the fish instead oh hatID
    const hatData = hatEquip ? shopData.value?.hats.find(h => h.hatID === hatEquip) : null;
    console.log("try hat: ", hatData?.name);                                            
    console.log("try fish: ", fishData?.name);                                            
    return {
      fishId: equippedFish,
      fishType: fishData?.name || 'unknown',
      hatType: hatData?.name || '',
      position: index + 1,
    };
  });
});


function blurFishes() {
  areFishesBlurred.value = !areFishesBlurred.value;

}
type MenuItem = {
  name: string;
  link: string;
};
const navKey = ref(0); // Reactive key for NavComponent

const refreshNav = () => {
  
  navKey.value++; // Increment the key to force re-render
};
//Göra dessa reaktiva?
onMounted(() => {
  socket.emit("getMenuData", "en"); // Fetch menu items from server, switch between "sv" and "en" for desired language
  socket.on("menuData", (labels: Record<string, MenuItem[]>) => {
    localStorage.setItem("menuData", JSON.stringify(labels));
    refreshNav(); // Refresh NavComponent when new menu data is received
  });

  // Handle errors
  socket.on("error", (error: { message: string }) => {
    console.error("Error from server:", error.message);
  });
  if (waterRef.value) {
    waterBounds.value = waterRef.value.getBoundingClientRect();
  }
  if (waterRef.value) { //sets bounds for fish movement 
    waterBounds.value = waterRef.value.getBoundingClientRect();
  }
  
  if (rockRef.value) { //fish cannot move through rock
    rockBounds.value = rockRef.value.getBoundingClientRect();
  }

  new Swiper('.challenges-swiper', {
    loop: true,
    autoplay: {
      delay: 15000,
      disableOnInteraction: false,
    },

  // Navigation arrows
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },

  // If we need pagination
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
  }) 

  new Swiper('.stats-swiper', {
    loop: true,
    autoplay: {
      delay: 15000,
      disableOnInteraction: false,
    },

  // Navigation arrows
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },

  // If we need pagination
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
  }) 
});

</script>
