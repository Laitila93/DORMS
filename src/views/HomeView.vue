<!--This is the Home view, the first page the user sees when they open the app.
to the other corridors in the building. It contains a LoginComponent with login input fields and a side menu component. 

----TBD-----
** 1. Decide on what menu links should be in the side menu. Right now it is a placeholder.

------------

-->


<template>
  <!--Create layout for this page -->
  <div class="flex flex-col min-h-screen w-screen">
    <!--Header with prompt to fill in username and password-->
    <header class="p-4 text-center">
      <h1 class="text-2xl font-bold">Welcome to DORMS</h1>
      <p class="text-lg">Please enter your corridor ID and password below</p>
    </header>

    <!--Main content area with login fields-->
    <div class="flex flex-col flex-1 justify-center items-center px-4">
      <section class="rounded-lg flex flex-col p-4 text-center w-full max-w-md">
        <LoginComponent
          usernameID="username"
          usernamePlaceholder="Enter your corridor ID"
          passwordID="password"
          passwordPlaceholder="Enter your password"
        />
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import LoginComponent from '@/components/LoginComponent.vue';
import { getSocket } from '@/composables/socket'; // Import the socket instance from socket.ts
const socket = getSocket(); // Import the socket instance from socket.ts

socket.on('connect', () => {
  console.log('Connected to the server'); // Verify connection for error detection
});
</script>
