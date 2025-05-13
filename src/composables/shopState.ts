import { ref } from 'vue';
import type { Ref } from 'vue';
import type { ShopData, ShopUnlocks, EquippedData } from './shopTypes';

export const shopData: Ref<ShopData | null> = ref(null);
export const shopUnlocks: Ref<ShopUnlocks | null> = ref(null);
export const equippedData: Ref<EquippedData | null> = ref(null);
export const dormID = ref<string | null>(null);
