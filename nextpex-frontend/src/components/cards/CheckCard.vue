<script setup lang="ts">
import DashboardCard from "../DashboardCard.vue";
import CheckInfo from "../charts/CheckInfo.vue";
</script>

<template>
  <DashboardCard title="Check">
    <template v-slot:body><CheckInfo /></template>
  </DashboardCard>
</template>

<script lang="ts"></script>

<style scoped></style>
