<template>


    <div class="flex flex-col min-h-screen w-screen">
  
      <header class=" text-white p-4 text-center">
        <h1 class="text-2xl font-bold">Welcome to DORMS Leaderboard</h1>
        <p class="text-lg">Here you can see who currently leads the race!</p>
      </header>
      
      <main class="flex flex-col flex-1 justify-center items-center px-4">

      </main>
  
    
    <NavComponent :socket="socket" :menu="menuType" />
  
    </div>
  
  </template>
  
  <script setup lang="ts">
  import LoginComponent from '@/components/LoginComponent.vue';
  import NavComponent from '@/components/NavComponent.vue';
  import { ref } from 'vue';
  import { socket } from '@/composables/socket';
  const menuType = ref('tank');
  </script>
  
  <style scoped>
  </style>

