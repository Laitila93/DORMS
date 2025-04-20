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

    <!--Username input-->
    <input
      type="text"
      :id="usernameID"
      class="border border-gray-300 rounded p-2 w-full"
      :placeholder="usernamePlaceholder"
      v-model="username"
      autocomplete="off"
    />

    <!--Password input-->
    <input
      type="password"
      :id="passwordID"
      class="border border-gray-300 rounded p-2 w-full"
      :placeholder="passwordPlaceholder"
      v-model="password"
      autocomplete="off"
    />

    <!--Submit button-->
    <button
      class="p-2 rounded block w-full text-center bg-emerald-500 text-white hover:bg-emerald-600 cursor-pointer"
      @click=""
    >
      Log in
    </button>
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
/*
                          const login = async () => {
                            try {
                              const response = await fetch(`http://localhost:3000/api/login`, {
                                method: 'POST',
                                headers: {
                                  'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                  name: username.value,
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

                              // Redirect to the tank view
                              router.push('/tank');
                            } catch (error) {
                              const errorMessage = error instanceof Error ? error.message : 'Login failed. Please try again.';
                              alert(errorMessage);
                            }
                          };
*/
</script>