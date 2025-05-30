<template>
  <div>
    <!-- Hamburger Icon -->
    <button
      @click="toggleMenu()"
      class="z-50 flex flex-col justify-between w-8 h-6 cursor-pointer"
      aria-label="Toggle menu"
    >
      <span :class="barClass(1)"></span>
      <span :class="barClass(2)"></span>
      <span :class="barClass(3)"></span>
    </button>

    <!-- Slide-out Menu -->
    <div
      class="fixed top-0 right-0 h-full w-64 z-40 transform transition-transform duration-300 ease-in-out shadow-xl
             bg-background p-6 dark:bg-background-dark"
      :class="{ 'translate-x-0': isOpen, 'translate-x-full': !isOpen }"
    >
      <ul class="space-y-4">
        
        <!-- Logout Button -->
        
          <button
            @click="logout"
            class="w-full py-2 px-4 rounded-xl font-semibold text-white bg-red-500 hover:bg-red-600
                   transition-colors duration-300"
          >
            Logout
          </button>
        

        <!-- Menu Items -->
        <router-link
          v-for="item in menuItems"
          :key="item.name"
          :to="item.link"
          @click="closeMenu"
          class="block"
          active-class="menu-active"
        >
          <div
            class="inline-flex items-center gap-2 w-full cursor-pointer py-2 px-4 rounded-xl font-semibold
                  text-text dark:text-text-dark bg-secondary dark:bg-secondary-dark
                  hover:bg-primary-dark dark:hover:bg-primary transition-colors duration-300"
          >
            {{ item.name }}
          </div>
        </router-link>

        

        <!-- Admin Link -->
        <router-link
          to="/admin"
          v-if="role === 'admin'"
          @click="closeMenu"
          class="block"
          active-class="menu-active"
        >
          <div
            class="inline-flex items-center gap-2 w-full cursor-pointer py-2 px-4 rounded-xl font-semibold
                  text-text dark:text-text-dark bg-secondary dark:bg-secondary-dark
                  hover:bg-primary-dark dark:hover:bg-primary transition-colors duration-300"
          >
            Admin
          </div>
        </router-link>
      </ul>
    </div>

    <!-- Overlay -->
    <div
      v-if="isOpen"
      @click="closeMenu"
      class="fixed inset-0 z-30 bg-black bg-opacity-40 backdrop-blur-sm"
    />
  </div>
</template>


<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

type MenuItem = {
  name: string
  link: string
}

const props = defineProps<{
  menu: string
  socket: any
}>()

const isOpen = ref(false)
const toggleMenu = () => (isOpen.value = !isOpen.value)
const closeMenu = () => (isOpen.value = false)
const role = sessionStorage.getItem('userRole')
const router = useRouter()
const logout = () => {
  sessionStorage.clear()
  router.push({ name: 'home' })
}

const menuItems = ref<MenuItem[]>([])
const menuData = ref<Record<string, MenuItem[]>>({})

onMounted(() => {
  menuData.value = JSON.parse(localStorage.getItem('menuData') || '{}')
  menuItems.value = (menuData.value[props.menu] || []) as MenuItem[]
})

const barClass = (index: number) => {
  return [
    'block h-0.5 w-full rounded-sm transition-all duration-300 ease-in-out',
    // Color adjustments for light and dark modes
    'bg-text dark:bg-text-dark', // This ensures the hamburger icon is visible in both modes
    isOpen.value
      ? index === 1
        ? 'transform translate-y-[9px] rotate-45' // First bar (rotates into X)
        : index === 2
          ? 'opacity-0' // Second bar (disappears)
          : 'transform -translate-y-[9px] -rotate-45' // Third bar (rotates into X)
      : ''
  ].join(' ')
}

</script>
