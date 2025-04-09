
<script setup lang="ts">
import NavComponent from '@/components/NavComponent.vue';
import { ref } from 'vue';

const menuType = ref('tank');
</script>

<template>
      <NavComponent :menu="menuType" />
</template>
