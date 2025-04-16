<!--View where user can see more in-depth statisics of water consumption.
    Both pure data and graphs are available, and can be sorted by time.
    Can go in to "fullscreen view" of each graph etc.-->

<template>
    <NavComponent :menu="navMenuType" />
    <div class="grid grid-cols-[168px_1fr] h-screen">
        <!-- Sidebar -->
        <div class="p-4">
        <VerticalMenuComponent :menu="menuType" @menu-select="handleMenuSelect" />
        </div>
    
        <!-- Main Content Area -->
        <div class="p-4 overflow-y-auto space-y-6">
        <div v-if="selectedContent === 'hourly'">
            <p class="text-lg font-semibold mb-2">Hourly Stats</p>
            <!-- Placeholder for hourly graph -->
            <div class="w-full h-64 bg-gray-200 rounded-md flex items-center justify-center">
            <p>Hourly Graph Placeholder</p>
            </div>
            <!-- Placeholder for hourly data summary -->
            <div class="mt-4 bg-white shadow rounded-md p-4">
            <p class="font-medium mb-2">Hourly Data Summary:</p>
            <div class="w-full h-64 bg-gray-200 rounded-md flex items-center justify-center">
                <p>Hourly Data Placeholder</p>
            </div>
            </div>
        </div>
    
        <div v-else-if="selectedContent === 'daily'">
            <p class="text-lg font-semibold mb-2">Daily Stats</p>
            <!-- Placeholder for daily graph -->
            <div class="w-full h-64 bg-gray-200 rounded-md flex items-center justify-center">
            <p>Daily Graph Placeholder</p>
            </div>
            <!-- Placeholder for daily data summary -->
            <div class="mt-4 bg-white shadow rounded-md p-4">
            <p class="font-medium mb-2">Daily Data Summary:</p>
            <div class="w-full h-64 bg-gray-200 rounded-md flex items-center justify-center">
                <p>Daily Data Placeholder</p>
            </div>
            </div>
        </div>
    
        <div v-else-if="selectedContent === 'weekly'">
            <p class="text-lg font-semibold mb-2">Weekly Stats</p>
            <!-- Placeholder for weekly graph -->
            <div class="w-full h-64 bg-gray-200 rounded-md flex items-center justify-center">
            <p>Weekly Graph Placeholder</p>
            </div>
            <!-- Placeholder for weekly data summary -->
            <div class="mt-4 bg-white shadow rounded-md p-4">
            <p class="font-medium mb-2">Weekly Data Summary:</p>
            <div class="w-full h-64 bg-gray-200 rounded-md flex items-center justify-center">
                <p>Weekly Data Placeholder</p>
            </div>
            </div>
        </div>
    
        <div v-else-if="selectedContent === 'monthly'">
            <p class="text-lg font-semibold mb-2">Monthly Stats</p>
            <!-- Placeholder for monthly graph -->
            <div class="w-full h-64 bg-gray-200 rounded-md flex items-center justify-center">
            <p>Monthly Graph Placeholder</p>
            </div>
            <!-- Placeholder for monthly data summary -->
            <div class="mt-4 bg-white shadow rounded-md p-4">
            <p class="font-medium mb-2">Monthly Data Summary:</p>
            <div class="w-full h-64 bg-gray-200 rounded-md flex items-center justify-center">
                <p>Monthly Data Placeholder</p>
            </div>
            </div>
        </div>
    
        <div v-else>
            <p class="text-lg">Please select a time range</p>
        </div>
        </div>
    </div>
    </template>
    
    <script setup lang="ts">
    import { ref } from 'vue';
    import VerticalMenuComponent from '@/components/VerticalMenuComponent.vue';
    import NavComponent from '@/components/NavComponent.vue';
    import statsData from '@/assets/statsData.json';
    
    const menuType = ref('stats');
    const navMenuType = ref('main');
    const selectedContent = ref('daily');
    function handleMenuSelect(option: string) {
        selectedContent.value = option;
    }
    
    </script>
    
    <style scoped>

    </style>
