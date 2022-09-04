<script setup lang="ts">
import { defineComponent } from "vue";

defineProps<{
  title: string;
}>();
</script>

<template>
  <div class="card">
    <div class="header">
      <h3>{{ title }}</h3>
      <slot name="header" />
    </div>
    <slot name="body" />
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
