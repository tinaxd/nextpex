<template>
  <div class="row row-equal">
    <div class="flex xs12 xl6">
      <va-card class="d-flex">
        <va-card-title>
          <h1>レベル推移</h1>
        </va-card-title>
        <va-card-content>
          <LevelChart />
        </va-card-content>
      </va-card>
    </div>

    <div class="flex xs12 xl6">
      <va-card class="d-flex">
        <va-card-title>
          <h1>ランク推移 ({{ model }})</h1>
          <div>
            <va-button-toggle v-model="model" size="small" outline :options="options" color="info" />
          </div>
        </va-card-title>
        <va-card-content>
          <RankChart :rank-type="model" />
        </va-card-content>
      </va-card>
    </div>
  </div>
</template>

<script setup lang="ts">
  import LevelChart from './LevelChart.vue'
  import RankChart from './RankChart.vue'
  import { ref } from 'vue'

  const options = ref([
    { label: 'Trio', value: 'trio' },
    { label: 'Arena', value: 'arena' },
  ])
  const model = ref('trio')
</script>

<style scoped></style>
