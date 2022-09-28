<template>
  <va-card class="d-flex">
    <va-card-title>
      <h1>プレイ時間 (hours)</h1>
      <va-chip outline disabled class="mb-2 mr-2" color="primary" style="opacity: 1"
        >{{ yearMonth[activePage] }}月の合計プレイ時間</va-chip
      >
    </va-card-title>
    <va-card-content>
      <Bar ref="scatter" :chart-data="chartInput" :chart-options="chartOptions" />
      <div class="flex-center my-3">
        <va-pagination v-model="activePage" :visible-pages="4" :pages="yearMonth.length" />
      </div>
    </va-card-content>
  </va-card>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'
  import { registerables, Chart as ChartJS } from 'chart.js'
  import axios from 'axios'
  import { Bar } from 'vue-chartjs'
  import { PlayTimeEntry } from '../models'
  import { shadeColor } from '../color'
  export default defineComponent({
    name: 'PlayTime',
    components: {
      Bar,
    },
    data() {
      return {
        chartData: [] as {
          label: string
          data: number[]
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          backgroundColor: (context: any) => string
        }[],
        activePage: 1,
        yearMonth: [] as string[],
        playTimeByYearMonth: new Map<string, PlayTimeEntry[]>(),
      }
    },
    computed: {
      chartInput() {
        const yearMonth = this.yearMonth[this.activePage - 1]
        const playTimeEntry = this.playTimeByYearMonth.get(yearMonth)
        const gameNames = new Set<string>()
        playTimeEntry?.forEach((entry) => {
          gameNames.add(entry.gamename)
        })
        const gameNameArray = Array.from(gameNames).sort()
        const allUserNames = new Set<string>()
        playTimeEntry?.forEach((entry) => {
          allUserNames.add(entry.username)
        })
        const allUserNameArray = Array.from(allUserNames).sort()
        const allUserNameWithPlayTime = new Map<string, number[]>()
        allUserNameArray.forEach((userName) => {
          const playTimeArray = new Array(gameNameArray.length).fill(0)
          playTimeEntry?.forEach((entry) => {
            if (entry.username === userName) {
              const index = gameNameArray.indexOf(entry.gamename)
              playTimeArray[index] = entry.playtime
            }
          })
          allUserNameWithPlayTime.set(userName, playTimeArray)
        })

        // sort allUserNameArray by sum of playtime
        allUserNameArray.sort((a, b) => {
          const aSum = allUserNameWithPlayTime.get(a)?.reduce((a, b) => a + b, 0) ?? 0
          const bSum = allUserNameWithPlayTime.get(b)?.reduce((a, b) => a + b, 0) ?? 0
          return bSum - aSum
        })

        const datasets = gameNameArray.map((gameName) => {
          const data = allUserNameArray.map((userName) => {
            const entry = playTimeEntry?.find((entry) => entry.username === userName && entry.gamename === gameName)
            return entry?.playtime / 3600 ?? 0
          })
          return {
            label: gameName,
            data: data,
            backgroundColor: () => {
              return shadeColor(gameName, 'seed', 80)
            },
          }
        })

        // get sum of games per user
        console.log('+', datasets)

        return {
          datasets: datasets,
          labels: allUserNameArray,
        }
      },
      chartOptions() {
        return {
          responsive: true,
          maintainAspectRatio: false,
          showLine: true,
          indexAxis: 'y',
          scales: {
            x: {
              scaleLabel: {
                display: true,
                labelString: 'プレイ時間 (時間)',
              },
              stacked: true,
            },
            y: {
              scaleLabel: {
                display: true,
                labelString: 'プレイ時間 (時間)',
              },
              stacked: true,
            },
          },
        }
      },
    },
    mounted() {
      ChartJS.register(...registerables)
      this.fetchPlayTime()
    },
    methods: {
      async fetchPlayTime() {
        const response = await axios.get('/check/monthly')
        const playTimes = response.data
        console.log(playTimes)
        const yearMonth = new Set()
        const playTimeByYearMonth = new Map()
        for (const playTime of playTimes) {
          yearMonth.add(`${playTime.year}-${playTime.month}`)
          const playTimeList = playTimeByYearMonth.get(`${playTime.year}-${playTime.month}`) || []
          playTimeList.push({
            username: playTime.username,
            gamename: playTime.gamename,
            playtime: playTime.playtime,
          })
          playTimeByYearMonth.set(`${playTime.year}-${playTime.month}`, playTimeList)
        }
        this.yearMonth = Array.from(yearMonth).sort().reverse() as string[]
        this.playTimeByYearMonth = playTimeByYearMonth
      },
    },
  })
</script>
