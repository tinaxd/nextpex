<script setup lang="ts">
import DashboardCard from "../DashboardCard.vue";
import RankChart from "../charts/RankChart.vue";
import { defineComponent } from "vue";
</script>

<template>
  <DashboardCard
    title="Rank"
    :selectors="selectors"
    init-selector-value="trio"
    @select="setSelect"
  >
    <RankChart :rank-type="selected" />
  </DashboardCard>
</template>

<script lang="ts">
export default defineComponent({
  name: "RankCard",
  data() {
    return {
      selected: "trio" as "trio" | "arena",
    };
  },
  computed: {
    selectors() {
      return [
        { value: "trio", display: "Trio" },
        { value: "arena", display: "Arena" },
      ];
    },
  },
  methods: {
    setSelect(v: string) {
      this.selected = v as "trio" | "arena";
    },
  },
});
</script>

<style scoped></style>
