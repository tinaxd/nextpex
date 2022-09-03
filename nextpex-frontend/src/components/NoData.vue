<script setup lang="ts">
import { defineComponent, defineProps } from "vue";
defineProps<{
  title: string;
}>();
</script>

<template>
  <div class="center">
    <p class="title" v-if="title !== ''">{{ title }}</p>
    <p>No data</p>
  </div>
</template>

<script lang="ts">
export default defineComponent({
  name: "NoData",
});
</script>

<style scoped>
.center {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.title {
  font-weight: bold;
}
</style>
