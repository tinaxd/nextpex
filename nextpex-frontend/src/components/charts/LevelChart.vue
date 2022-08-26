<script setup lang="ts">
import { Scatter } from "vue-chartjs";
</script>

<template>
  <Scatter :chart-data="chartInput" />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { registerables, Chart as ChartJS } from "chart.js";
export default defineComponent({
  name: "LevelChart",
  components: {
    Scatter,
  },
  data() {
    return {
      chartData: [] as { label: string; data: { x: number; y: number }[] }[],
    };
  },
  mounted() {
    ChartJS.register(...registerables);
    this.chartData = [
      {
        label: "aaa",
        data: [
          { x: 1, y: 1 },
          { x: 2, y: 2 },
          { x: 3, y: 3 },
        ],
      },
      {
        label: "bbb",
        data: [
          { x: 1, y: 2 },
          { x: 2, y: 3 },
          { x: 3, y: 4 },
        ],
      },
    ];
  },
  computed: {
    chartInput() {
      return {
        datasets: this.chartData,
      };
    },
    chartOptions() {
      return {};
    },
  },
});
</script>
