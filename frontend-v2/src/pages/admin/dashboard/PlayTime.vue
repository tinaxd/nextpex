<template>
  <va-card class="d-flex">
    <va-card-title>
      <div class="row">
        <div class="flex xs4">
          <h1>プレイ時間 (hours)</h1>
        </div>
        <div class="flex xs4 offset--xs4">
          <Datepicker v-model="selectedMonth" monthPicker autoApply showNowButton/>
        </div>
      </div>
<!--      <h1>プレイ時間 (hours)</h1>-->
<!--      <Datepicker v-model="selectedMonth" monthPicker autoApply showNowButton/>-->
    </va-card-title>
    <va-card-content>
      <Bar ref="scatter" :chart-data="chartInput" :chart-options="chartOptions" />
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
        yearMonth: [] as string[],
        playTimeByYearMonth: new Map<string, PlayTimeEntry[]>(),
        selectedMonth:{
          month: new Date().getMonth(),
          year: new Date().getFullYear()
        }
      }
    },
    computed: {
      chartInput() {
        const idx = this.yearMonth.findIndex((v) => v === `${this.selectedMonth.year}-${this.selectedMonth.month+1}`)
        const yearMonth = this.yearMonth[idx]
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
              stacked: true,
            },
            y: {
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
