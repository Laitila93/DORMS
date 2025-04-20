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
            <!-- Placeholder for hourly graph -->
            <div class="h-full w-full items-center justify-center gap-4 p-4">
                <div class="grid grid-cols-4 grid-rows-3 gap-10 items-center justify-center">
                    <div class="col-start-1 bg-gray-200 text-gray-800 rounded-md">Total water consumption</div>
                    <div class="col-start-2 bg-gray-200 text-gray-800 rounded-md">Total warm water consumption</div>
                    <div class="col-start-3 bg-gray-200 text-gray-800 rounded-md">Total cold water consumption</div>
                    <div class="row-span-2 col-start-1 row-start-2 bg-gray-200 text-gray-800 rounded-md">Total graph</div>
                    <div class="row-span-2 col-start-2 row-start-2 bg-gray-200 text-gray-800 rounded-md">Warm water graph</div>
                    <div class="col-start-3 row-start-3 bg-gray-200 text-gray-800 rounded-md">You could have saved this many bananas</div>
                    <div class="col-start-3 row-start-2 bg-gray-200 text-gray-800 rounded-md">Average shower time</div>
                </div>
            </div>
        </div>
    
        <div v-else-if="selectedContent === 'daily'">
            <p class="text-lg font-semibold mb-2">Daily Stats</p>
            <!-- Placeholder for daily graph -->
            <div class="h-full w-full items-center justify-center gap-4 p-4">
                <div class="grid grid-cols-4 grid-rows-3 gap-10 items-center justify-center">
                    <div class="col-start-1 bg-gray-200 text-gray-800 rounded-md">Total water consumption</div>
                    <div class="col-start-2 bg-gray-200 text-gray-800 rounded-md">Total warm water consumption</div>
                    <div class="col-start-3 bg-gray-200 text-gray-800 rounded-md">Total cold water consumption</div>
                    <div class="row-span-2 col-start-1 row-start-2 bg-gray-200 text-gray-800 rounded-md">Total graph</div>
                    <div class="row-span-2 col-start-2 row-start-2 bg-gray-200 text-gray-800 rounded-md">Warm water graph</div>
                    <div class="col-start-3 row-start-3 bg-gray-200 text-gray-800 rounded-md">You could have saved this many bananas</div>
                    <div class="col-start-3 row-start-2 bg-gray-200 text-gray-800 rounded-md">Average shower time</div>
                </div>
            </div>
        </div>
    
        <div v-else-if="selectedContent === 'weekly'">
            <p class="text-lg font-semibold mb-2">Weekly Stats</p>
            <!-- Placeholder for weekly graph -->
            <div class="h-full w-full items-center justify-center gap-4 p-4">
                <div class="grid grid-cols-4 grid-rows-3 gap-10 items-center justify-center">
                    <div class="col-start-1 bg-gray-200 text-gray-800 rounded-md">Total water consumption</div>
                    <div class="col-start-2 bg-gray-200 text-gray-800 rounded-md">Total warm water consumption</div>
                    <div class="col-start-3 bg-gray-200 text-gray-800 rounded-md">Total cold water consumption</div>
                    <div class="row-span-2 col-start-1 row-start-2 bg-gray-200 text-gray-800 rounded-md">Total graph</div>
                    <div class="row-span-2 col-start-2 row-start-2 bg-gray-200 text-gray-800 rounded-md">Warm water graph</div>
                    <div class="col-start-3 row-start-3 bg-gray-200 text-gray-800 rounded-md">You could have saved this many bananas</div>
                    <div class="col-start-3 row-start-2 bg-gray-200 text-gray-800 rounded-md">Average shower time</div>
                </div>
            </div>
        </div>
    
        <div v-else-if="selectedContent === 'monthly'">
            <p class="text-lg font-semibold mb-2">Monthly Stats</p>
            <!-- Placeholder for monthly graph -->
            <div class="h-full w-full items-center justify-center gap-4 p-4">
                <div class="grid grid-cols-4 grid-rows-3 gap-10 items-center justify-center">
                    <div class="col-start-1 bg-gray-200 text-gray-800 rounded-md">Total water consumption</div>
                    <div class="col-start-2 bg-gray-200 text-gray-800 rounded-md">Total warm water consumption</div>
                    <div class="col-start-3 bg-gray-200 text-gray-800 rounded-md">Total cold water consumption</div>
                    <div class="row-span-2 col-start-1 row-start-2 bg-gray-200 text-gray-800 rounded-md">Total graph</div>
                    <div class="row-span-2 col-start-2 row-start-2 bg-gray-200 text-gray-800 rounded-md">Warm water graph</div>
                    <div class="col-start-3 row-start-3 bg-gray-200 text-gray-800 rounded-md">You could have saved this many bananas</div>
                    <div class="col-start-3 row-start-2 bg-gray-200 text-gray-800 rounded-md">Average shower time</div>
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
    
    const menuType = ref('statsTime');
    const navMenuType = ref('main');
    const selectedContent = ref('daily');

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


    function handleMenuSelect(option: string) {
        selectedContent.value = option.toLowerCase();
    }
    
    </script>
    
    <style scoped>

    </style>
