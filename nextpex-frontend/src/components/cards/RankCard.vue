<script setup lang="ts">
import DashboardCard from "../DashboardCard.vue";
import RankChart from "../charts/RankChart.vue";
import { defineComponent } from "vue";
</script>

<template>
  <DashboardCard title="Rank">
    <template v-slot:header>
      <div @click.stop>
        <select v-model="selected" @change="onSelectChange">
          <option v-for="s in selectors" :value="s.value" :key="s.value">
            {{ s.display }}
          </option>
        </select>
      </div>
    </template>
    <template v-slot:body><RankChart :rank-type="selected" /></template>
  </DashboardCard>
</template>

<script lang="ts">
export default defineComponent({
  name: "RankCard",
  data() {
    return {
      selected: "trio" as "trio" | "arena",
    };
  },
  computed: {
    selectors() {
      return [
        { value: "trio", display: "Trio" },
        { value: "arena", display: "Arena" },
      ];
    },
  },
  methods: {
    setSelect(v: string) {
      this.selected = v as "trio" | "arena";
    },
    onSelectChange(t: Event) {
      const target = t.target as HTMLSelectElement;
      const value = target.value;
      window.localStorage.setItem("rank-type", value);
      this.$emit("rankTypeChange", value);
    },
  },
  mounted() {
    const value = window.localStorage.getItem("rank-type");
    if (value) {
      this.setSelect(value);
    }
  },
  emits: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    rankTypeChange(payload: { newType: "trio" | "arena" }) {
      return true;
    },
  },
});
</script>

<style scoped></style>
