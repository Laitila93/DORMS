<template>
    <div class="vertical-menu">
      <ul>
        <li v-for="item in menuItems" :key="item.name">
            <button class="cursor-pointer inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 w-full rounded-xl shadow-md transition-colors duration-300" @click="$emit('menu-select', item.name)">{{ item.name }}</button>
        </li>
      </ul>
    </div>
  </template>
  
  <script setup lang="ts">
    import { ref, watch } from 'vue';
    import menuData from '@/assets/menu.json';

    const props = defineProps<{
      menu: string;
    }>();

    const menuItems = ref(
      menuData[props.menu as keyof typeof menuData] || []
    );
    watch(
      () => props.menu,
      (newMenu) => {
        menuItems.value = menuData[newMenu as keyof typeof menuData] || [];
      }
    );
  </script>
  
  <style scoped>
  .vertical-menu {
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    width: 200px;

    padding: 1rem;

  }
  
  .vertical-menu ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  .vertical-menu li {
    margin: 0.5rem 0;
  }

  </style>