<template>
  <div class="row row-equal">
    <div class="flex xs12 xl6">
      <PlayHistory />
    </div>

    <!--    <div class="flex xs12 xl6">-->
    <!--      &lt;!&ndash;      <dashboard-contributors-chart />&ndash;&gt;-->
    <!--      <PlayTime />-->
    <!--    </div>-->
    <div class="flex xs12 xl6">
      <PlayTime />
    </div>
  </div>
</template>

<script setup lang="ts">
  import DashboardContributorsChart from './DashboardContributorsList.vue'
  import PlayHistory from './PlayHistory.vue'
  import PlayTime from './PlayTime.vue'
</script>

<style lang="scss" scoped>
  .display-2 {
    margin: 0;
    line-height: 1;
  }

  .row-separated {
    .flex + .flex {
      border-left: 1px solid var(--va-background);
    }
  }

  .rich-theme-card-text {
    line-height: 1.5;
  }

  .gallery-carousel {
    width: 80vw;
    max-width: 100%;

    @media all and (max-width: 576px) {
      width: 100%;
    }
  }
</style>
