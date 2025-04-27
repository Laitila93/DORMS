<template>
  <NavComponent :socket="socket" :menu="menuType" />
  Number of fish: {{ numberOfFish }}
  <div class="grid gap-2 ml-4" :class="['grid-cols-[1000px_220px]','grid-rows-[180px_180px_180px_75px]']">
  <div class="col-start-1 row-span-3 relative w-full h-full border-[20px] border-black bg-cover bg-center"
         style="background-image: url('https://i.imgur.com/9T34bA9.png')">
    <div class="w-full absolute bottom-0 z-0" :style="{ height: waterLevel + '%' }">
      <FishComponent
        v-for="fish in equippedFishWithHats.slice(0, numberOfFish)"
        :key="fish.fishId"
        :fishType="fish.fishType"
        :hatType="fish.hatType"
        :socket="socket"
        :bounds="waterBounds"
      />

      <RockComponent ref="rockRef"></RockComponent>
    </div>
    <div ref="waterRef" class="w-full bg-blue-400/30 absolute bottom-0 z-10 pointer-events-none" :style="{ height: waterLevel + '%' }">
    </div>
  </div>
  <div class="col-start-2 row-start-1 bg-gray-200 text-center text-red-800 rounded-md">
    <p>News and Updates</p>
      <ul class="font-semibold text-l text-gray-400">
        <li> - Fire alarm maintenance between 12:00-16:30</li>
        <li> - Available dormrooms in corridor 5</li>
      </ul>
  </div>
  <div class="col-start-2 row-start-2 bg-gray-200 text-center text-red-800 rounded-md">
    <!-- Slider main container -->
    <div class="swiper challenges-swiper">
      <!-- Additional required wrapper -->
      <div class="swiper-wrapper">
        <!-- Slides -->
        <div class="swiper-slide flex flex-col items-center justify-center">
          <p>Daily challenges</p>
          <p class="font-semibold text-2xl text-gray-600">Use less than 20L hot water</p>
        </div>
        <div class="swiper-slide">
          <p>Weekly challenges</p>
          <p class="font-semibold text-2xl text-gray-600">Use less water than corridor 4</p>
        </div>
        <div class="swiper-slide">Limited time challenges</div>
      </div>
      <!-- If we need pagination -->
      <div class="swiper-pagination"></div>

      <!-- If we need navigation buttons -->
      <div class="">
        <div class="swiper-button-prev"></div>
        <div class="swiper-button-next"></div>
      </div>
    </div>

  </div>
  <div class="col-start-2 row-start-3 bg-gray-200 text-center text-red-800 rounded-md">
    <!-- Slider main container -->
    <div class="swiper stats-swiper">
      <!-- Additional required wrapper -->
      <div class="swiper-wrapper">
        <!-- Slides -->
        <div class="swiper-slide flex flex-col items-center justify-center">
          <p>Average shower time</p>
          <p class="font-semibold text-5xl text-gray-800">8m 12s</p>
        </div>
        <div class="swiper-slide">
          <p>Yesterdays water consumption</p>
          <p class="font-semibold text-5xl text-gray-800">1230 litres</p>
        </div>
        <div class="swiper-slide">
          <p>Average water temperature</p>
          <p class="font-semibold text-5xl text-gray-800">25,7°C</p>
        </div>
      </div>
      <!-- If we need pagination -->
      <div class="swiper-pagination"></div>

      <!-- If we need navigation buttons -->
      <div class="">
        <div class="swiper-button-prev"></div>
        <div class="swiper-button-next"></div>
      </div>
    </div>
  </div>
  <div class="col-span-2 row-start-4 bg-gray-200 text-red-800 rounded-md">
    <p class="ml-2">About</p>
    <p class="ml-2 text-gray-500 text-s">
      Welcome to the aquarium! Here you can see all of your fishes, decorations, and accessories. Click on a fish to start.
      Click on the side grids to see more detailed updates, challenges, and stats.
    </p>
  </div>
  </div>
  
</template>

<script setup lang="ts">
import NavComponent from '@/components/NavComponent.vue';
import { computed, onMounted, ref, watch } from 'vue';
import FishComponent from '@/components/FishComponent.vue';
import { socket } from '@/composables/socket';
import { useShopData} from '@/composables/useShopData';
import RockComponent from '@/components/RockComponent.vue';
import Swiper from 'swiper/bundle';
import 'swiper/css/bundle';
import '@/assets/custom-swiper.css'

const menuType = ref('tank');
socket.on('connect', () => {
  console.log('Connected to the server');
});

const waterLevel = ref(50); // Initial water level
const numberOfFish = ref(0);
const { shopData, shopUnlocks, equippedData } = useShopData();

const waterRef = ref<HTMLElement | null>(null);
const waterBounds = ref<DOMRect | null>(null);

const rockRef = ref<{ rockElement: HTMLElement } | null>(null); // Reference to to the root div of the rock
const rockBounds = ref<DOMRect | null>(null); // Bounds of the rock

console.log('equippedData.fishes', equippedData.value?.fishes);
console.log('shopData.value.fish', shopData.value?.fish);
console.log('shopData.value.hats', shopData.value?.hats);

const equippedFishWithHats = computed(() => {
  if (!equippedData.value?.fish || !shopData.value?.fish || !shopData.value?.hats) {
    return []; // Still loading
  }

  return equippedData.value.fish.map(equippedFish => {
    const fishData = shopData.value.fish.find(f => f.id === equippedFish.fishId);
    const hatEquip = equippedData.value.hats.find(h => h.fishId === equippedFish.fishId);
    const hatData = hatEquip ? shopData.value.hats.find(h => h.id === hatEquip.hatId) : null;

    return {
      fishId: equippedFish.fishId,
      fishType: fishData?.name || 'unknown',
      hatType: hatData?.name || '',
    };
  });
});





const updateWaterLevel = () => {
  //waterLevel.value = 50 + Math.floor(Math.random() * 50); // Simulera vattennivå mellan 50 och 100
  numberOfFish.value = parseInt((waterLevel.value / 10).toString()); // Beräkna antal fiskar baserat på vattennivå
};
onMounted(() => {
  if (waterRef.value) {
    waterBounds.value = waterRef.value.getBoundingClientRect();
  }
  if (waterRef.value) { //sets bounds for fish movement 
    waterBounds.value = waterRef.value.getBoundingClientRect();
  }
  
  if (rockRef.value?.rockElement) { //fish cannot move through rock
    rockBounds.value = rockRef.value.rockElement.getBoundingClientRect();
  }
  
  setInterval(updateWaterLevel,1000);

  new Swiper('.challenges-swiper', {
    loop: true,

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

<style scoped>
.tank-container {
  position: relative;
}
.tank {
  width: 80vw;
  height: 80vh;
  border-width: 20px;
  border-color: black;
  border-style: solid;
  position: relative;
}

.swiper {
  width: 220px;
  height: 180px;
}

</style>