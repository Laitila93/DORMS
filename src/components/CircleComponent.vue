<template>
    <div class="circle" :style="circleStyle"></div>
  </template>
  
  <script setup>
  import { ref, onMounted, watch } from 'vue';
  
  const props = defineProps({
    waterLevel: Number
  });
  
  const circleStyle = ref({});
  const size = Math.random() * 20 + 10; // Cirkelstorlek mellan 10px och 30px
  let left = Math.random() * 100; // Placering inom tankens bredd
  let bottom = Math.random() * props.waterLevel; // Placering inom tankens höjd under vattennivån
  let horizontalMovement = 2 * Math.random() - 1;
  let verticalMovement = 2 * Math.random() - 1;
  
  const setCircleStyle = () => {
    circleStyle.value = {
      width: `${size}px`,
      height: `${size}px`,
      bottom: `${bottom}%`, // Justera så att cirklarna placeras under vattennivån
      left: `${left}%`,
      animation: `swim ${Math.random() * 5 + 5}s infinite`
    };
  };
  
  const updateCirclePosition = () => {
    bottom += verticalMovement;
    left += horizontalMovement;
  
    if (bottom > (props.waterLevel)) {
      bottom = props.waterLevel;
      verticalMovement = -verticalMovement; // Reverse direction
    } else if (bottom < 0) {
      bottom = 0;
      verticalMovement = -verticalMovement; // Reverse direction
    }
  
    if (left > 100) {
      left = 100;
      horizontalMovement = -horizontalMovement; // Reverse direction
    } else if (left < 0) {
      left = 0;
      horizontalMovement = -horizontalMovement; // Reverse direction
    }
  
    circleStyle.value.bottom = `${bottom}%`;
    circleStyle.value.left = `${left}%`;
  };
  
  onMounted(() => {
    setCircleStyle();
    setInterval(updateCirclePosition, 100); // Update position every 100ms
  });
  
  watch(() => props.waterLevel, () => {
    updateCirclePosition();
  });
  </script>
  
  <style scoped>
  @keyframes swim {
    0% {
      transform: translate(0, 0);
    }
    100% {
      transform: translate(10px, 10px);
    }
  }
  
  .circle {
    position: absolute;
    background-color: yellow;
    border-radius: 50%;
  }
  </style>