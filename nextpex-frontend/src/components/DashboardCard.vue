<script setup lang="ts">
defineProps<{
  title: string;
}>();
</script>

<template>
  <div class="card">
    <h3>{{ title }}</h3>
    <slot />
  </div>
</template>

<style scoped></style>
