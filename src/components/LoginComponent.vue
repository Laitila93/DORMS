<template>
  <div class="flex flex-col space-y-4">
    <input
      type="text"
      :id= "usernameID"
      class="border border-gray-300 rounded p-2 w-full"
      :placeholder="usernamePlaceholder"
      v-model ="username"
      @keyup.enter="redirectToTank"
    />

    <input
      type="text"
      :id = "passwordID"
      class="border border-gray-300 rounded p-2 w-full"
      :placeholder="passwordPlaceholder"
      v-model = "password"
      @keyup.enter="redirectToTank"
      />

    <router-link
      to="/tank/" 
      class="bg-amber-500 hover:bg-amber-600 
      transition-colors duration-200 text-white p-2 
      rounded block w-full text-center">
      Log in
    </router-link>

  </div>


</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps<{
  usernameID: string;
  usernamePlaceholder: string;
  passwordID: string;
  passwordPlaceholder: string;

}>();

const username = ref('');
const router = useRouter();
const password = ref('');

const redirectToTank = () => {
  if (username.value.trim() && password.value.trim()) //Ensure the input is not empty 
  {
    router.push('/tank/');
  } else {
    alert('Please enter a valid corridor ID.');
  }
};


</script>

<style scoped>


</style>