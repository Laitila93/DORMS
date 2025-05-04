<template>
  <div
    class="absolute"
    :class="{ 'glow-effect': fishIsBeingStyled }"
    :style="{
      top: `${fishY}px`,
      left: `${fishX}px`,
      transition: 'top 5s, left 5s, z-index 5s',
      zIndex: `${fishZ}`
    }"
    @click="() => {fishClicked()}"
  >
    <!--Selected Fish and Hat swimming around in tank-->
    <div class="fish-wiggle">
      <!--Fish -->
      <img
      v-if="fish"
      :key="fish.name"
      :src="fish.image"
      :alt="fish.name"
      class="w-24 h-24 object-contain "
      :style="{ transform: isFlipped ? 'scaleX(-1)' : 'scaleX(1)' }"
      />
      <!-- Hat -->
      <img
        v-if="hat"
        :key="hat.name"
        :src="hat.image"
        :alt="hat.name"
        class="w-12 absolute"
        :style="{
          top: '-15px',
          left: '50%', // Center the hat horizontally
          transform: 'translateX(-50%)', // Adjust to center relative to the fish
        }"
      />
    </div>

    <!-- Hat Selector Box -->
    <div
      v-if="showHatSelector"
      class="absolute z-50 bg-white/40 border border-gray-300 p-4 rounded-xl w-64 h-60 flex flex-col items-center backdrop-blur-md"
      style="top: -220px; left: -250px;"
    >
      <div class="relative flex items-center justify-center w-full h-32">
        <button @click.stop="prevHat"  class="bg-blue-400 hover:bg-blue-500 text-white font-bold text-2x1 px-4 py-1 rounded-full shadow transition duration-300">
          ←
        </button>
        <img
          v-if="currentHat"
          :src="currentHat.image"
          :alt="currentHat.name"
          class="h-24 object-contain"
        />
        <div v-else class="text-gray-500 flex justify-center items-center w-24 h-24 font-bold">
          No hat
        </div>
        <button @click.stop="nextHat" class="bg-blue-400 hover:bg-blue-500 text-white font-bold text-2x1 px-4 py-1 rounded-full shadow transition duration-300">
          →
        </button>
      </div>
      <div class="mt-2 h-5 text-sm font-semibold">
        <p v-if="currentHat">
          {{ currentHat.name }}
        </p>
      </div>
      <button v-if="isHatAvailable" @click.stop="applyHat" class="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded">
        Select
      </button>
    </div>

    <!-- Fish Selector Box -->
    <div
      v-if="showFishSelector"
      class="absolute z-50 bg-white/40 border border-gray-300 p-4 rounded-xl w-64 h-60 flex flex-col items-center backdrop-blur-md"
      style="top: -220px; left: 50px;"
    >
      <div class="relative flex items-center justify-center w-full h-32">
        <button @click.stop="prevFish"  class="bg-blue-400 hover:bg-blue-500 text-white font-bold text-2x1 px-4 py-1 rounded-full shadow transition duration-300">←</button>

        <img
          v-if="currentFish"
          :src="currentFish.image"
          :alt="currentFish.name"
          class="h-24 object-contain"
        />
        <button @click.stop="nextFish" class="bg-blue-400 hover:bg-blue-500 text-white font-bold text-2x1 px-4 py-1 rounded-full shadow transition duration-300">→</button>
      </div>
      <p class="mt-2 text-sm font-semibold" v-if="currentFish">
        {{ currentFish.name }}
      </p>
      <button v-if="isFishAvailable" @click.stop="applyFish" class="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded">
        Select
      </button>
    </div>

  </div>

</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
import { useShopData } from '@/composables/useShopData'; // Import the composable for shop data
import { socket } from '@/composables/socket';

const props = defineProps<{
  fishType: string;
  hatType: string;
  socket: any; // optional now, unused
  waterBounds: DOMRect | null;
  position: number;
  rockBounds: DOMRect | null;
}>();

const { shopData, shopUnlocks, equippedData, corridorId, xpScore } = useShopData();
const fishX = ref(100);
const fishY = ref(100);
const fishZ = ref(20); // Z-index for the fish, to be used for stacking order
const isFlipped = ref(false); // Tracks whether the fish is flipped
let fish = ref(shopData.value?.fish.find(f => f.name === props.fishType) || null);
let hat = ref(shopData.value?.hats.find(h => h.name === props.hatType) || null);

const fishIsBeingStyled = ref(false);
const showHatSelector = ref(false);
const showFishSelector = ref(false);
const currentHatIndex = ref<number>(-1); // -1 = no hat
const currentFishIndex = ref<number>(0); 


const toggleHatSelector = () => {
  showHatSelector.value = !showHatSelector.value;
};

const toggleFishSelector = () => {
  showFishSelector.value = !showFishSelector.value;
};

const currentHat = computed(() => {
  if (!shopData.value || !shopData.value.hats.length || currentHatIndex.value === -1) return null;
  return shopData.value.hats[currentHatIndex.value];
});
const currentFish = computed(() => {
  if (!shopData.value || !shopData.value.fish.length || currentFishIndex.value === -1) return null;
  return shopData.value.fish[currentFishIndex.value];
});

function fishClicked() {
  // Move fish to styling position if it's not already being styled
  if (!fishIsBeingStyled.value) {
    fishIsBeingStyled.value = true;
    moveFish(true);

    // Show the hat and fish selectors after the fish has moved to styling position
    setTimeout(() => {
      toggleHatSelector();
      toggleFishSelector();
    }, 5000)
  }
  else {
    // If fish is already being styled, close the selectors and reset the styling state, and move fish to random position
    showHatSelector.value = false;
    showFishSelector.value = false;
    fishIsBeingStyled.value = false;

  }

}
  

function prevHat() {
  if (!shopData.value || !shopData.value.hats.length) return;

  if (currentHatIndex.value === -1) {
    currentHatIndex.value = shopData.value.hats.length - 1;
  } else {
    currentHatIndex.value -= 1;
    if (currentHatIndex.value < -1) {
      currentHatIndex.value = shopData.value.hats.length - 1;
    }
  }
}

function prevFish() {
  if (!shopData.value || !shopData.value.fish.length) return;
  currentFishIndex.value =
    (currentFishIndex.value - 1 + shopData.value.fish.length) % shopData.value.fish.length;
}


function nextHat() {
  if (!shopData.value || !shopData.value.hats.length) return;

  currentHatIndex.value = (currentHatIndex.value + 1) % (shopData.value.hats.length + 1);
  if (currentHatIndex.value === shopData.value.hats.length) {
    currentHatIndex.value = -1; // Back to "no hat"
  }
}

function nextFish() {
  if (!shopData.value || !shopData.value.fish.length) return;
  currentFishIndex.value = (currentFishIndex.value + 1) % shopData.value.fish.length;
}

function applyHat() {
  hat.value = currentHat.value || null;;
  showHatSelector.value = false;
  if (!showFishSelector.value) {
    fishIsBeingStyled.value = false; // Reset the styling state when hat has been selected, IF fish selector is not open
  }
  socket.emit('updateHat', { hatID: currentHat.value?.hatID, position: props.position, corridorId: corridorId }); //send new hat to server
  socket.emit('getEquipped', corridorId); //load new value from database
}

function applyFish() {
  fish.value = currentFish.value || null;;
  showFishSelector.value = false;
  if (!showHatSelector.value) {
    fishIsBeingStyled.value = false; // Reset the styling state when fish has been selected, IF hat selector is not open
  }
  socket.emit('updateFish', { fishID: currentFish.value?.fishID, position: props.position, corridorId: corridorId });
  socket.emit('getEquipped', corridorId);
}

const isHatAvailable = computed(() => {
  if (xpScore.value >= currentHat.value?.price) return true; 
  //lines below can still be used for special unlocks stored on shopUnlocks on database.
  if (!shopUnlocks.value || !shopUnlocks.value.hats) return false;
    for (const unlockedHat of shopUnlocks.value.hats) {
      if (unlockedHat === currentHatIndex.value + 1 || currentHatIndex.value === -1) { //
        return true;
      }
    }
    return false;
})

const isFishAvailable = computed(() => {
  if (xpScore.value >= currentFish.value?.price) return true;
  //lines below can still be used for special unlocks stored on shopUnlocks on database.
    for (const unlockedFish of (shopUnlocks.value?.fish || [])) {
      if (unlockedFish === currentFishIndex.value + 1 || currentFishIndex.value === -1) {
        return true;
      }
    }
    return false;
})

onMounted(() => {
  scheduleMoveFish(); // Start the random movement of the fish
});

// Watch for changes in props
watch(() => props.fishType, () => {
  fish.value = findFish() || null;
});
watch(() => props.hatType, () => {
  hat.value = findHat() || null;
});

function findFish() {
  const fishes = shopData.value?.fish.find(f => f.name === props.fishType);
  return fishes;
}

function findHat() {
  const hat = shopData.value?.hats.find(h => h.name === props.hatType) || null;
  return hat;
}

// Fish movement Logic: Move fish within current waterlevel bounds.
// Default is when fish is not clicked (random movement), when clicked the fish moves to the center of the water bounds

function moveFish(clicked:boolean = false) {
  const waterBounds = props.waterBounds;

 
  if (!waterBounds) return;  // Catch if tank bounds is not defined due to not being int the DOM yet or not passed correctly

  const fishWidth = 96; // w-24 and h-24 in tailwind = 96px
  const fishHeight = 96; 

  // If fish is clicked, move it to the center of the water bounds
  if(clicked){
    
    
    const centerX = (waterBounds.width - fishWidth) / 2;
    const centerY = (waterBounds.height - fishHeight) / 2;

    if (centerX < fishX.value) {
      isFlipped.value = true;
    } else {
      isFlipped.value = false;
    }
    fishX.value = centerX;
    fishY.value = centerY;
    fishZ.value = 100; // Bring the fish to the front when clicked

    return;
  }

  updateZIndexBasedOnRock(); // Update fish z-index for "3D-effect"
  
  const newX = Math.round(Math.random() * (waterBounds.width - fishWidth));
  const newY = Math.round(Math.random() * (waterBounds.height - fishHeight));

  // Update the fish orientation before changing position
  if (newX < fishX.value) {
    isFlipped.value = true;
  } else {
    isFlipped.value = false;
  }

  // Update position values - the CSS transition will apply to these changes
  fishX.value = newX;
  fishY.value = newY;
}

// Set-z-index-logic 
function updateZIndexBasedOnRock() {

  if(!props.waterBounds || !props.rockBounds) { //only execute if water- and rockBounds are passed properly and exist in DOM
    return
  }

  else { 

    //Set up rock's and fish's rectangles in order to determine overlap
    const rockRect = {
      x: props.rockBounds.left - props.waterBounds.left, //Accounting for rock's offset relative to parent (water),
      y: props.rockBounds.top - props.waterBounds.top, //since getBoundingClientRect() doesn't account for this
      width: props.rockBounds.width,
      height: props.rockBounds.height
    };

    const fishRect = {
      x: fishX.value,
      y: fishY.value,
      width: 96,
      height: 96
    };

    //Check if fish is overlapping rock (if we don't do this fish will clip through the rock!)
    const isOverlapping = (fishRect.x + fishRect.width > rockRect.x) && (fishRect.x < rockRect.x + rockRect.width); 
    
    if(!isOverlapping) { //If fish is not overlapping, set new z-value between 0 and 100 
      fishZ.value = Math.round(Math.random() * 100);
    }

  }

}


function scheduleMoveFish() {
  const randomDelay = Math.random() * 9000 + 2000; // Random delay between 2s and 11s
  setTimeout(() => {
    // Move the fish if it's not being styled
    if (!fishIsBeingStyled.value) {
      moveFish();
    }
    scheduleMoveFish(); // Schedule the next move
  }, randomDelay);
}
</script>

<style scoped>
.toggle-button{ /*Not used right now*/
  color: white;
  font-size: x-large;
  background-color: blue;
}

.glow-effect {
  background-color: rgba(255, 223, 0, 0.8); 
  box-shadow: 
    0 0 30px 10px rgba(255, 223, 0, 0.8), 
    0 0 60px 20px rgba(255, 200, 0, 0.6), 
    0 0 100px 40px rgba(255, 180, 0, 0.4); 
  border-radius: 50%; 
  transition: box-shadow 0.5s ease-in-out, background-color 0.5s ease-in-out; /* Smooth transitions */
}


/*Alternative glow effect

.glow-effect {
  background-color: rgba(0, 255, 255, 0.5);
  box-shadow: 0 0 20px 5px rgba(0, 255, 255, 0.8);
  border-radius: 50%;
  transition: box-shadow 0.9s ease-in-out;
}
*/

@keyframes swim-wiggle {
  0%, 100% {
    transform: rotate(0deg) skewX(0deg) translateY(0px);
  }
  25% {
    transform: rotate(2deg) skewX(3deg) translateY(-3px);
  }
  50% {
    transform: rotate(0deg) skewX(0deg) translateY(0px);
  }
  75% {
    transform: rotate(-2deg) skewX(-3deg) translateY(3px);
  }
}

.fish-wiggle {
  animation: swim-wiggle 3s infinite ease-in-out;
}
</style>