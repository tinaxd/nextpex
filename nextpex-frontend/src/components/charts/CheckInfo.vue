<script setup lang="ts">
import { defineComponent } from "vue";
import type { PlayHistoryEntry, PlayingEntry } from "../models";
import PlayingNow from "./PlayingNow.vue";
import PlayHistory from "./PlayHistory.vue";
import axios from "axios";
</script>

<template>
  <div class="check-info-root">
    <PlayingNow class="check-info-table" :now-playings="nowPlayings" />
    <PlayHistory class="check-info-table" :history-entires="historyEntries" />
  </div>
</template>

<script lang="ts">
export default defineComponent({
  name: "CheckInfo",
  data() {
    return {
      historyEntries: [] as PlayHistoryEntry[],
      nowPlayings: [] as PlayingEntry[],
    };
  },
  mounted() {
    this.fetchHistoryEntries();
    this.fetchNowPlayings();
  },
  methods: {
    async fetchHistoryEntries() {
      const response = await axios.get("/check/history?limit=20");
      this.historyEntries = response.data ?? [];
    },
    async fetchNowPlayings() {
      const response = await axios.get("/check/now");
      this.nowPlayings = response.data ?? [];
    },
  },
});
</script>

<style scoped>
.check-info-root {
  display: flex;
  flex-direction: row;
  height: 100%;
}

.check-info-table {
  flex: 1;
}
</style>
