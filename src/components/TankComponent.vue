<template>
    <div class="tank">
      <div class="water" :style="{ height: waterLevel + '%' }"></div>
      <div class="circles">
        <CircleComponent v-for="n in numberOfFish" :key="n" :waterLevel="waterLevel" />
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import CircleComponent from '@/components/CircleComponent.vue';
  
  const props = defineProps({
    onWaterLevelChange: {
      type: Function,
      required: true
    }
  });
  
  const waterLevel = ref(50); // Skapa en reaktiv variabel för vattennivå
  const numberOfFish = ref(5);
  
  onMounted(() => {
    waterLevel.value = 50 + Math.floor(Math.random() * 50); // Simulerar vattennivå mellan 50 och 100
    props.onWaterLevelChange(waterLevel.value); // Skicka uppdaterad vattennivå till föräldern
    numberOfFish.value = parseInt(waterLevel.value / 10); // Beräkna antal fiskar baserat på vattennivå
    
  
  // randomisera vattennivå varje sekund
    
    setInterval(() => {
      // Anropa metod som hämtar/beräknar/tilldelar vattennivå
      waterLevel.value = 50 + Math.floor(Math.random() * 50); // Simulerar vattennivå mellan 50 och 100
      props.onWaterLevelChange(waterLevel.value); // Skicka uppdaterad vattennivå till föräldern
      numberOfFish.value = parseInt(waterLevel.value / 10); // Beräkna antal fiskar baserat på vattennivå
    }, 1000); // Uppdatera varje sekund
  
    
  });
  </script>
  
  <style scoped>
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
  
  .circles {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none; /* Gör så att cirklarna inte påverkar interaktionen med tanken */
  }
  </style>