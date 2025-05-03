<template>

  <div class="border border-black"
>   <img 
      src="../assets/rockFormationFinalCut.png" 
      class="">
  </div>

</template>

<script setup lang="ts">
import{ref, defineExpose} from 'vue';

const rockElement = ref(null) //Reference to the root div of the rock

//Expose the rockElement to be accessible in the parent container
//This is used to get the bounds of the rock for the fish movement. 
// AI was used to generate this solution. Otherwise, the ref in TankView will point to the component instance and
// not the root DOM element, which is what we want.
defineExpose({
  rockElement
});

</script>