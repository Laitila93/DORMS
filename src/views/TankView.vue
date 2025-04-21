<template>
    <NavComponent :socket="socket" :menu="menuType" />
    Number of fish: {{ numberOfFish }}
    <div class="tank">
      <div class="water" :style="{ height: waterLevel + '%' }"></div>
    </div>
  </template>
  
  <script setup lang="ts">
  import NavComponent from '@/components/NavComponent.vue';
  import { onMounted, ref } from 'vue';
  import TankComponent from '@/components/TankComponent.vue';
  import { socket } from '@/composables/socket';
  
  const menuType = ref('tank');
  socket.on('connect', () => {
    console.log('Connected to the server');
  });
  
  const waterLevel = ref(50); // Initial vattennivå
  const numberOfFish = ref(0);
  
  const updateWaterLevel = () => {
    waterLevel.value = 50 + Math.floor(Math.random() * 50); // Simulera vattennivå mellan 50 och 100
    numberOfFish.value = parseInt((waterLevel.value / 10).toString()); // Beräkna antal fiskar baserat på vattennivå
  };
  onMounted(() => {
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