import { ref, computed } from 'vue';
import { socket } from './socket';
import type { Ref } from 'vue';

//used for testing water data integration. should be moved to server side later
import { convertToDailyConsumption } from '@/composables/dataConverterProto';
import { calculateScore } from '@/composables/pointsPrototype';
import dummyData from '@/assets/raw_water_data.json';
//****************************************************************************

export interface BaseShopItem {
  name: string;
  description: string;
  price: number;
  image: string;
}

export interface HatItem extends BaseShopItem {
  hatID: number;
}

export interface FishItem extends BaseShopItem {
  fishID: number;
}

export interface SpecialItem extends BaseShopItem {
  specialID: number;
}

export interface ShopData {
  hats: HatItem[];
  fish: FishItem[];
  specials: SpecialItem[];
}

export interface ShopUnlocks {
  hats: number[];
  fish: number[];
  specials: number[];
}

export interface EquippedData {
  hats: number[];
  fish: number[];
  specials: number[];
}

const shopData: Ref<ShopData | null> = ref(null);
const shopUnlocks: Ref<ShopUnlocks | null> = ref(null);
const equippedData: Ref<EquippedData | null> = ref(null);
const isFetched = ref(false);
const corridorId = 1;
const xpScore = ref(50); //Dummy value, replace with actual XP score logic from Emils algorithm

/*Lines below are for testing integrating Emils point algorithm and "real" water data. 
Functionality should be moved to server side later*/

const waterData = ref(null); // Water data received from the server
const dailyConsumption = ref(null); // Daily consumption data
const dayIndex = ref(0); // Current day index for the simulation
const maxWindowStart = computed(() => (dailyConsumption.value?.history.length ?? 0) - 30);

waterData.value = dummyData; // Replace with actual socket event listener
dailyConsumption.value = convertToDailyConsumption(waterData.value);
console.log('Daily consumption:', dailyConsumption);



setInterval(() => { //simulates one day every second in a 30 day moving window of dummy file

  const history = dailyConsumption.value?.history || [];
  if (history.length < 30) return;
  // Slice a moving 30-day window
  const windowSlice = history.slice(dayIndex.value, dayIndex.value + 30);
  const score = calculateScore({
    corridor: corridorId?.value ?? 1, //remove 1 after testing phase
    history: windowSlice,
  });
  console.log("30 day window: ",[...windowSlice]);
  console.log(`Score at window starting day ${dayIndex.value + 30}:`, score);
  xpScore.value += score;
  // Move window forward
  if (dayIndex.value < maxWindowStart.value) {
    dayIndex.value++;
  } else {
    console.log("End of simulation window reached.");
  }
}, 1000); // one day every second

//******************************************************************************************** 

export function useShopData() {
  if (!isFetched.value) {
    const cachedShopData = sessionStorage.getItem('shopData');
    const cachedUnlocks = sessionStorage.getItem('shopUnlocks');
    const cachedEquippedData = sessionStorage.getItem('equippedData');

    if (cachedShopData) {
      shopData.value = JSON.parse(cachedShopData);
    } else {
      socket.emit('getShopData', 'en');
    }

    if (cachedUnlocks) {
      shopUnlocks.value = JSON.parse(cachedUnlocks);
    } else {
      socket.emit('getUnlocks', corridorId);
    }
    if (cachedEquippedData) {
      equippedData.value = JSON.parse(cachedEquippedData);
      console.log('cached equippedData', equippedData.value);
    } else {
      console.log("no cached equipped, emmiting getEquipped");
      socket.emit('getEquipped', corridorId);
    }

    socket.off('shopData').on('shopData', (data) => {
      const normalized: ShopData = {
        fish: data.fishes,
        hats: data.hats,
        specials: data.specials,
      };
      shopData.value = normalized;
      sessionStorage.setItem('shopData', JSON.stringify(normalized));
    });

    socket.off('shopUnlocks').on('shopUnlocks', (data) => {
      const normalized: ShopUnlocks = {
        fish: data.fishes.map((f: any) => f.fishID),
        hats: data.hats.map((h: any) => h.hatID),
        specials: data.specials.map((s: any) => s.specialID),
      };
      shopUnlocks.value = normalized;
      sessionStorage.setItem('shopUnlocks', JSON.stringify(normalized));
    });

    socket.off('equippedData').on('equippedData', (data) => {
      console.log('equippedData recieved from database', data);
      const normalized: EquippedData = {
        fish: data.fishes.map((f: any) => f.fishID),
        hats: data.hats.map((h: any) => h.hatID),
        specials: data.specials.map((s: any) => s.specialID),
      };
      equippedData.value = normalized;
      sessionStorage.setItem('equippedData', JSON.stringify(normalized));
    });

    isFetched.value = true;
  }

  return {
    shopData,
    shopUnlocks,
    equippedData,
    corridorId,
    xpScore,
  };
}
