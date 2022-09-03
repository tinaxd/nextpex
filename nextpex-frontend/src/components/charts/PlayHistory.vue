<script setup lang="ts">
import { defineComponent } from "vue";
import type { PlayHistoryEntry } from "../models";
import NoData from "../NoData.vue";
defineProps<{
  historyEntires: PlayHistoryEntry[];
}>();
</script>

<template>
  <div>
    <table v-if="historyEntires.length > 0">
      <thead>
        <tr>
          <th>Username</th>
          <th>Game</th>
          <th>Time</th>
        </tr>
      </thead>
      <tbody>
        <!-- eslint-disable-next-line vue/require-v-for-key -->
        <tr v-for="history in historyEntires">
          <td>{{ history.username }}</td>
          <td>{{ history.game }}</td>
          <td>{{ formatTime(history.startTime, history.endTime) }}</td>
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
    formatTime(start: Date, end: Date): string {
      const s = start.toLocaleString("ja-JP");
      const e = end.toLocaleString("ja-JP");
      return `${s} - ${e}`;
    },
  },
});
</script>
