<template>
  <NavComponent :socket="socket" :menu="navMenuType" />
  <div class="justify-center items-center flex flex-col h-screen">
    <h1 class="text-2xl font-bold mb-4">Create New User</h1>

    <!-- Form -->
    <form @submit.prevent="handleSubmit" class="w-full max-w-md">
      <!-- Username Input -->
      <input
        type="text"
        class="rounded p-2 w-full mb-4 border border-gray-300"
        placeholder="Enter username"
        v-model="username"
        autocomplete="off"
        required
      />

      <!-- Password Input -->
      <input
        type="password"
        class="rounded p-2 w-full mb-4 border border-gray-300"
        placeholder="Enter password"
        v-model="password"
        autocomplete="off"
        required
      />

      <!-- Create User Button -->
      <button
        type="submit"
        class="p-2 rounded block w-full text-center bg-primary dark:bg-primary-dark hover:bg-secondary dark:hover:bg-secondary-dark cursor-pointer text-white font-semibold"
      >
        Create User
      </button>
    </form>

    <!-- Feedback Message -->
    <p v-if="feedbackMessage" :class="feedbackClass" class="mt-4">
      {{ feedbackMessage }}
    </p>
    <button @click="getWaterData" class="mt-4 p-2 rounded bg-blue-500 text-white">Get Water Data</button>
  <div class="flex flex-col items-center mt-4">
    <h2 class="text-lg font-bold">Water Data</h2>
    <div v-if="waterData" class="bg-gray-100 p-4 rounded shadow-md">
      <pre>{{ waterData }}</pre>
    </div>
  </div>
  </div>

</template>

<script setup lang="ts">
import NavComponent from '@/components/NavComponent.vue';
import { ref, onMounted, onUnmounted } from 'vue';
import { socket } from '@/composables/socket';

// Reactive variables
const navMenuType = ref('tank'); // Menu type for NavComponent
const username = ref(''); // Username input
const password = ref(''); // Password input
const feedbackMessage = ref(''); // Feedback message for the user
const feedbackClass = ref(''); // CSS class for feedback message
const waterData = ref(null); // Water data received from the server

onMounted(() => {
  socket.on('DbWaterData', (data: any) => {
    console.log('Water data received:', data);
    waterData.value = data; // Assign received data to waterData
  });
});

onUnmounted(() => {
  socket.off('DbWaterData'); // Clean up the socket listener when component is unmounted
});
// Function to handle form submission
const handleSubmit = () => {
  if (username.value && password.value) {
    createUser();
  }
};

const getWaterData = () => {
  socket.emit('getDbWaterData'); // Emit event to get water data from the server
  console.log('Requesting water data...');
}

// Function to create a new user
const createUser = async () => {
  try {
    const response = await fetch(`https://dorms-server.onrender.com/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username.value,
        password: password.value,
      }),
    });

    if (response.ok) {
      feedbackMessage.value = 'User created successfully!';
      feedbackClass.value = 'text-green-500';
      username.value = ''; // Clear the input fields
      password.value = '';
    } else {
      const errorData = await response.json();
      feedbackMessage.value = errorData.message || 'Failed to create user.';
      feedbackClass.value = 'text-red-500';
    }
  } catch (error) {
    feedbackMessage.value = 'An error occurred. Please try again.';
    feedbackClass.value = 'text-red-500';
    console.error('Error creating user:', error);
  }
};
</script>
