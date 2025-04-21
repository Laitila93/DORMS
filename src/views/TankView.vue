<template>
    <NavComponent :socket="socket" :menu="menuType" />
    Number of fish: {{ numberOfFish }}
    <div class="tank">
      <div ref="waterRef" class="water" :style="{ height: waterLevel + '%' }">
        <FishComponent
          v-for="(fish, index) in shopData.fish.slice(0, numberOfFish)"
          :key="fish.name"
          :fishType="fish.name"
          :hatType="''"
          :socket="socket"
          :bounds="waterBounds"
        />
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import NavComponent from '@/components/NavComponent.vue';
  import { onMounted, ref } from 'vue';
  import TankComponent from '@/components/TankComponent.vue';
  import FishComponent from '@/components/FishComponent.vue';
  import { socket } from '@/composables/socket';
  
  const menuType = ref('tank');
  socket.on('connect', () => {
    console.log('Connected to the server');
  });
  
  const waterLevel = ref(50); // Initial vattennivå
  const numberOfFish = ref(0);
  const shopData = ref<{ fish: any[] }>({ fish: [] });
  const waterRef = ref<HTMLElement | null>(null);
  const waterBounds = ref<DOMRect | null>(null);

  const updateWaterLevel = () => {
    waterLevel.value = 50 + Math.floor(Math.random() * 50); // Simulera vattennivå mellan 50 och 100
    numberOfFish.value = parseInt((waterLevel.value / 10).toString()); // Beräkna antal fiskar baserat på vattennivå
  };
  onMounted(() => {
    const cachedData = sessionStorage.getItem('shopData');
    if (cachedData) {
      shopData.value = JSON.parse(cachedData);
    } else {
      socket.emit("getShopData", "en");
    }

    socket.on("shopData", (data) => {
      const normalizedData = {
        fish: data.fishes,
        hats: data.hats,
        specials: data.specials
      };
      sessionStorage.setItem('shopData', JSON.stringify(normalizedData));
      shopData.value = normalizedData;
    });
    if (waterRef.value) {
      waterBounds.value = waterRef.value.getBoundingClientRect();
    }
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
  .water {
    width: 100%;
    background-color: blue;
    position: absolute;
    bottom: 0;
  }
  </style>