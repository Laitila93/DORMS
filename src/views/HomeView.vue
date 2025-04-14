<template>

  <div class="flex flex-col min-h-screen w-screen">

    <header class=" text-white p-4 text-center">
      <h1 class="text-2xl font-bold">Welcome to DORMS</h1>
      <p class="text-lg">Please enter your corridor ID below</p>
    </header>
    
    <main class="flex flex-col flex-1 justify-center items-center px-4">
      <section class="rounded-lg flex flex-col text-white p-4 text-center w-full max-w-md">
        <LoginComponent
          usernameID="username"
          usernamePlaceholder="Enter your corridor ID"
          passwordID="password"
          passwordPlaceholder="Enter your password"
        />
      </section>
    </main>

  
  <NavComponent :menu="menuType" />

  </div>

</template>

<script setup lang="ts">
import LoginComponent from '@/components/LoginComponent.vue';
import NavComponent from '@/components/NavComponent.vue';
import { ref } from 'vue';
const menuType = ref('main');
</script>

<style scoped>
</style>