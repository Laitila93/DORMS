<!--This is the LoginComponent, containing the Login form. 
  It is a simple component that takes in props for the username and password fields.
  The component is designed to be reusable and can be used in different parts of the application.

  (COMMENTED OUT)
  The component also uses the Vue Router for navigation after a successful login.
  The component is designed to be used with a backend API for authentication.

----TBD-----
** 1. The section at the end of the file contains a verification process. 
      It is commented out, until final implementation of the Login function is decided.
** 2. The button is not yet functional, as the login function is not yet implemented.
------------

//Emil 20th of april-->

<template>
  <div class="grid gap-8">
    <!-- Form -->
    <form @submit.prevent="login" class="w-full max-w-md space-y-4">
      
      <!-- Username Input -->
      <input
        type="text"
        :id="usernameID"
        v-model="username"
        :placeholder="usernamePlaceholder"
        autocomplete="off"
        required
        class="w-full p-3 rounded border border-border text-text placeholder-text-light bg-background-light
               focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
               dark:bg-background-dark dark:text-text-dark dark:placeholder-text-dark dark:border-border-dark"
      />

      <!-- Password Input -->
      <input
        type="password"
        :id="passwordID"
        v-model="password"
        :placeholder="passwordPlaceholder"
        autocomplete="off"
        required
        class="w-full p-3 rounded border border-border text-text placeholder-text-light bg-background-light
               focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
               dark:bg-background-dark dark:text-text-dark dark:placeholder-text-dark dark:border-border-dark"
      />

      <!-- Submit Button -->
      <button
        type="submit"
        class="w-full p-3 rounded font-semibold text-white bg-primary hover:bg-primary-light transition-colors
               dark:bg-primary-dark dark:hover:bg-secondary-dark"
      >
        Login
      </button>
    </form>
  </div>
</template>


<script setup lang="ts">
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { connectSocket } from '@/composables/socket';



  const props = defineProps<{
      usernameID: string;
      usernamePlaceholder: string;
      passwordID: string;
      passwordPlaceholder: string;
    }>();

  const username = ref('');
  const password = ref('');
  const router = useRouter();

  const login = async () => {
    try {
      const response = await fetch(`https://dorms-server.onrender.com/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username.value,
          password: password.value,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Login failed');
      }

      const data = await response.json();

      // Save the token in sessionStorage
      sessionStorage.setItem('authToken', data.token);
      sessionStorage.setItem('dormID', data.dormID.toString());
      if (data.dormID === 1) {
        sessionStorage.setItem('userRole', 'admin');
      } else {
        sessionStorage.setItem('userRole', 'user');
      }

      // After successful login
      const socket = connectSocket(data.token);

      if (socket) {
        socket.on('connect', () => {
          console.log('Socket connected with dorm ID:', data.dormID);
        });
      } else {
        console.error('Failed to connect socket: socket is undefined.');
      }

      // Redirect to the tank view
      router.push('/tank');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed. Please try again.';
      alert(errorMessage);
    }
  };

</script>