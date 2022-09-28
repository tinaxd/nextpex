<template>
  <div class="markup-tables">
    <va-card>
      <va-card-title>プレイ履歴</va-card-title>
      <va-card-content>
        <div class="table-wrapper">
          <table class="va-table va-table--striped va-table--hoverable">
            <thead>
              <tr>
                <th>Username</th>
                <th>Game</th>
                <th>時刻</th>
                <th>プレイ時間</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="history in historyEntriesWithRange">
                <td>{{ history.username }}</td>
                <td>{{ history.gamename }}</td>
                <td>{{ formatTime(history.started_at, history.ended_at) }}</td>
                <td v-if="history.ended_at">{{ formatDuration(history.started_at, history.ended_at) }}</td>
                <td v-else><va-badge text="プレイ中" color="danger" /></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="flex-center my-3">
          <va-pagination v-model="activePage" :visible-pages="4" :pages="20" />
        </div>
      </va-card-content>
    </va-card>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'

  import axios from 'axios'
  import { PlayHistoryEntry } from '../models'

  export default defineComponent({
    name: 'PlayHistory',
    data() {
      return {
        activePage: 1,
        historyEntries: [] as PlayHistoryEntry[],
      }
    },
    computed: {
      historyEntriesWithRange() {
        return this.historyEntries.slice((this.activePage - 1) * 10, this.activePage * 10)
      },
    },
    mounted() {
      this.fetchHistoryEntries()
    },
    methods: {
      async fetchHistoryEntries() {
        const response = await axios.get('/check/history?limit=200')
        this.historyEntries = response.data ?? []
        const now = await axios.get('/check/now')
        this.historyEntries.push(...now.data)
        this.historyEntries.sort((a, b) => {
          return b.started_at - a.started_at
        })
      },
      formatTimeSingle(t: number): string {
        const d = new Date(t * 1000)
        // format in MM/DD HH:mm
        return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours().toString().padStart(2, '0')}:${d
          .getMinutes()
          .toString()
          .padStart(2, '0')}`
      },
      formatTime(start: number, end: number): string {
        let s = this.formatTimeSingle(start)
        let e = this.formatTimeSingle(end)
        if (isNaN(end)) {
          e = ''
        }
        return `${s} - ${e}`
      },
      formatDuration(start: number, end: number): string {
        const minutes = Math.floor((end - start) / 60)
        return `${minutes} 分`
      },
    },
  })
</script>

<style lang="scss">
  .markup-tables {
    .table-wrapper {
      overflow: auto;
    }

    .va-table {
      width: 100%;
    }
  }
</style>
