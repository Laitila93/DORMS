<template>
    <NavComponent :socket="socket" :menu="menuType" />
    Number of fish: {{ numberOfFish }}
    <div class="tank-container">
      <TankComponent :onWaterLevelChange="updateWaterLevel" />
    </div>
  </template>
  
  <script setup lang="ts">
  import NavComponent from '@/components/NavComponent.vue';
  import { ref } from 'vue';
  import TankComponent from '@/components/TankComponent.vue';
  import { socket } from '@/composables/socket';
  
  const menuType = ref('tank');
  socket.on('connect', () => {
    console.log('Connected to the server');
  });
  
  const waterLevel = ref(50); // Initial vattennivå
  const numberOfFish = ref(0);
  
  const updateWaterLevel = (level: number) => {
    waterLevel.value = level;
    numberOfFish.value = parseInt((level / 10).toString()); // Beräkna antal fiskar baserat på vattennivå
  };
  </script>
  
  <style scoped>
  .tank-container {
    position: relative;
  }
  </style>