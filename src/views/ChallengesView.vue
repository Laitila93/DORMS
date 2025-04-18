<!--View where user can see all daily, weekly, monthly, and special
     challenges. Current, completed, and future challenges can be
     viewed.
    Total collected points and a direct link to the shop is available.
    There is also a function for the user to change daily challenges.-->
<template>
    <NavComponent :menu="navMenuType" :socket="socket" />
    <div class="grid grid-cols-[168px_1fr] h-screen">
        <!-- Sidebar -->
        <div class="p-4">
        <VerticalMenuComponent :menu="menuType" :socket="socket" @menu-select="handleMenuSelect" />
        </div>

        <div class="p-4 overflow-y-auto space-y-6">
          <div v-if="selectedContent === 'active'"></div>
          <div v-else-if="selectedContent === 'past'"></div>
          <div v-else-if="selectedContent === 'upcoming'"></div>
        </div>

     </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import VerticalMenuComponent from '@/components/VerticalMenuComponent.vue';
import NavComponent from '@/components/NavComponent.vue';
import challengesData from '@assets/challengesData.json';

const menuType = ref('challenges');
const navMenuType = ref('main');
const selectedContent = ref('active');
</script>

<style scoped>

</style>