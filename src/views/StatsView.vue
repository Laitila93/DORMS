<!--View where user can see more in-depth statisics of water consumption.
    Both pure data and graphs are available, and can be sorted by time.
    Can go in to "fullscreen view" of each graph etc.-->

<template>
    <NavComponent :menu="navMenuType" :socket="socket" />
    <div class="grid grid-cols-[168px_1fr] h-screen">
        <!-- Sidebar -->
        <div class="p-4">
        <VerticalMenuComponent :menu="menuType" :socket="socket" @menu-select="handleMenuSelect" />
        </div>
    
        <!-- Main Content Area -->
        <div class="p-4 overflow-y-auto space-y-6">
        <div v-if="selectedContent === 'hourly'">
            <p class="text-lg font-semibold mb-2 m-4">Hourly Stats</p>
            <div
                class="grid gap-4"
                :class="['grid-cols-[360px_360px_250px]','grid-rows-[160px_250px_150px]'  
                ]"
            >
                <div class="bg-gray-200 rounded-md col-start-1 row-start-1 text-gray-800 text-center">
                Total water consumption
                </div>
                <div class="bg-gray-200 rounded-md col-start-2 row-start-1 text-gray-800 text-center">
                Total warm water consumption
                </div>
                <div class="bg-gray-200 rounded-md col-start-3 row-start-1 text-gray-800 text-center">
                Total cold water consumption
                </div>

                <div
                class="bg-gray-200 rounded-md col-start-1 row-start-2 row-span-2 text-gray-800 text-center"
                >
                Total graph
                </div>
                <div
                class="bg-gray-200 rounded-md col-start-2 row-start-2 row-span-2 text-gray-800 text-center"
                >
                Warm water graph
                </div>

                <div class="bg-gray-200 rounded-md col-start-3 row-start-2 text-gray-800 text-center">
                Average shower time
                </div>

                <div class="bg-gray-200 rounded-md col-start-3 row-start-3 text-gray-800 text-center">
                You could have saved this many bananas
                </div>
            </div>
        </div>
    
        <div v-else-if="selectedContent === 'daily'">
            <p class="text-lg font-semibold mb-2">Daily Stats</p>
            <div
                class="grid gap-4"
                :class="['grid-cols-[360px_360px_250px]','grid-rows-[160px_250px_150px]'  
                ]"
            >
                <div class="bg-gray-200 rounded-md col-start-1 row-start-1 text-gray-800 text-center">
                Total water consumption
                </div>
                <div class="bg-gray-200 rounded-md col-start-2 row-start-1 text-gray-800 text-center">
                Total warm water consumption
                </div>
                <div class="bg-gray-200 rounded-md col-start-3 row-start-1 text-gray-800 text-center">
                Total cold water consumption
                </div>

                <div
                class="bg-gray-200 rounded-md col-start-1 row-start-2 row-span-2 text-gray-800 text-center"
                >
                Total graph
                </div>
                <div
                class="bg-gray-200 rounded-md col-start-2 row-start-2 row-span-2 text-gray-800 text-center"
                >
                Warm water graph
                </div>

                <div class="bg-gray-200 rounded-md col-start-3 row-start-2 text-gray-800 text-center">
                Average shower time
                </div>

                <div class="bg-gray-200 rounded-md col-start-3 row-start-3 text-gray-800 text-center">
                You could have saved this many bananas
                </div>
            </div>
        </div>
    
        <div v-else-if="selectedContent === 'weekly'">
            <p class="text-lg font-semibold mb-2">Weekly Stats</p>
            <div
                class="grid gap-4"
                :class="['grid-cols-[360px_360px_250px]','grid-rows-[160px_250px_150px]'  
                ]"
            >
                <div class="bg-gray-200 rounded-md col-start-1 row-start-1 text-gray-800 text-center">
                Total water consumption
                </div>
                <div class="bg-gray-200 rounded-md col-start-2 row-start-1 text-gray-800 text-center">
                Total warm water consumption
                </div>
                <div class="bg-gray-200 rounded-md col-start-3 row-start-1 text-gray-800 text-center">
                Total cold water consumption
                </div>

                <div
                class="bg-gray-200 rounded-md col-start-1 row-start-2 row-span-2 text-center"
                >
                <p class="text-gray-800">Total graph</p>
                <div class="totGraph">
                 
                </div>
                </div>
                <div
                class="bg-gray-200 rounded-md col-start-2 row-start-2 row-span-2 text-gray-800 text-center"
                >
                Warm water graph
                </div>

                <div class="bg-gray-200 rounded-md col-start-3 row-start-2 text-gray-800 text-center">
                Average shower time
                </div>

                <div class="bg-gray-200 rounded-md col-start-3 row-start-3 text-gray-800 text-center">
                You could have saved this many bananas
                </div>
            </div>
        </div>
    
        <div v-else-if="selectedContent === 'monthly'">
            <p class="text-lg font-semibold mb-2">Monthly Stats</p>
            <div
                class="grid gap-4"
                :class="['grid-cols-[360px_360px_250px]','grid-rows-[160px_250px_150px]'  
                ]"
            >
                <div class="bg-gray-200 rounded-md col-start-1 row-start-1 text-gray-800 text-center">
                Total water consumption
                </div>
                <div class="bg-gray-200 rounded-md col-start-2 row-start-1 text-gray-800 text-center">
                Total warm water consumption
                </div>
                <div class="bg-gray-200 rounded-md col-start-3 row-start-1 text-gray-800 text-center">
                Total cold water consumption
                </div>

                <div
                class="bg-gray-200 rounded-md col-start-1 row-start-2 row-span-2 text-gray-800 text-center"
                >
                Total graph
                </div>
                <div
                class="bg-gray-200 rounded-md col-start-2 row-start-2 row-span-2 text-gray-800 text-center"
                >
                Warm water graph
                </div>

                <div class="bg-gray-200 rounded-md col-start-3 row-start-2 text-gray-800 text-center">
                Average shower time
                </div>

                <div class="bg-gray-200 rounded-md col-start-3 row-start-3 text-gray-800 text-center">
                You could have saved this many bananas
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
    import { socket } from '@/composables/socket';
    //import statsData from '@/assets/statsData.json';
    
    const menuType = ref('statsTime');
    const navMenuType = ref('main');
    const selectedContent = ref('daily');
/*
    const timeKeys = Object.keys(statsData);

    //AI generated
    const menu = timeKeys.map(key => ({
        name: key.charAt(0).toUpperCase() + key.slice(1),
        link: ''
    }))

    const socket = {
        onMenuData: (_: any) => {},
        emit: (event: string, lang: string) => {
            if (event === 'getMenuData') {
                setTimeout(() =>{
                    socket.onMenuData({
                        statsTime: menu
                    });
                }, 100);
            }
        },
            on: (event: string, callback: any) => {
                if (event === 'menuData') {
                    socket.onMenuData = callback;
            }
        }
    }
*/

    function handleMenuSelect(option: string) {
        selectedContent.value = option.toLowerCase();
    }
    
    </script>
    
    <style scoped>

    </style>
