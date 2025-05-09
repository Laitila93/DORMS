import { ref } from 'vue';
import type { Ref } from 'vue';
import type { Socket } from 'socket.io-client';

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
const xpScore = ref(400); // dynamic score, should be fetched and calculated from the server w. emils functions.
const feedbackScore = ref(0); // dynamic score, should be fetched and calculated from the server w. emils functions.
const dailyConsumption = ref(0);
const dormID = ref<string | null>(null); // dormID is now a Ref, initialized to null

//******************************************************************************************** 

export function useShopData(socket: Socket) {
  if (!isFetched.value) {
    const cachedShopData = sessionStorage.getItem('shopData');
    const cachedUnlocks = sessionStorage.getItem('shopUnlocks');
    const cachedEquippedData = sessionStorage.getItem('equippedData');
    dormID.value = sessionStorage.getItem('dormID');

    socket.on('feedback:update', (updatedFeedbackScore) => {
      feedbackScore.value = Math.round(updatedFeedbackScore); // Update the feedback score with the new value
      console.log("📥 Received updated feedback score:", updatedFeedbackScore.feedbackScore); //BUG: this logs "undefined"
    });
    
    socket.on('xp:update', ({ updatedXP }) => {
      console.log("📥 Received XP update:", updatedXP);
      xpScore.value = updatedXP; // Update the XP score with the new value
    });
    
    socket.on("stats:update", ({ stats }) => {
      console.log("📥 Received stats update:", stats);
      dailyConsumption.value = stats.consumptionStats24h; // Update the consumption stats with the new value

    });
    
    socket.emit('getDbWaterData', dormID.value); // Emit event to get water data from the server
    console.log('Requesting water data...');

    if (cachedShopData) {
      shopData.value = JSON.parse(cachedShopData);
    } else {
      socket.emit('getShopData', 'en');
    }

    if (cachedUnlocks) {
      shopUnlocks.value = JSON.parse(cachedUnlocks);
    } else {
      socket.emit('getUnlocks', dormID.value);
    }
    if (cachedEquippedData) {
      equippedData.value = JSON.parse(cachedEquippedData);
      console.log('cached equippedData', equippedData.value);
    } else {
      console.log("no cached equipped, emmiting getEquipped");
      socket.emit('getEquipped', dormID.value);
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

    socket.off("xp").on("xp", (data) => {
      console.log("📥 Received XP data:", data);
      xpScore.value = data.xp; // Update the XP score with the new value
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
    socket.emit("getXp", dormID.value); // Emit event to get XP data from the server
    console.log('Requesting XP data...with dormID:', dormID.value);
    socket.emit("getFeedback", dormID.value); // Emit event to get feedback data from the server
    isFetched.value = true;

  }

  return {
    shopData,
    shopUnlocks,
    equippedData,
    xpScore,
    feedbackScore,
    dailyConsumption,
    dormID,
  };
}
