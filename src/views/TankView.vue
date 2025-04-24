<template>
  <NavComponent :socket="socket" :menu="menuType" />
  Number of fish: {{ numberOfFish }}
  <div class="relative w-[80vw] h-[80vh] border-[20px] border-black bg-cover bg-center"
         style="background-image: url('https://i.imgur.com/9T34bA9.png')">
    <div class="w-full absolute bottom-0 z-0" :style="{ height: waterLevel + '%' }">
      <FishComponent
        v-for="(fish, index) in shopData?.fish.slice(0, numberOfFish)"
        :key="fish.name"
        :fishType="fish.name"
        :hatType="''"
        :socket="socket"
        :bounds="waterBounds"
      />
      <RockComponent ref="rockRef"></RockComponent>
    </div>
    <div ref="waterRef" class="w-full bg-blue-400/30 absolute bottom-0 z-10 pointer-events-none" :style="{ height: waterLevel + '%' }">
    </div>
  </div>
</template>

<script setup lang="ts">
import NavComponent from '@/components/NavComponent.vue';
import { onMounted, ref } from 'vue';
import TankComponent from '@/components/TankComponent.vue';
import FishComponent from '@/components/FishComponent.vue';
import { socket } from '@/composables/socket';
import { useShopData} from '@/composables/useShopData';
import RockComponent from '@/components/RockComponent.vue';

const menuType = ref('tank');
socket.on('connect', () => {
  console.log('Connected to the server');
});

const waterLevel = ref(50); // Initial water level
const numberOfFish = ref(0);
const { shopData, shopUnlocks } = useShopData();

const waterRef = ref<HTMLElement | null>(null);
const waterBounds = ref<DOMRect | null>(null);

const rockRef = ref<HTMLElement | null>(null);
const rockBounds = ref<DOMRect | null>(null);



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
  /* 
  if (rockRef.value) { //fish cannot move through rock
    rockBounds.value = rockRef.value.getBoundingClientRect();
  }
  */
  setInterval(updateWaterLevel,1000);
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

</style>