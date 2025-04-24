<template>

  <div class="grid gap-4 w-full">
    <div 
      v-for="dorm in props.data"
      :key="dorm.dormName"
      class="flex items-center h-20 bg-blue-400 transition-all duration-500 rounded-r-full p-4 font-bold text-white uppercase"
      :style="{ width: `${dorm.score}%`}"
      >
      {{ dorm.dormName }}
    </div>
  </div>

</template>

<script setup lang="ts">

  const props = defineProps<{
    data: DormScore[];
  }>();
  console.log(props.data);

  type DormScore = {
    dormName: string;
    score: number;
  }


</script>