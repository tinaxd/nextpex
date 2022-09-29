<script setup lang="ts">
  defineProps<{
    rankType: string
  }>()
</script>

<template>
  <Scatter
    ref="scatter"
    :chart-data="chartInput"
    :chart-options="(chartOptions as any)"
    :plugins="plugins"
    @mousedown="setCursorPosition"
    @mouseup="resetDragZoom"
  />
</template>

<script lang="ts">
  import { defineComponent } from 'vue'
  import {registerables, Chart} from 'chart.js'
  import zoomPlugin from 'chartjs-plugin-zoom'
  import axios from 'axios'
  import { shadeColor } from '../color'
  import { Scatter } from 'vue-chartjs'
  export default defineComponent({
    name: 'RankChart',
    components: {
      Scatter,
    },
    data() {
      return {
        chartData: [] as {
          label: string
          data: { x: number; y: number }[]
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          backgroundColor: (ctx: any) => string
        }[],
        clickPosition: [0, 0] as [number, number],
        plugin :[]
      }
    },
    computed: {
      chartInput() {
        // sort by user id
        this.chartData.sort((a, b) => {
          return a.label.localeCompare(b.label)
        })
        return {
          datasets: this.chartData,
        }
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
                  const date = new Date(value * 1000)
                  return `${date.getUTCFullYear()}/${(date.getUTCMonth() + 1).toString().padStart(2, '0')}/${date
                    .getDate()
                    .toString()
                    .padStart(2, '0')}`
                },
              },
            },
          },
          plugins: {
            tooltip: {
              callbacks: {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                label: (context: any) => {
                  const date = new Date(context.parsed.x * 1000)
                  const dateString = `${date.getUTCFullYear()}/${(date.getUTCMonth() + 1)
                    .toString()
                    .padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')} ${date
                    .getHours()
                    .toString()
                    .padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
                  return `(${dateString}, ${context.parsed.y})`
                },
              },
            },
            zoom: {
              zoom: {
                drag: {
                  enabled: true,
                  threshold: 5,
                },
                mode: 'x',
              },
            },
          },
        }
      },
      plugins() {
        return [{
          id: "rankArenaPlugin",
          beforeDraw: (chart) => {
            const yScale = chart.scales['y'];
            const xScale = chart.scales['xAxis'];
            const ctx = chart.ctx;

            let areas: (string | number)[][] = [];
            switch (this.$props.rankType) {
              case 'trio':
                areas = [
                  [0, 1000, "#d0b49e"],
                  [1000, 3000,"#c89f8e"],
                  [3000, 5400, "#e3e4ef"],
                  [5400, 8200, "rgba(254,241,174,0.84)"],
                  [8200, 11400, "rgba(117,255,253,0.8)"],
                  [11400, 15000, "rgba(42,187,254,0.58)"],
                  [15000, 20000, "rgba(166,99,255,0.6)"],
                ];
                break;
              case 'arena':
                areas = [
                  [0, 1600,"#c89f8e"],
                  [1600, 3200, "#e3e4ef"],
                  [3200, 4800, "rgba(254,241,174,0.84)"],
                  [4800, 6400, "rgba(117,255,253,0.8)"],
                  [6400, 8000, "rgba(42,187,254,0.58)"],
                  [8000, 20000, "rgba(166,99,255,0.6)"],
                ];
                break;
            }

            for (const area of areas) {
              const left = xScale.left;
              const width = xScale.width;
              let adjust = 0;
              let top = yScale.getPixelForValue(area[1]);
              if (top < yScale.top) {
                top = yScale.top;
                adjust++;
              } else if (top > yScale.bottom) {
                continue;
              }
              let bottom = yScale.getPixelForValue(area[0]);
              if (bottom > yScale.bottom) {
                bottom = yScale.bottom;
                adjust++;
              } else if (bottom < yScale.top) {
                continue;
              }

              if (adjust >= 2) {
                continue;
              }

              const height = bottom - top;

              ctx.fillStyle = area[2];
              ctx.fillRect(left, top, width, height);
            }
          },
        }]
      }
    },
    watch: {
      rankType() {
        this.fetchRanks().then(() => {
          (this.$refs.scatter as any).updateChart()
        })
      },
    },
    mounted() {
      Chart.register(zoomPlugin, ...registerables)
      this.fetchRanks()
    },
    methods: {
      async fetchRanks() {
        const response = await axios.get(`/rank/${this.rankType}/all`)
        const ranks = response.data.ranks as {
          [key: string]: { rank: number; time: number; rank_name: string }[]
        }

        const colors = {} as { [key: string]: string }
        for (const key in ranks) {
          colors[key] = shadeColor(key, 'seed19', 40)
        }

        this.chartData = Object.keys(ranks).map((user) => {
          const ranksOfUser = ranks[user]
          return {
            label: user,
            data: ranksOfUser.map((level) => {
              return {
                x: level.time,
                y: level.rank,
              }
            }),
            // eslint-disable-next-line
            backgroundColor: (ctx: any) => colors[user],
          }
        })
      },
      setCursorPosition(event: MouseEvent) {
        this.clickPosition[0] = event.screenX
        this.clickPosition[1] = event.screenY
      },
      resetDragZoom(event: MouseEvent) {
        console.log(
          'reset',
          event,
          Math.abs(this.clickPosition[0] - event.screenX),
          Math.abs(this.clickPosition[1] - event.screenY),
          this.clickPosition,
        )
        if (
          Math.abs(this.clickPosition[0] - event.screenX) < 15 &&
          Math.abs(this.clickPosition[1] - event.screenY) < 15
        ) {
          // eslint-disable-next-line
          // (this.$refs.chartJs as any).resetZoom();
          console.log('reset')
          ;(this.$refs.scatter as any).chart.resetZoom()
        }
      },
    },
  })
</script>
