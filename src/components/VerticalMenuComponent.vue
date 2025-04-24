<template>
  <div class="fixed top-0 left-0 h-full w-52 p-6 bg-background dark:bg-background-dark shadow-md">
    <ul class="space-y-4">
      <li v-for="item in menuItems" :key="item.name">
        <button
          class="cursor-pointer inline-flex items-center gap-2 w-full bg-secondary dark:bg-secondary-dark hover:bg-primary-dark dark:hover:bg-primary text-text dark:text-text-dark font-semibold py-2 px-4 rounded-xl transition-colors duration-300"
          @click="$emit('menu-select', item.name)"
        >
          {{ item.name }}
        </button>
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
