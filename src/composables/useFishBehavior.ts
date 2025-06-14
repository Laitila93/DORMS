import { ref, computed, watch } from 'vue';
import { useShopData } from '@/composables/useShopData';
import { useScoreData } from '@/composables/useScoreData';
import { getSocket } from '@/composables/socket';
const socket = getSocket(); // Import the socket instance from socket.ts

export function useFishBehavior(props: {
  fishType: string;
  hatType: string;
  waterBounds: DOMRect | null;
  position: number;
  rockBounds: DOMRect | null;
  isBlurred: boolean;
}) {
  const { shopData, shopUnlocks, dormID } = useShopData(socket);
  const { xpScore } = useScoreData(socket);

  const fishX = ref(800); // Hard coded initial posistion, behind the rock x pos
  const fishY = ref(400); // Hard coded initial position, behind the rock y pos
  const fishZ = ref(20);
  const randomScale = ref(1);
  const isFlipped = ref(false);

  // load fish and hats from shopdata
  const fish = ref(shopData.value?.fish.find(f => f.name === props.fishType) || null);
  const hat = ref(shopData.value?.hats.find(h => h.name === props.hatType) || null);

  const fishIsBeingStyled = ref(false);
  const showHatSelector = ref(false);
  const showFishSelector = ref(false);

  // indeces used by fish and hat selectors
  const currentHatIndex = ref<number>(-1);
  const currentFishIndex = ref<number>(0);

  // Watch for shopData and hat to initialize the selector index
  watch([shopData, hat], () => {
    if (!shopData.value || !hat.value) return;
  
    const idx = shopData.value.hats.findIndex(h => h.hatID === hat.value?.hatID);
    if (idx !== -1) currentHatIndex.value = idx;
  }, { immediate: true });
  
  // Watch currentHatIndex to update the selected hat
  watch(currentHatIndex, (newIdx) => {
    if (shopData.value && shopData.value.hats[newIdx]) {
      hat.value = shopData.value.hats[newIdx];
    }
  });
  // Watch for shopData and fish to initialize the selector index
  watch([shopData, fish], () => {
    if (!shopData.value || !fish.value) return;

    const idx = shopData.value.fish.findIndex(f => f.fishID === fish.value?.fishID);
    if (idx !== -1) currentFishIndex.value = idx;
  }, { immediate: true });

  watch(currentFishIndex, (newIdx) => {
    if (shopData.value && shopData.value.fish[newIdx]) {
      fish.value = shopData.value.fish[newIdx];
    }
  });
  
  // Sort fish and hats by price for selectors
  const sortedFish = shopData.value?.fish.sort((a, b) => a.price - b.price) || [];
  const sortedHats = shopData.value?.hats.sort((a, b) => a.price - b.price) || [];

  // Current fish and hat computed properties to show metadata 
  const currentHat = computed(() => {
    if (!shopData.value || !shopData.value.hats.length || currentHatIndex.value === -1) return null;
    return sortedHats[currentHatIndex.value];
  });

  const currentFish = computed(() => {
    if (!shopData.value || !shopData.value.fish.length || currentFishIndex.value === -1) return null;
    return sortedFish[currentFishIndex.value];
  });

  function toggleHatSelector() {
    showHatSelector.value = !showHatSelector.value;
  }

  function toggleFishSelector() {
    showFishSelector.value = !showFishSelector.value;
  }

  function fishClicked() {
    if (!fishIsBeingStyled.value) {
        fishIsBeingStyled.value = true;
        moveFish(true);
        toggleHatSelector();
        toggleFishSelector();
    } else {
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

  function nextHat() {
    if (!shopData.value || !shopData.value.hats.length) return;
    currentHatIndex.value = (currentHatIndex.value + 1) % (shopData.value.hats.length + 1);
    if (currentHatIndex.value === shopData.value.hats.length) {
      currentHatIndex.value = -1;
    }
  }

  function prevFish() {
    if (!shopData.value || !shopData.value.fish.length) return;
    currentFishIndex.value = (currentFishIndex.value - 1 + shopData.value.fish.length) % shopData.value.fish.length;
  }

  function nextFish() {
    if (!shopData.value || !shopData.value.fish.length) return;
    currentFishIndex.value = (currentFishIndex.value + 1) % shopData.value.fish.length;
  }

  function applyHat() {
    hat.value = currentHat.value || null;
    showHatSelector.value = false;
    if (!showFishSelector.value) {
      fishIsBeingStyled.value = false;
    }
    socket.emit('updateHat', { hatID: currentHat.value?.hatID, position: props.position, corridorId: dormID.value });
    socket.emit('getEquipped', dormID.value);
  }

  function applyFish() {
    fish.value = currentFish.value || null;
    showFishSelector.value = false;
    if (!showHatSelector.value) {
      fishIsBeingStyled.value = false;
    }
    socket.emit('updateFish', { fishID: currentFish.value?.fishID, position: props.position, corridorId: dormID.value });
    socket.emit('getEquipped', dormID.value);
  }

  const isHatAvailable = computed(() => {
    if (currentHat.value && xpScore.value >= currentHat.value.price) return true; 
    //lines below can still be used for special unlocks stored on shopUnlocks on database.
    if (!shopUnlocks.value || !shopUnlocks.value.hats) return false;
    return shopUnlocks.value.hats.includes(currentHatIndex.value + 1) || currentHatIndex.value === -1;
  });

  const isFishAvailable = computed(() => {
    if (currentFish.value && xpScore.value >= currentFish.value.price) return true;
    //lines below can still be used for special unlocks stored on shopUnlocks on database.
    return (shopUnlocks.value?.fish || []).includes(currentFishIndex.value + 1) || currentFishIndex.value === -1;
  });

  // Random movement of fish, to center when clicked
  function moveFish(clicked = false) {
    const waterBounds = props.waterBounds;
    if (!waterBounds) return;

    const fishWidth = 96;
    const fishHeight = 96;

    if (clicked) {
      const centerX = (waterBounds.width - fishWidth) / 2;
      const centerY = (waterBounds.height - fishHeight) / 2;
      isFlipped.value = centerX < fishX.value;
      fishX.value = centerX;
      fishY.value = centerY;
      fishZ.value = 100;
      return;
    }
    if(!props.isBlurred) { //If fishes are not in "blurred" state, change the z-index for 3D-effect
      updateZIndexBasedOnRock();
    }
    
    const newX = Math.round(Math.random() * (waterBounds.width - fishWidth));
    const newY = Math.round(Math.random() * (waterBounds.height - fishHeight));
    isFlipped.value = newX < fishX.value;
    fishX.value = newX;
    fishY.value = newY;
  }

  // Update z-index based on rock position to create a 3D effect
  function updateZIndexBasedOnRock() {
    if (!props.waterBounds || !props.rockBounds) return;
    const rockRect = {
      x: props.rockBounds.left - props.waterBounds.left,
      y: props.rockBounds.top - props.waterBounds.top,
      width: props.rockBounds.width,
      height: props.rockBounds.height
    };
    const fishRect = {
      x: fishX.value,
      y: fishY.value,
      width: 96,
      height: 96
    };
    const isOverlapping =
      fishRect.x + fishRect.width > rockRect.x &&
      fishRect.x < rockRect.x + rockRect.width &&
      fishRect.y + fishRect.height > rockRect.y &&
      fishRect.y < rockRect.y + rockRect.height;
    if (!isOverlapping) {
      fishZ.value = Math.round(Math.random() * 40);
    }
  }

  function scheduleMoveFish() {
    const randomDelay = Math.random() * 9000 + 2000;
    setTimeout(() => {
      if (!fishIsBeingStyled.value) moveFish();
      scheduleMoveFish();
    }, randomDelay);
  }

  // Find fish and hat by type from shopData
  function findFish() {
    return shopData.value?.fish.find(f => f.name === props.fishType) || null;
  }

  function findHat() {
    return shopData.value?.hats.find(h => h.name === props.hatType) || null;
  }

  watch(() => props.fishType, () => {
    fish.value = findFish();
  });

  watch(() => props.hatType, () => {
    hat.value = findHat();
  });

  watch(() => props.isBlurred, () => { //If fishes change to "blurred-state" due to poor water consumption behavior, hard-set z-index to 10 so fishes appear further from viewer.
    if (props.isBlurred) {
      fishZ.value = 10;
      randomScale.value =  Math.round((Math.random() * 6) + 2) / 10; //If in "blurred-state" fishes are scaled to [0.2, 0.8] to appear smaller
    };
  });

  return {
    fish, hat, fishX, fishY, fishZ, randomScale, isFlipped,
    fishIsBeingStyled, showHatSelector, showFishSelector,
    currentHat, currentFish, currentHatIndex, currentFishIndex,
    fishClicked, prevHat, nextHat, prevFish, nextFish,
    applyHat, applyFish, isHatAvailable, isFishAvailable,
    scheduleMoveFish
  };
}
