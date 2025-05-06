<!--View where user can see all daily, weekly, monthly, and special
     challenges. Current, completed, and future challenges can be
     viewed.
    Total collected points and a direct link to the shop is available.
    There is also a function for the user to change daily challenges.-->
<template>
    <NavComponent :menu="navMenuType" :socket="socket" />
    <div class="text-2xl justify-center mt-4 ml-4">Unlockables and challenges</div>
    <div class="grid gap-4 m-2 ml-4" :class="['grid-cols-[67%_27%]','grid-rows-[100px_145px_300px]']">
      <div class="bg-gray-200 rounded-md col-start-1 row-start-1 text-gray-800 text-center">
        Progress bar, XP required to next level
      </div>
      <div class="bg-gray-200 rounded-md col-start-2 row-start-1 text-gray-800 text-center">
        Current level: 10
      </div>
      <div class="bg-gray-200 rounded-md col-start-1 row-start-2 row-span-2 text-gray-800 text-center">
      <div class="p-4 overflow-y-auto space-y-6">
          <div v-if="selectedContent === 'unlockables'">
            <p class="text-lg font-semibold mb-2 m-4">Unlockables</p>
            <div class="unlockList">
              <div v-for="unlock in unlocks" :key="unlock.name" class="unlockBox">
                <div class="unlockName">{{unlock.name}}</div>
                  <div class="unlockDescription">{{ unlock.desc }}</div>
                  <div class="unlockLevel">{{ unlock.level }}</div>
                  <img :src="unlock.image"
                      style="
                          height: 4rem;
                          width: 4rem;
                          padding: 0.25rem"
                      alt="miniavatar"
                      class="mini-avatar">
              </div>
            </div>
            <p class="text-lg font-semibold mb-2 m-4">Current level</p>
            <p class="text-lg font-semibold mb-2 m-4">{{ currentLevel }}</p>

          </div>
          <div v-else-if="selectedContent === 'challenges'">
            <p class="text-lg font-semibold mb-2 m-4">Special challenges</p>
            <div class="challengesList">
              <div v-for="challenge in challenges" :key="challenge.name" class="challengesBox">
                <div class="challengesName">{{challenge.name}}</div>
                  <div class="challengesDescription">{{ challenge.desc }}</div>
                  <img :src="challenge.image"
                      style="
                          height: 4rem;
                          width: 4rem;
                          padding: 0.25rem"
                      alt="miniavatar"
                      class="mini-avatar">
                  <<!--insert progressbar-->
                  <div class="progressContainer">
                    <div class="progressBar">
                      <div class="progress"><span>{{ progress.percentage }}</span></div>
                    </div>

                  </div>
              </div>
            </div>
            <p class="text-lg font-semibold mb-2 m-4">Limited time challenges</p>
            <div class="limitedList">
              <div v-for="limited in limiteds" :key="limited.name" class="limitedBox">
                <div class="limitedName">{{limited.name}}</div>
                  <div class="limitedDescription">{{ limited.desc }}</div>
                  <img :src="limited.image"
                      style="
                          height: 4rem;
                          width: 4rem;
                          padding: 0.25rem"
                      alt="miniavatar"
                      class="mini-avatar">
                  <<!--insert progressbar-->
                  <div class="limitedTime">{{ limited.timeLeft }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="bg-gray-200 rounded-md col-start-2 row-start-2 text-gray-800 text-center">
        <img src="https://i.imgur.com/wJlZ3MF.png" alt="lionlimited" class="rounded-md justify-center">
        <!--Add animation fish, getfishdata-->
      </div>
      <div class="bg-gray-200 rounded-md col-start-2 row-start-3 text-gray-800 text-center">
        CHALLENGES
      </div>
      </div>
</template>

<script setup lang="ts">

import { ref, onMounted } from 'vue';
import NavComponent from '@/components/NavComponent.vue';
import { socket } from '@/composables/socket';

interface Unlock {
  name: string;
  desc: string;
  level: number;
  image: string;
}

const unlocks = ref<Unlock[]>([]);
const challenges = ref([
  { name: 'Special Challenge 1', desc: 'Special Description 1', image: '' },
  { name: 'Special Challenge 2', desc: 'Special Description 2', image: '' }
]);

const limiteds = ref([
  { name: 'Challenge 1', desc: 'Description 1', image: '', timeLeft: '2 days' },
  { name: 'Challenge 2', desc: 'Description 2', image: '', timeLeft: '5 days' }
]);
const navMenuType = ref('tank');
const selectedContent = ref('active');
const progress = ref({ percentage: '50%' }); // Example progress data
const currentLevel = ref(1); // Example initial value for currentLevel

onMounted(async () => {
  const res = await fetch('/data/unlocks.json')
  unlocks.value = await res.json()
})

function handleMenuSelect(option: string) {
    selectedContent.value = option;
  }
</script>

<style scoped>
.unlockList{
  font-size: large;
  font-weight: 600;
  display: flex;
  flex-direction: column;
  list-style: none;
  padding: 0;
  height: 18rem;
  overflow-y: scroll;
  overflow-x: hidden;
  gap:8px;
}

.unlockName{
  width: 9rem;
  box-shadow: inset 0px -5px 0px #e0be36;
  margin-top: 1rem;
  height: 0.5rem;
  display:flex;
  align-items: center;
  padding:1rem;
  text-overflow: ellipsis;
}

.unlockLevel {
  width: 8rem;
  box-shadow: inset 0px -5px 0px 0px #e0be36;
  margin-top: 1rem;
  height: 0.5rem;
  display:flex;
  align-items: center;
  padding:1rem;
  text-overflow: ellipsis;
}

.mini-avatar{
  width: 7rem;
  height: 7rem;
  border: none;
  border-radius: 1rem;
}

.unlockBox {
  display: flex;
  text-align: center;
  justify-content: space-around;
  background-color: var(--p-offWhite);
  border-radius: 8px;
  font-family: "Inter", sans-serif;
  margin-right: 1rem;
  box-shadow: 0px 2px 5px rgba(0,0,0,0.1);
  border-bottom: 1px var(--p-offWhite) solid;

}

.progressContainer {
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.progressBar {
  width: 600px;
  height: 10x;
  border-radius: 5px
}

.progressBar div {
  height: 10px;
  border-radius: 5px;
  width: 50%;
  background: green;
}

.progressBar div span {
  height: 40px;
  width: 40px;
  border-radius: 50%;
}

</style>