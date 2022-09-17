<script setup lang="ts">
import { Scatter } from "vue-chartjs";
</script>

<template>
  <!-- ts-ignore -->
  <Scatter :chart-data="chartInput" :chart-options="chartOptions as any" />
</template>

<script lang="ts">
import randomColor from "randomcolor";
import { defineComponent } from "vue";
import { registerables, Chart as ChartJS } from "chart.js";
import axios from "axios";
export default defineComponent({
  name: "LevelChart",
  components: {
    Scatter,
  },
  data() {
    return {
      chartData: [] as {
        label: string;
        data: { x: number; y: number }[];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        backgroundColor: (context: any) => string;
      }[],
      clickPosition: [0, 0] as [number, number],
    };
  },
  mounted() {
    ChartJS.register(...registerables);
    this.fetchLevels();
  },
  computed: {
    chartInput() {
      return {
        datasets: this.chartData,
      };
    },
    chartOptions() {
      return {
        responsive: true,
        maintainAspectRatio: false,
        showLine: true,
        scales: {
          xAxis: {
            ticks: {
              callback: function (
                value: number,
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                index: number,
                // eslint-disable-next-line
                values: any
              ) {
                //return moment(value).format("YY/MM/DD HH[時]");
                const date = new Date(value * 1000);
                return `${date.getUTCFullYear()}/${(date.getUTCMonth() + 1)
                  .toString()
                  .padStart(2, "0")}/${date
                  .getDate()
                  .toString()
                  .padStart(2, "0")}`;
              },
            },
          },
        },
        plugins: {
          tooltip: {
            callbacks: {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              label: (context: any) => {
                const date = new Date(context.parsed.x * 1000);
                const dateString = `${date.getUTCFullYear()}/${(
                  date.getUTCMonth() + 1
                )
                  .toString()
                  .padStart(2, "0")}/${date
                  .getDate()
                  .toString()
                  .padStart(2, "0")} ${date
                  .getHours()
                  .toString()
                  .padStart(2, "0")}:${date
                  .getMinutes()
                  .toString()
                  .padStart(2, "0")}`;
                return `(${dateString}, ${context.parsed.y})`;
              },
            },
          },
          zoom: {
            zoom: {
              drag: {
                enabled: true,
                threshold: 5,
              },
              mode: "x",
            },
          },
        },
      };
    },
  },
  methods: {
    async fetchLevels() {
      const response = await axios.get("/level/all");
      const levels = response.data.levels as {
        [key: string]: { level: number; time: number }[];
      };

      const colors = {} as { [key: string]: string };
      for (const key in levels) {
        colors[key] = randomColor();
      }

      this.chartData = Object.keys(levels).map((user) => {
        const levelsOfUser = levels[user];
        return {
          label: user,
          data: levelsOfUser.map((level) => {
            return {
              x: level.time,
              y: level.level,
            };
          }),
          // eslint-disable-next-line
          backgroundColor: (ctx: any) => colors[user],
        };
      });
    },
    setCursorPosition(event: MouseEvent) {
      this.clickPosition[0] = event.screenX;
      this.clickPosition[1] = event.screenY;
    },
    resetDragZoom(event: MouseEvent) {
      if (
        Math.abs(this.clickPosition[0] - event.screenX) < 15 &&
        Math.abs(this.clickPosition[1] - event.screenY) < 15
      ) {
        // eslint-disable-next-line
        (this.$refs.chartJs as any).resetZoom();
      }
    },
  },
});
</script>
