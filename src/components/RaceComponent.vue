<template>
  <div>
    This is the RaceComponent for {{ dorm }}.
  </div>

</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue';

  onMounted(() => {
    props.socket.emit("getWaterData"); 
    props.socket.on("waterData", (records: Record<string, WaterLogItem[]>) => {
      mainWaterLog.value = records;
      dormWaterLog.value = (mainWaterLog.value[props.dorm as keyof typeof mainWaterLog.value] || []) as WaterLogItem[];
      console.log("Received water data:", records);
      console.log("Received dorm water data:", dormWaterLog.value);
      console.log("WaterLogItem 1:", dormWaterLog.value[0]);
      }
    );
      // Handle errors
      props.socket.on("error", (error: { message: string }) => {
        console.error("Error from server:", error.message);
        }
      );
  });

  const props = defineProps<{
    dorm: string;
    socket: any;
  }>();


  type WaterLogItem = {
    name: string;
    value: number;
  };

  const dormWaterLog = ref<WaterLogItem[]>([]); // Starts empty, filled later
  const mainWaterLog = ref<Record<string, WaterLogItem[]>>({});
  const isOpen = ref(false);

</script>