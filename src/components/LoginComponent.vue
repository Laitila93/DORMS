<template>

  <div class="grid gap-8">
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
      to= "/tank/"
      class=" bg-green-500 text-white p-2 rounded block w-full text-center">
      Log in
    </router-link>

  </div>

</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
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

//Computed property to check if the form is valid, 
// placeholder for actual validation logic to be implemented later
const isFormValid = computed(() => {
  return username.value.trim() !== '' && password.value.trim() !== '';
});

const redirectToTank = () => {
  if (isFormValid.value) 
  {
    router.push('/tank/'); //Placeholder for correct routing to be implemented later
  } else {
    alert('Please enter a valid corridor ID.');
  }
};


</script>