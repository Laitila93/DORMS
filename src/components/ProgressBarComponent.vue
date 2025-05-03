<template>
    <div>
        XP: {{ xpScore }}, Next Unlock: {{ nextItem.name }}, Next Unlock: {{ nextItem.price }}, Progress: {{Math.round(progressPercentage)}}%
    </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import { useShopData } from '@/composables/useShopData';

const { shopData, shopUnlocks, equippedData, corridorId, xpScore } = useShopData();

const nextFish = computed(() => {
    const lockedFish = shopData.value?.fish
        .filter(fish => fish.price > xpScore.value)
        .sort((a, b) => a.price - b.price); // sort by price ascending

    return lockedFish?.[0]; // return cheapest locked fish
});

const nextHat = computed(() => {
    const lockedHats = shopData.value?.hats
        .filter(hat => hat.price > xpScore.value)
        .sort((a, b) => a.price - b.price);

    return lockedHats?.[0]; // return cheapest locked hat
});

const nextItem = computed(() => {
    const fish = nextFish.value;
    const hat = nextHat.value;

    if (!fish) return hat;
    if (!hat) return fish;

    return fish.price < hat.price ? fish : hat;
});

const lastFish = computed(() => {
    const unlockedFish = shopData.value?.fish
        .filter(fish => fish.price <= xpScore.value)
        .sort((a, b) => b.price - a.price); // sort by price descending

    return unlockedFish?.[0]; // return most expensive unlocked fish
});

const lastHat = computed(() => {
    const unlockedHats = shopData.value?.hats
        .filter(hat => hat.price <= xpScore.value)
        .sort((a, b) => b.price - a.price);

    return unlockedHats?.[0]; // return most expensive unlocked hat
});

const lastItem = computed(() => {
    const fish = lastFish.value;
    const hat = lastHat.value;

    if (!fish) return hat;
    if (!hat) return fish;

    return fish.price > hat.price ? fish : hat;
});

const progressPercentage = computed(() => { // 0-100 progress since last unlock (not total). Can be edited to be total progress or whatever fits best
    return 100*((xpScore.value - lastItem.value.price) / (nextItem.value.price - lastItem.value.price));
});


</script>
<style scoped>
</style>