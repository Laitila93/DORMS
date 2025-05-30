<!--View where user can see more in-depth statisics of water consumption.
    Both pure data and graphs are available, and can be sorted by time.
    Can go in to "fullscreen view" of each graph etc.-->

<template>
    <div class="flex justify-center content-center space-x-2 mb-2 mt-1">
        <button
            v-for="option in contentOptions"
            :key="option.value"
            @click="selectedContent = option.value"
            class="items-center gap-2 cursor-pointer py-2 px-4 rounded-xl font-semibold transition-colors duration-300"
            :class="selectedContent === option.value
                ? 'bg-primary text-white dark:bg-primary-dark'
                : 'bg-text-dark text-gray-800 dark:bg-secondary-dark dark:text-text-dark hover:bg-primary-dark dark:hover:bg-primary'"
        >
            {{ option.label }}
        </button>
    </div>
    <NavComponent :menu="navMenuType" :socket="socket" class="fixed top-4 right-4"/>
    
        <!-- Main Content Area -->
        <div class="p-4 overflow-y-auto space-y-6">
        <div v-if="selectedContent === 'hourly'">
            <p class="text-lg font-semibold mb-2">Hourly Stats</p>
            <div class="grid gap-4" :class="['grid-cols-[35%_35%_25%]','grid-rows-[150px_150px_150px]']">
                <div class="bg-text-dark rounded-md col-start-1 row-start-1 text-gray-800 text-center">
                    Total water consumption
                </div>
                <div class="bg-text-dark rounded-md col-start-2 row-start-1 text-gray-800 text-center">
                    Total warm water consumption
                </div>
                <div class="bg-text-dark rounded-md col-start-3 row-start-1 text-gray-800 text-center">
                    Total cold water consumption
                </div>
                <div class="bg-text-dark rounded-md col-start-1 row-start-2 row-span-2 text-gray-800 text-center">
                </div>
                <div
                class="bg-text-dark rounded-md col-start-2 row-start-2 row-span-2 text-gray-800 text-center"
                >
                    Warm water graph
                </div>
                <div class="bg-text-dark rounded-md col-start-3 row-start-2 text-gray-800 text-center">
                    Average shower time
                </div>
                <div class="bg-text-dark rounded-md col-start-3 row-start-3 text-gray-800 text-center">
                    You could have saved this many bananas
                </div>
            </div>
        </div>
    
        <div v-else-if="selectedContent === 'daily'">
            <p class="text-lg font-semibold mb-2">Daily Stats</p>
            <div
                class="grid gap-4"
                :class="['grid-cols-[35%_35%_25%]','grid-rows-[150px_150px_150px]']"
            >
                <div class="bg-text-dark rounded-md col-start-1 row-start-1 text-gray-800 text-center">
                <p>Total water consumption</p>
                <div class="text-6xl justify-center mt-4">500 litres</div>
                </div>
                <div class="bg-text-dark rounded-md col-start-2 row-start-1 text-gray-800 text-center">
                <p>Total warm water consumption</p>
                <div class="text-6xl justify-center mt-4">500 litres</div>
                </div>
                <div class="bg-text-dark rounded-md col-start-3 row-start-1 text-gray-800 text-center">
                Total cold water consumption
                <div class="flex-1 flex items-center justify-center">
                    <span class="text-5xl mt-6">1000 litres</span>
                </div>
                </div>

                <div class="bg-text-dark rounded-md col-start-1 row-start-2 row-span-2 text-gray-800 text-center">
                    <div class="totGraph w-full h-60">
                        <canvas id="totGraph"></canvas>
                        <button @click="showTotGraphModal = true">Expand</button>
                    </div>
                </div>
                <div
                class="bg-text-dark rounded-md col-start-2 row-start-2 row-span-2 text-gray-800 text-center"
                >
                <div class="warmGraph w-full h-60">
                        <canvas id="warmGraph"></canvas>
                        <button @click="showWarmGraphModal = true">Expand</button>
                    </div>
                </div>

                <div class="bg-text-dark rounded-md col-start-3 row-start-2 text-gray-800 text-center">
                Average shower time
                <div class="text-5xl justify-center mt-6">8m 15s</div>
                </div>

                <div class="bg-text-dark rounded-md col-start-3 row-start-3 text-gray-800 text-center">
                You could have saved this many bananas
                <div class="text-5xl justify-center mt-6">7,000,000</div>
                </div>
            </div>
        </div>
    
        <div v-else-if="selectedContent === 'weekly'">
            <p class="text-lg font-semibold mb-2">Weekly Stats</p>
            <div class="grid gap-4" :class="['grid-cols-[35%_35%_25%]','grid-rows-[150px_150px_150px]']">
                <div class="bg-text-dark rounded-md col-start-1 row-start-1 text-gray-800 text-center">
                    Total water consumption
                </div>
                <div class="bg-text-dark rounded-md col-start-2 row-start-1 text-gray-800 text-center">
                    Total warm water consumption
                </div>
                <div class="bg-text-dark rounded-md col-start-3 row-start-1 text-gray-800 text-center">
                    Total cold water consumption
                </div>
                <div
                class="bg-text-dark rounded-md col-start-1 row-start-2 row-span-2 text-center"
                >
                <div class="totGraph">
                 <canvas id="totGraph" class="w-full h-60"></canvas>
                </div>
                </div>
                <div
                class="bg-text-dark rounded-md col-start-2 row-start-2 row-span-2 text-gray-800 text-center"
                >
                Warm water graph
                </div>

                <div class="bg-text-dark rounded-md col-start-3 row-start-2 text-gray-800 text-center">
                Average shower time
                </div>

                <div class="bg-text-dark rounded-md col-start-3 row-start-3 text-gray-800 text-center">
                You could have saved this many bananas
                </div>
            </div>
        </div>
    
        <div v-else-if="selectedContent === 'monthly'">
            <p class="text-lg font-semibold mb-2">Monthly Stats</p>
            <div
                class="grid gap-4"
                :class="['grid-cols-[35%_35%_25%]','grid-rows-[150px_150px_150px]']">
                <div class="bg-text-dark rounded-md col-start-1 row-start-1 text-gray-800 text-center">
                    Total water consumption
                </div>
                <div class="bg-text-dark rounded-md col-start-2 row-start-1 text-gray-800 text-center">
                    Total warm water consumption
                </div>
                <div class="bg-text-dark rounded-md col-start-3 row-start-1 text-gray-800 text-center">
                    Total cold water consumption
                </div>
                <div class="bg-text-dark rounded-md col-start-1 row-start-2 row-span-2 text-gray-800 text-center">
                </div>
                <div class="bg-text-dark rounded-md col-start-2 row-start-2 row-span-2 text-gray-800 text-center">
                    Warm water graph
                </div>
                <div class="bg-text-dark rounded-md col-start-3 row-start-2 text-gray-800 text-center">
                    Average shower time
                </div>
                <div class="bg-text-dark rounded-md col-start-3 row-start-3 text-gray-800 text-center">
                    You could have saved this many bananas
                </div>
            </div>
        </div>
    
        <div v-else>
            <p class="text-lg">Please select a time range</p>
        </div>
        </div>
        <ModalComponent v-model="showTotGraphModal">
            I LOVE GRAPHS
        </ModalComponent>
        <ModalComponent v-model="showWarmGraphModal">
            HOT
        </ModalComponent>
    </template>
    
    <script setup lang="ts">
    //interface DailyConsumption {
    //    date: string;
    //    amount: number;
    //}


    import { ref, onMounted, watch } from 'vue';
    import NavComponent from '@/components/NavComponent.vue';
    import { getSocket } from '@/composables/socket';
    const socket = getSocket(); // Import the socket instance from socket.ts
    import { Chart, registerables } from 'chart.js';
    import 'chartjs-adapter-date-fns';
    import ModalComponent from '@/components/ModalComponent.vue';
    import { time } from 'console';
    import type { DailyConsumption } from '@/composables/prototypes/pointsPrototype';

    Chart.register(...registerables);

    const showWarmGraphModal = ref(false);
    const showTotGraphModal = ref(false);
    const navMenuType = ref('tank');
    const selectedContent = ref('daily');

    const contentOptions = [
        { label: 'Hourly', value: 'hourly' },
        { label: 'Daily', value: 'daily' },
        { label: 'Weekly', value: 'weekly' },
        { label: 'Monthly', value: 'monthly' }
    ];

    let totChart: Chart|null = null;
    let warmChart: Chart|null = null;

    function initTotChart() {
        const canvas = document.getElementById('totGraph') as HTMLCanvasElement|null;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        if (totChart) {
            totChart.destroy();
        }

        totChart = new Chart<'line'> (ctx, {
            type: 'line',
            data: {
                datasets: [{
                    label: 'Total consumption',
                    data: [] as any,
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
                    x: { type:'time', time: {parser: "yyyy-MM-dd'T'HH:mm:ssXXX", unit: 'hour', displayFormats: {hour: 'HH:mm'}, tooltipFormat: 'HH:mm'  }, ticks: {stepSize: 1}, title:{display: true, text: 'Hour'}},
                    y: { beginAtZero: true, title: {display: true, text: 'Total consumption'}, suggestedMin:0, suggestedMax: 100}  
                }
            }
        });
    };

    function initWarmChart() {
        const canvas = document.getElementById('warmGraph') as HTMLCanvasElement|null;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        if (warmChart) {
            warmChart.destroy();
        }

        warmChart = new Chart(ctx, {
            type: 'line',
            data: {
                datasets: [{
                    label: 'Total warm water consumption',
                    data: [],
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
                    title: {display:true, text: 'Warm water Graph'},
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
        initWarmChart();
    });

    watch(selectedContent, () => {
        setTimeout(initTotChart, 0);
        setTimeout(initWarmChart, 0);
    });

    socket.on('dailyConsumption', (arr: DailyConsumption[]) => {
        if (!totChart) return;
        (totChart.data.datasets[0].data as unknown as {x: string; y: number}[]) = arr.map(item => ({
            x: item.date,
            y: item.amount,
        }));
        totChart.update();
    });
    
    </script>
    
    <style scoped>

    </style>
