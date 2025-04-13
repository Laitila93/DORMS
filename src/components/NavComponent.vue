<template>
    <div>
      <!-- Hamburger Icon -->
      <button @click="toggleMenu" class="hamburger z-50">
        <span :class="{ open: isOpen }"></span>
        <span :class="{ open: isOpen }"></span>
        <span :class="{ open: isOpen }"></span>
      </button>
  
      <!-- Slide-out Menu -->
      <div class="menu transform transition-transform duration-300 ease-in-out" 
      :class="{ 'translate-x-0': isOpen, 'translate-x-full': !isOpen }">
        <ul class="menu-items">  
          <li v-for="item in menuItems" :key="item.name">
              <router-link :to="item.link" @click="closeMenu">
                <div class="bg-gray-200 w-full p-3 rounded-lg hover:bg-gray-400 transition duration-200">
                  {{ item.name }}
                </div>
              </router-link>
          </li>
        </ul>
      </div>
  
      <!-- Overlay -->
      <div
        v-if="isOpen"
        @click="closeMenu"
        class="fixed inset-0 z-40 bg-black opacity-50"
      />
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
      const isOpen = ref(false);
      const toggleMenu = () => (isOpen.value = !isOpen.value);
      const closeMenu = () => (isOpen.value = false);
  </script>
  
  <style scoped>
  .hamburger {
    position: fixed;
    top: 1rem;
    right: 1rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 30px;
    height: 22px;
    cursor: pointer;
    z-index: 50;
  }
  .hamburger span {
    display: block;
    height: 3px;
    background: #333;
    transition: all 0.3s ease;
    border-radius: 2px;
  }
  /* Change color on hover */
  .hamburger:hover span {
    background: #42b983; /* Change to your desired hover color */
  }
  .hamburger span.open:nth-child(1) {
    transform: translateY(9px) rotate(45deg);
  }
  .hamburger span.open:nth-child(2) {
    opacity: 0;
  }
  .hamburger span.open:nth-child(3) {
    transform: translateY(-9px) rotate(-45deg);
  }
  
  .menu {
    position: fixed;
    top: 0;
    right: 0;
    height: 100%;
    width: 240px;
    background-color: #2c3e50;
    padding: 2rem;
    z-index: 45;
  }
  .menu-items {
    list-style: none;
    padding: 0;
  }
  .menu-items li {
    margin: 1.5rem 0;
  }
  .menu-items a {
    text-decoration: none;
    color: #222222;
    font-size: 1.25rem;
    font-weight: 500;
  }
  </style>
  