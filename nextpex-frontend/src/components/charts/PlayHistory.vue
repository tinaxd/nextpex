<script setup lang="ts">
import { defineComponent } from "vue";
import type { PlayHistoryEntry } from "../models";
import NoData from "../NoData.vue";
defineProps<{
  historyEntires: PlayHistoryEntry[];
}>();
</script>

<template>
  <div class="wrapper">
    <table v-if="historyEntires.length > 0">
      <thead>
        <tr>
          <th>Username</th>
          <th>Game</th>
          <th>時刻</th>
          <th>プレイ時間</th>
        </tr>
      </thead>
      <tbody>
        <!-- eslint-disable-next-line vue/require-v-for-key -->
        <tr v-for="history in historyEntires">
          <td>{{ history.username }}</td>
          <td>{{ history.gamename }}</td>
          <td>{{ formatTime(history.started_at, history.ended_at) }}</td>
          <td>{{ formatDuration(history.started_at, history.ended_at) }}</td>
        </tr>
      </tbody>
    </table>
    <NoData title="Play history" v-else />
  </div>
</template>

<script lang="ts">
export default defineComponent({
  name: "PlayHistory",
  methods: {
    formatTimeSingle(t: number): string {
      const d = new Date(t * 1000);
      // format in MM/DD HH:mm
      return `${d.getMonth() + 1}/${d.getDate()} ${d
        .getHours()
        .toString()
        .padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
    },
    formatTime(start: number, end: number): string {
      const s = this.formatTimeSingle(start);
      const e = this.formatTimeSingle(end);
      return `${s} - ${e}`;
    },
    formatDuration(start: number, end: number): string {
      const minutes = Math.floor((end - start) / 60);
      return `${minutes} 分`;
    },
  },
});
</script>

<style scoped>
th {
  font-weight: bold;
}

.table {
  height: inherit;
  /* overflow-y: auto; */
}
</style>
