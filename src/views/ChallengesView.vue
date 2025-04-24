<!--View where user can see all daily, weekly, monthly, and special
     challenges. Current, completed, and future challenges can be
     viewed.
    Total collected points and a direct link to the shop is available.
    There is also a function for the user to change daily challenges.-->
<template>
    <NavComponent :menu="navMenuType" :socket="socket" />
    <div class="grid grid-cols-[168px_1fr] h-screen">
        <!-- Sidebar -->
        <div class="p-4">
        <VerticalMenuComponent :menu="menuType" :socket="socket" @menu-select="handleMenuSelect" />
        </div>

        <div class="p-4 overflow-y-auto space-y-6">
          <div v-if="selectedContent === 'unlockables'">
            <p class="text-lg font-semibold mb-2 m-4">Unlockables</p>
            <div class="unlockList">
              <div v-for="unlock in unlocks" :key="unlock" class="unlockBox">
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
              <div v-for="challenge in challenges" :key="challenge" class="challengesBox">
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
              <div v-for="limited in limiteds" :key="limited" class="limitedBox">
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
</template>

<script setup lang="ts">

import { ref, onMounted } from 'vue';
import VerticalMenuComponent from '@/components/VerticalMenuComponent.vue';
import NavComponent from '@/components/NavComponent.vue';
import { socket } from '@/composables/socket';

const unlocks = ref([]);
const menuType = ref('challenges');
const navMenuType = ref('main');
const selectedContent = ref('active');

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