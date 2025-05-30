// composables/useProgressData.ts
import { computed } from 'vue';
import type { ShopData } from './shopTypes';

export function useProgressData(shopData: ShopData, xpScore: number) {
  const nextFish = computed(() => {
    return shopData.fish
      .filter(f => f.price > xpScore)
      .sort((a, b) => a.price - b.price)?.[0];
  });

  const nextHat = computed(() => {
    return shopData.hats
      .filter(h => h.price > xpScore)
      .sort((a, b) => a.price - b.price)?.[0];
  });

  const nextItem = computed(() => {
    if (!nextFish.value) return nextHat.value;
    if (!nextHat.value) return nextFish.value;
    return nextFish.value.price < nextHat.value.price ? nextFish.value : nextHat.value;
  });

  const lastFish = computed(() => {
    return shopData.fish
      .filter(f => f.price <= xpScore)
      .sort((a, b) => b.price - a.price)?.[0];
  });

  const lastHat = computed(() => {
    return shopData.hats
      .filter(h => h.price <= xpScore)
      .sort((a, b) => b.price - a.price)?.[0];
  });

  const lastItem = computed(() => {
    if (!lastFish.value) return lastHat.value;
    if (!lastHat.value) return lastFish.value;
    return lastFish.value.price > lastHat.value.price ? lastFish.value : lastHat.value;
  });

  const progressPercentage = computed(() => {
    if (!nextItem.value || !lastItem.value) return 100;
    const totalDiff = nextItem.value.price - lastItem.value.price;
    if (totalDiff <= 0) return 100;
    return 100 * ((xpScore - lastItem.value.price) / totalDiff);
  });

  return {
    nextFish,
    nextHat,
    nextItem,
    lastFish,
    lastHat,
    lastItem,
    progressPercentage
  };
}
