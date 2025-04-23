<template>
  <div>
    <!-- Hamburger Icon -->
    <button @click="toggleMenu()" class="fixed top-4 right-4 z-50 flex flex-col justify-between w-8 h-6 cursor-pointer">
      <span :class="barClass(1)"></span>
      <span :class="barClass(2)"></span>
      <span :class="barClass(3)"></span>
    </button>

    <!-- Slide-out Menu -->
    <div
      class="fixed top-0 right-0 h-full w-64 z-40 bg-background p-6 transform transition-transform duration-300 ease-in-out shadow-xl dark:bg-background-dark"
      :class="{ 'translate-x-0': isOpen, 'translate-x-full': !isOpen }"
    >
      <ul class="space-y-4">
        <li>
          <button
            @click="logout"
            class="bg-red-500 text-text dark:text-text-dark font-semibold py-2 px-4 rounded-xl transition-colors duration-300 w-full hover:bg-primary-dark dark:hover:bg-primary"
          >
            Logout
          </button>
        </li>
        <li v-for="item in menuItems" :key="item.name">
          <router-link :to="item.link" @click="closeMenu">
            <div class="cursor-pointer inline-flex items-center gap-2 w-full bg-secondary dark:bg-secondary-dark hover:bg-primary-dark dark:hover:bg-primary text-text dark:text-text-dark font-semibold py-2 px-4 rounded-xl transition-colors duration-300">
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

const router = useRouter()
const logout = () => {
  sessionStorage.removeItem('authToken')
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
    'block h-0.5 w-full bg-text transition-all duration-300 ease-in-out rounded-sm',
    isOpen.value
      ? index === 1
        ? 'transform translate-y-[9px] rotate-45'
        : index === 2
          ? 'opacity-0'
          : 'transform -translate-y-[9px] -rotate-45'
      : ''
  ].join(' ')
}
</script>
