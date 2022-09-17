<script setup lang="ts">
import { Scatter } from "vue-chartjs";
defineProps<{
  rankType: "trio" | "arena";
}>();
</script>

<template>
  <Scatter ref="scatter" :chart-data="chartInput" :chart-options="(chartOptions as any)" v-on:mousedown="setCursorPosition" v-on:mouseup="resetDragZoom"/>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { registerables, Chart as ChartJS } from "chart.js";
import zoomPlugin from 'chartjs-plugin-zoom';
import axios from "axios";
import randomColor from "randomcolor";
export default defineComponent({
  name: "RankChart",
  components: {
    Scatter,
  },
  data() {
    return {
      chartData: [] as {
        label: string;
        data: { x: number; y: number }[];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        backgroundColor: (ctx: any) => string;
      }[],
      clickPosition: [0, 0] as [number, number],
    };
  },
  mounted() {
    ChartJS.register(zoomPlugin,...registerables);
    this.fetchRanks();
  },
  watch: {
    rankType() {
      this.fetchRanks();
    },
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
              // eslint-disable-next-line
              callback: function (value: number, index: number, values: any) {
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
    async fetchRanks() {
      const response = await axios.get(`/rank/${this.rankType}/all`);
      const ranks = response.data.ranks as {
        [key: string]: { rank: number; time: number; rank_name: string }[];
      };

      const colors = {} as { [key: string]: string };
      for (const key in ranks) {
        colors[key] = randomColor();
      }

      this.chartData = Object.keys(ranks).map((user) => {
        const ranksOfUser = ranks[user];
        return {
          label: user,
          data: ranksOfUser.map((level) => {
            return {
              x: level.time,
              y: level.rank,
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
      console.log("reset",event, Math.abs(this.clickPosition[0] - event.screenX), Math.abs(this.clickPosition[1] - event.screenY), this.clickPosition);
      if (
          Math.abs(this.clickPosition[0] - event.screenX) < 15 &&
          Math.abs(this.clickPosition[1] - event.screenY) < 15
      ) {
        // eslint-disable-next-line
        // (this.$refs.chartJs as any).resetZoom();
        console.log("reset");
        (this.$refs.scatter as any).chart.resetZoom();
      }
    },
  },
});
</script>
