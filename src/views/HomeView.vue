<!--This is the Home view, the first page the user sees when they open the app.
to the other corridors in the building. It contains a LoginComponent with login input fields and a side menu component. 

----TBD-----

** 1. Implement a Login system that checks database for valid user and password.
** 2. Decide on what menu links should be in the side menu. Right now it is a placeholder.
** 3. Maybe add an eye symbol to the password field to show/hide the password.


------------

//Emil 20th of april-->


<template>

  <!--Side menu component, currently styled with position:fixed, therefore I've placed it here-->
  <NavComponent :key="navKey" :menu="menuType" :socket="socket"/>

  <!--Body -->
  <div class="flex flex-col min-h-screen w-screen">
    <!--Header with prompt to fill in username and password-->
    <header class="p-4 text-center">
      <h1 class="text-2xl font-bold">Welcome to DORMS</h1>
      <p class="text-lg">Please enter your corridor ID and password below</p>
      <p class="text-sm text-emerald-500">(This is a test version so just type any character in both fields)</p>
    </header>

    <!--Main content area with login fields-->
    <main class="flex flex-col flex-1 justify-center items-center px-4">
      <section class="rounded-lg flex flex-col p-4 text-center w-full max-w-md">
        <LoginComponent
          usernameID="username"
          usernamePlaceholder="Enter your corridor ID"
          passwordID="password"
          passwordPlaceholder="Enter your password"
        />
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import LoginComponent from '@/components/LoginComponent.vue';
import NavComponent from '@/components/NavComponent.vue';
import { ref, onMounted } from 'vue';
import { socket } from '@/composables/socket';

type MenuItem = {
  name: string;
  link: string;
};

const menuType = ref('tank'); // Menu version for the NavComponent (side menu). Can be changed to other menu types in the future.
const navKey = ref(0); // Reactive key for NavComponent

const refreshNav = () => {
  navKey.value++; // Increment the key to force re-render
};

onMounted(() => {
  socket.emit("getMenuData", "en"); // Fetch menu items from server, switch between "sv" and "en" for desired language
  socket.on("menuData", (labels: Record<string, MenuItem[]>) => {
    localStorage.setItem("menuData", JSON.stringify(labels));
    refreshNav(); // Refresh NavComponent when new menu data is received
  });

  // Handle errors
  socket.on("error", (error: { message: string }) => {
    console.error("Error from server:", error.message);
  });
});

socket.on('connect', () => {
  console.log('Connected to the server'); // Verify connection for error detection
});
</script>
