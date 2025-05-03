<template>
    <div>
        XP: {{ xpScore }} {{ nextItem }}
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



</script>
<style scoped>
</style>