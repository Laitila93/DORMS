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
<form @submit.prevent="login" class="w-full max-w-md">
      <!-- Username Input -->
      <input
        type="text"
        :id="usernameID"
        class="rounded p-2 w-full mb-4 border border-gray-300"
        :placeholder="usernamePlaceholder"
        v-model="username"
        autocomplete="off"
        required
      />

      <!-- Password Input -->
      <input
        type="password"
        :id="passwordID"
        class="rounded p-2 w-full mb-4 border border-gray-300"
        :placeholder="passwordPlaceholder"
        v-model="password"
        autocomplete="off"
        required
      />

      <!-- Create User Button -->
      <button
        type="submit"
        class="p-2 rounded block w-full text-center bg-primary dark:bg-primary-dark hover:bg-secondary dark:hover:bg-secondary-dark cursor-pointer text-white font-semibold"
      >
        Login
      </button>
    </form>

  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';


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

      // Redirect to the tank view
      router.push('/tank');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed. Please try again.';
      alert(errorMessage);
    }
  };

</script>