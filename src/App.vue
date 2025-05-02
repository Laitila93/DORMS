<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useShopData } from '@/composables/useShopData';
import '@fontsource/nunito-sans';
import '@fontsource/fredoka';

useShopData(); // kicks off fetching and stores in sessionStorage

</script>

<template>
  <div class="class h-full">
    <router-view />
  </div>
</template>

