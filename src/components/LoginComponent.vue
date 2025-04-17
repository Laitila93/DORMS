<template>
  <div class="grid gap-8">
    <input
      type="text"
      :id="usernameID"
      class="border border-gray-300 rounded p-2 w-full"
      :placeholder="usernamePlaceholder"
      v-model="username"
      autocomplete="off"
    />

    <input
      type="password"
      :id="passwordID"
      class="border border-gray-300 rounded p-2 w-full"
      :placeholder="passwordPlaceholder"
      v-model="password"
      autocomplete="off"
    />

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