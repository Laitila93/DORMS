<template>
  <NavComponent :socket="socket" :menu="menuType" />
  <div
    class="grid"
    :class="[
      'grid-cols-[75%_20%]', // Percentage-based column widths
      'grid-rows-[28%_28%_28%_10%]' // Percentage-based row heights
    ]"
    style="min-width: 1200px; min-height: 720px; margin: 1.5%; gap: 1%"
  >
  <div class="col-start-1 row-span-3 relative w-full h-full border-2 bg-cover bg-center"
         style="background-image: url('https://i.imgur.com/9T34bA9.png')">
    <div class="w-full absolute bottom-0 z-0" :style="{ height: waterLevel + '%' }">
      <FishComponent
        v-for="(fish, index) in equippedFishWithHats.slice(0, numberOfFish)"
        :key="fish.fishId"
        :fishType="fish.fishType"
        :hatType="fish.hatType"
        :socket="socket"
        :bounds="waterBounds"
        :position="index + 1"
      />

      <RockComponent ref="rockRef" style="z-index: 50;"></RockComponent>
    </div>
  
  </div>
  <div class="col-start-2 row-start-1 bg-secondary dark:bg-secondary-dark text-center  rounded-md">
    <p class="text-text-headline">News and Updates</p>
      <ul class="font-semibold text-l">
        <li> - Fire alarm maintenance between 12:00-16:30</li>
        <li> - Available dormrooms in corridor 5</li>
      </ul>
  </div>
  <div class="col-start-2 row-start-2 bg-secondary dark:bg-secondary-dark text-center  rounded-md">
    <!-- Slider main container -->
    <div class="swiper challenges-swiper">
      <!-- Additional required wrapper -->
      <div class="swiper-wrapper">
        <!-- Slides -->
        <div class="swiper-slide flex flex-col items-center justify-center">
          <p class="text-text-headline">Daily challenges</p>
          <p class="font-semibold text-2xl ">Use less than 20L hot water</p>
        </div>
        <div class="swiper-slide">
          <p class="text-text-headline">Weekly challenges</p>
          <p class="font-semibold text-2xl ">Use less water than corridor 4</p>
        </div>
        <div class="swiper-slide text-text-headline">Limited time challenges</div>
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
  <div class="col-start-2 row-start-3bg-secondary dark:bg-secondary-dark text-center  rounded-md">
    <!-- Slider main container -->
    <div class="swiper stats-swiper">
      <!-- Additional required wrapper -->
      <div class="swiper-wrapper">
        <!-- Slides -->
        <div class="swiper-slide flex flex-col items-center justify-center">
          <p class="text-text-headline">Average shower time</p>
          <p class="font-semibold text-5xl ">8m 12s</p>
        </div>
        <div class="swiper-slide">
          <p class="text-text-headline">Yesterdays water consumption</p>
          <p class="font-semibold text-5xl ">1230 litres</p>
        </div>
        <div class="swiper-slide">
          <p class="text-text-headline">Average water temperature</p>
          <p class="font-semibold text-5xl">25,7°C</p>
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
  <div class="col-span-2 row-start-4 bg-secondary dark:bg-secondary-dark  rounded-md">
    <p class="ml-2 text-text-headline">About</p>
    <p class="ml-2 text-s">
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
const { shopData, shopUnlocks, equippedData, corridorId } = useShopData();

const waterRef = ref<HTMLElement | null>(null);
const waterBounds = ref<DOMRect | null>(null);

const rockRef = ref<{ rockElement: HTMLElement } | null>(null); // Reference to to the root div of the rock
const rockBounds = ref<DOMRect | null>(null); // Bounds of the rock

const equippedFishWithHats = computed(() => { //problem is likely here, logs return inconsistent w. database, but somewhat consistent w screen
  if (!equippedData.value?.fish || !shopData.value?.fish || !shopData.value?.hats) {
    return []; // Still loading
  }

  return equippedData.value.fish.map((equippedFish, index) => { 
    const fishData = shopData.value?.fish.find(f => f.fishID === equippedFish);
    const hatEquip = equippedData.value?.hats[index]; //use index to get the correct hat for the fish instead oh hatID
    const hatData = hatEquip ? shopData.value?.hats.find(h => h.hatID === hatEquip) : null;
    console.log("try hat: ", hatData?.name);                                            
    console.log("try hatEquip: ", hatEquip);                                            
    return {
      fishId: equippedFish,
      fishType: fishData?.name || 'unknown',
      hatType: hatData?.name || '',
      position: index + 1,
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