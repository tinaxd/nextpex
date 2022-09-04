<script setup lang="ts">
import { defineComponent } from "vue";

defineProps<{
  title: string;
  selectors?: { display: string; value: string }[];
  initSelectorValue?: string;
}>();
</script>

<template>
  <div class="card">
    <div class="header">
      <h3>{{ title }}</h3>
      <div @click.stop="onSelectorClick">
        <select v-if="selectors" v-model="selected" @change="onSelectorChange">
          <option
            v-for="selector in selectors"
            :value="selector.value"
            :key="selector.value"
          >
            {{ selector.display }}
          </option>
        </select>
      </div>
    </div>
    <slot />
  </div>
</template>

<script lang="ts">
export default defineComponent({
  name: "DashboardCard",
  data() {
    return {
      selected: this.initSelectorValue,
    };
  },
  methods: {
    onSelectorChange(ev: Event) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const t = ev.target as any;
      console.log(t.value);
      this.$emit("select", t.value);
    },
    onSelectorClick() {
      console.log("clicked");
    },
  },
  emits: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    select(payload: { value: string }) {
      return true;
    },
  },
});
</script>

<style scoped>
.header {
  display: flex;
  flex-direction: row;
}

.header > * {
  margin-right: 10px;
}
</style>
