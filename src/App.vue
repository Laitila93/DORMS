<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useShopData } from '@/composables/useShopData';
import '@fontsource/nunito-sans';
import '@fontsource/fredoka';

useShopData(); // kicks off fetching and stores in sessionStorage

</script>

<template>
  <router-view />
</template>

<style>

html, body, #app {
  height: 100%;
}

</style>
