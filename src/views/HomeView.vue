<template>

  <div class="flex flex-col justify-center">

    <header class="bg-gray-800 text-white p-4 text-center">
      <h1 class="text-2xl font-bold">Welcome to the HomeView</h1>
      <p class="text-lg">This is the home view of our application.</p>
    </header>
    
    <section class="bg-gray-700 text-white p-4 text-center">
      <label for="corridor-ID">Enter your corridor ID:</label>>
      <input
        type="text"
        id="corridor-ID"
        class="border border-gray-300 rounded p-2 mt-2"
        placeholder="Enter corridor ID"/>
      <router-link to="/tank/" class="bg-blue-500 text-white p-2 rounded mt-2 inline-block">
        Go to Tank
      </router-link>  
    </section>

  
  <NavComponent :menu="menuType" />

  </div>
  
</template>

<script setup lang="ts">
import NavComponent from '@/components/NavComponent.vue';
import { ref } from 'vue';
const menuType = ref('tank');
</script>

<style scoped>
</style>