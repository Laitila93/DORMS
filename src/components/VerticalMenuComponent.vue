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
  import { ref, watch, onMounted } from 'vue';

  type MenuItem = {
  name: string;
  link: string;
  };
  const menuItems = ref<MenuItem[]>([]);
  const menuData = ref<Record<string, MenuItem[]>>({});

  const props = defineProps<{
    menu: string;
    socket: any;
  }>();

  onMounted(() => {
    props.socket.emit("getMenuData", "en"); // Replace "en" with the desired language
    props.socket.on("menuData", (labels: Record<string, MenuItem[]>) => {
      menuData.value = labels;
      console.log("Received menu data:", labels);

      // Update menuItems after menuData is populated
      menuItems.value = (menuData.value[props.menu as keyof typeof menuData.value] || []) as MenuItem[];
    });
      // Handle errors
      props.socket.on("error", (error: { message: string }) => {
        console.error("Error from server:", error.message);
      });
    });

    // Watch for changes in the `menu` prop and update `menuItems`
    watch(
      () => props.menu,
      (newMenu) => {
        menuItems.value = (menuData.value[newMenu as keyof typeof menuData.value] || []) as MenuItem[];
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