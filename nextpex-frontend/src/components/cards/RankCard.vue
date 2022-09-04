<script setup lang="ts">
import DashboardCard from "../DashboardCard.vue";
import RankChart from "../charts/RankChart.vue";
import { defineComponent } from "vue";
defineProps<{
  rankType: "trio" | "arena";
}>();
</script>

<template>
  <DashboardCard title="Rank">
    <template v-slot:header>
      <slot />
    </template>
    <template v-slot:body><RankChart :rank-type="rankType" /></template>
  </DashboardCard>
</template>

<script lang="ts">
export default defineComponent({
  name: "RankCard",
});
</script>

<style scoped></style>
