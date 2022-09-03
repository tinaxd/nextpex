<script setup lang="ts">
import { defineComponent } from "vue";
import type { PlayingEntry } from "../models";
import NoData from "../NoData.vue";
defineProps<{
  nowPlayings: PlayingEntry[];
}>();
</script>

<template>
  <div>
    <table v-if="nowPlayings.length > 0">
      <thead>
        <tr>
          <th>Username</th>
          <th>Game</th>
          <th>開始時刻</th>
          <th>プレイ時間</th>
        </tr>
      </thead>
      <tbody>
        <!-- eslint-disable-next-line vue/require-v-for-key -->
        <tr v-for="nowPlaying in nowPlayings">
          <td>{{ nowPlaying.username }}</td>
          <td>{{ nowPlaying.gamename }}</td>
          <td>{{ formatTime(nowPlaying.started_at) }}</td>
          <td>{{ formatDuration(nowPlaying.started_at) }}</td>
        </tr>
      </tbody>
    </table>
    <NoData title="Playing now" v-else />
  </div>
</template>

<script lang="ts">
export default defineComponent({
  name: "PlayingNow",
  methods: {
    formatTime(time: number): string {
      return new Date(time * 1000).toLocaleString("ja-JP");
    },
    formatDuration(time: number): string {
      const millis = Date.now() - time * 1000;
      const minutes = Math.floor(millis / (1000 * 60));
      return `${minutes} 分`;
    },
  },
});
</script>

<style scoped>
th {
  font-weight: bold;
}
</style>
