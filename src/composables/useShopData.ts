import { ref } from 'vue';
import { socket } from './socket';
import type { Ref } from 'vue';

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
