<template> 
  <div class="flex flex-col min-h-screen w-screen">

    <header class=" text-white p-4 text-center">
      <h1 class="text-2xl font-bold">Welcome to DORMS</h1>
      <p class="text-lg">Please enter your corridor ID and password below</p>
      <p class="text-sm text-emerald-500">(This is a test version so just type any character in both fields)</p>
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


  <NavComponent :socket="socket" :menu="menuType" />

  </div>

</template>

<script setup lang="ts">
import LoginComponent from '@/components/LoginComponent.vue';
import NavComponent from '@/components/NavComponent.vue';
import { ref } from 'vue';
import { io } from 'socket.io-client';
sessionStorage.setItem("serverIP", "http://192.168.50.97:3000"); //Must be changed to your local IP-address

const serverIP = sessionStorage.getItem("serverIP") || "http://localhost:3000";
const socket = io(serverIP);

socket.on('connect', () => {
  console.log('Connected to the server');
});
const menuType = ref('tank');

</script>

<style scoped>
</style>