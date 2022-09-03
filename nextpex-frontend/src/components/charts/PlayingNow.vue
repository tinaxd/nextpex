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
          <th>Start</th>
          <th>Duration</th>
        </tr>
      </thead>
      <tbody>
        <!-- eslint-disable-next-line vue/require-v-for-key -->
        <tr v-for="nowPlaying in nowPlayings">
          <td>{{ nowPlaying.username }}</td>
          <td>{{ nowPlaying.game }}</td>
          <td>{{ formatTime(nowPlaying.startTime) }}</td>
          <td>{{ formatDuration(nowPlaying.playingTime) }}</td>
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
    formatTime(time: Date): string {
      return time.toLocaleString("ja-JP");
    },
    formatDuration(millis: number): string {
      let minutes = Math.floor(millis / 60000);
      minutes = Math.floor(minutes);
      return `${minutes} 分`;
    },
  },
});
</script>
