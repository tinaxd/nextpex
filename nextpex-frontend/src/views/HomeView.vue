<script setup lang="ts">
import LevelCard from "../components/cards/LevelCard.vue";
import RankCard from "../components/cards/RankCard.vue";
import CheckCard from "../components/cards/CheckCard.vue";
</script>

<template>
  <main>
    <div class="dashboard">
      <div><LevelCard /></div>
      <div><RankCard /></div>
      <div><CheckCard /></div>
    </div>
  </main>
</template>

<script lang="ts">
import { defineComponent } from "vue";
defineComponent({
  components: {},
});
</script>

<style scoped>
.dashboard {
  width: 100vw;
  height: 100vh;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
}

.dashboard div {
  margin: 20px;
}
.dashboard div:nth-child(1) {
  grid-area: 1 /1 /2/2;
}
.dashboard div:nth-child(2) {
  grid-area: 1 /2 /2/3;
}
.dashboard div:nth-child(3) {
  grid-area: 2/1/3/3;
}
</style>
