<template>
  <NavComponent :socket="socket" :menu="navMenuType" />
  <div class="justify-center items-center flex flex-col h-screen">
      <h1>About</h1>
      <p>This is the about page of our application.</p>
      <p>Here you can find information about our team and mission.</p>
      <p>We are dedicated to providing the best service possible.</p>
  </div>
</template>

<script setup lang="ts">
  import NavComponent from '@/components/NavComponent.vue';
  import { ref } from 'vue';
  import { io } from 'socket.io-client';

  const serverIP = sessionStorage.getItem("serverIP") || "http://localhost:3000";
  const socket = io(serverIP);

  const navMenuType = ref('tank'); // This can be changed to any other menu type as needed
</script>

<style scoped>

</style>