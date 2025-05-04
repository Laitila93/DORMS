<!--View where user can see more in-depth statisics of water consumption.
    Both pure data and graphs are available, and can be sorted by time.
    Can go in to "fullscreen view" of each graph etc.-->

<template>
    <NavComponent :menu="navMenuType" :socket="socket" />
    <div class="grid grid-cols-[168px_1fr] h-screen">
        <!-- Sidebar -->
        <div class="p-4">
        <!--<VerticalMenuComponent :menu="menuType" :socket="socket" @menu-select="handleMenuSelect" />-->
        </div>
    
        <!-- Main Content Area -->
        <div class="p-4 overflow-y-auto space-y-6">
        <div v-if="selectedContent === 'hourly'">
            <p class="text-lg font-semibold mb-2 m-4">Hourly Stats</p>
            <div class="grid gap-4" :class="['grid-cols-[360px_360px_250px]','grid-rows-[160px_250px_150px]']">
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
                <p>Total water consumption</p>
                <div class="text-6xl justify-center">500 litres</div>
                </div>
                <div class="bg-gray-200 rounded-md col-start-2 row-start-1 text-gray-800 text-center">
                <p>Total warm water consumption</p>
                <div class="text-6xl justify-center">500 litres</div>
                </div>
                <div class="bg-gray-200 rounded-md col-start-3 row-start-1 text-gray-800 text-center">
                Total cold water consumption
                <div class="text-5xl justify-center">500 litres</div>
                </div>

                <div class="bg-gray-200 rounded-md col-start-1 row-start-2 row-span-2 text-gray-800 text-center">
                    <div class="totGraph w-full h-60">
                        <canvas id="totGraph"></canvas>
                    </div>
                </div>
                <div
                class="bg-gray-200 rounded-md col-start-2 row-start-2 row-span-2 text-gray-800 text-center"
                >
                <div class="totGraph w-full h-60">
                        <canvas id="totGraph"></canvas>
                    </div>
                </div>

                <div class="bg-gray-200 rounded-md col-start-3 row-start-2 text-gray-800 text-center">
                Average shower time
                <div class="text-5xl justify-center">8m 15s</div>
                </div>

                <div class="bg-gray-200 rounded-md col-start-3 row-start-3 text-gray-800 text-center">
                You could have saved this many bananas
                <div class="text-5xl justify-center">7,000,000</div>
                </div>
            </div>
        </div>
    
        <div v-else-if="selectedContent === 'weekly'">
            <p class="text-lg font-semibold mb-2">Weekly Stats</p>
            <div class="grid gap-4" :class="['grid-cols-[360px_360px_250px]','grid-rows-[160px_250px_150px]']">
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
                 <canvas id="totGraph" class="w-full h-60"></canvas>
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
    import { ref, onMounted, watch } from 'vue';
    //import VerticalMenuComponent from '@/components/VerticalMenuComponent.vue';
    import NavComponent from '@/components/NavComponent.vue';
    import { socket } from '@/composables/socket';
    import { Chart, registerables } from 'chart.js';

    Chart.register(...registerables);
    
    const menuType = ref('statsTime');
    const navMenuType = ref('main');
    const selectedContent = ref('daily');

    let totChart: Chart|null = null;

    function initTotChart() {
        const canvas = document.getElementById('totGraph') as HTMLCanvasElement|null;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        if (totChart) {
            totChart.destroy();
        }

        totChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['13', '14', '15', '16', '17', '18', '19'],
                datasets: [{
                    label: 'Total consumption',
                    data: [65, 59, 84, 34, 55, 50, 70],
                    fill: false,
                    tension: 0.3,
                    borderWidth: 2,
                    pointRadius: 3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {display:true, text: 'Total Graph'},
                    legend: {position: 'bottom'}
                },
                scales: {
                    x: { title: {display: true, text: 'Hour'}},
                    y: { title: {display: true, text: 'Total consumption'}, suggestedMin:0, suggestedMax: 100}  
                }
            }
        });
    }

    onMounted(() => {
        initTotChart();
    });

    watch(selectedContent, () => {
        setTimeout(initTotChart, 0);
    });

    function handleMenuSelect(option: string) {
        selectedContent.value = option.toLowerCase() as any;
    }
    
    </script>
    
    <style scoped>

    </style>
