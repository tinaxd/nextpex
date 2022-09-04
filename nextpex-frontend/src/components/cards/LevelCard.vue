<script setup lang="ts">
import DashboardCard from "../DashboardCard.vue";
import LevelChart from "../charts/LevelChart.vue";
</script>

<template>
  <DashboardCard title="Level">
    <template v-slot:body><LevelChart /></template>
  </DashboardCard>
</template>

<script lang="ts"></script>

<style scoped></style>
