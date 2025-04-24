<!--This is the leaderboard view, showing the tenants how their dorm corridor's water consumption compares
to the other corridors in the building. It contains a header with information on what it shows 
(for testing) and data visualization of the water consumption. This file contains code to retrieve water consumption data 
from server, a very simple algorithm to compute each corridor's score, and ref()s variables to update the data visualization 
graphic component. This component is named 'RaceComponent'which presents the water consumption in the form of a bar chart. 

----TBD-----

** 1. The algorithm to compute the score is very simple, and should be improved when the format of water consumption data is 
      more clear. Right now it just takes the difference between today and yesterday's water consumption. The data format used
      as a test is in the commented out section at the bottom of this file.
** 2. The data visualization component is to be changed into something more exciting, the plan right now is a swimming race 
** 3. The leaderboard page is to be changed into a more exciting page, with a leaderboard and some other fun stuff.
** 4. Decide on what menu links should be in the side menu. Right now it is a placeholder.
** 5. How often should the leaderbord be updated?

------------

//Emil 20th of april-->

<template>

  <div class="flex flex-col min-h-screen w-screen">
  
    <header class="p-4 text-center">
      <h1 class="text-2xl font-bold">Welcome to DORMS Leaderboard</h1>
      <p class="text-lg">Here you can see who currently leads the race!</p>
    </header>
      
    <main class="flex flex-col flex-1 justify-center items-center px-4">
      <RaceComponent :data="leaderboardData" />
    </main>
    
    <NavComponent :socket="socket" :menu="menuType" />
  
  </div>
  
</template>
  
<script setup lang="ts">

  import NavComponent from '@/components/NavComponent.vue';
  import { ref, onMounted } from 'vue';
  import { socket } from '@/composables/socket';
  import RaceComponent from '@/components/RaceComponent.vue';

  const menuType = ref('tank'); //Menu version for the NavComponent (side menu). Can be changed to other menu types in the future.
  const leaderboardData = ref<DormScore[]>([]); //Internal data structure to store the leaderboard data and pass it to the RaceComponent
  const mainWaterLog = ref<Record<string, WaterLogItem[]>>({});

  onMounted(() => {
    socket.emit("getWaterData"); 
    socket.on("waterData", (records: Record<string, WaterLogItem[]>) => {
      mainWaterLog.value = records; //fetch water consumption data from server
      console.log("Received water data:", mainWaterLog.value);
      for (const dorm in mainWaterLog.value) {
        const dormObject: WaterLogItem = mainWaterLog.value[dorm][0]; //get the first object in the array for each dorm
        const today = dormObject.today;
        const yesterday = dormObject.yesterday;
        //leaderboardData.value.push({dormName: dorm, score: yesterday - today}) 
        /*  - simple calculation of dorm water consumption score, to be improved.
              Right now the last line is commented out, as I want to test the data 
              visualization component first using randomized values, see below.
        */
      }
    });
      // Handle errors
      socket.on("error", (error: { message: string }) => {
        console.error("Error from server:", error.message);
        }
      );


      // Test RaceComponent visualization
      leaderboardData.value = [
        { dormName: 'Dorm 1', score: 50 },
        { dormName: 'Dorm 2', score: 70 },
        { dormName: 'Dorm 3', score: 30 },
      ];

      setInterval(() => {
        // Randomize new leaderboard data every third second for testing RaceComponent transition
        leaderboardData.value = [
          { dormName: 'Dorm 1', score: 20 + Math.floor(Math.random() * 70) },
          { dormName: 'Dorm 2', score: 20 + Math.floor(Math.random() * 70) },
          { dormName: 'Dorm 3', score: 20 + Math.floor(Math.random() * 70) },
        ];
      }, 3000); 
  });


  type DormScore = {
    dormName: string;
    score: number;
  }

  type WaterLogItem = {
    today: number;
    yesterday: number;
  };

</script>

<!--This is the data format used for testing. It is a simple object with dorm names as keys and an array of objects as values.

{
  "dorm1": [
      { "today": 300, "yesterday": 500 }
    ],
  "dorm2": [
      { "today": 200, "yesterday": 250 }
  ],
  "dorm3": [
      { "today": 400, "yesterday": 700 }
  ]
  
}
-->  
