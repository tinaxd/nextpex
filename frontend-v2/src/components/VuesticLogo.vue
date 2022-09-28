<template>
  <img class="logo" src="/logo.png" alt="Nextpex" />
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useColors } from 'vuestic-ui'
  const { getColor, shiftHSLAColor } = useColors()

  const props = withDefaults(
    defineProps<{
      height?: number | string
      color?: string
    }>(),
    {
      height: 16,
      color: 'primary',
    },
  )

  const colorsComputed = computed(() => {
    const color = getColor(props.color, 'primary')
    return { start: color, end: shiftHSLAColor(color, { l: -20 }) }
  })
</script>

<style scoped>
  .logo {
    margin-right: 0.5rem;
    margin-top: 0.25rem;
    min-width: 2.5rem;
    height: 2.5rem;
  }
</style>
