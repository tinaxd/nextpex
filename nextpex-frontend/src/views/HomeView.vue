<script setup lang="ts">
import LevelCard from "../components/cards/LevelCard.vue";
import RankCard from "../components/cards/RankCard.vue";
import CheckCard from "../components/cards/CheckCard.vue";
</script>

<template>
  <main>
    <div class="dashboard">
      <div class="card" @click="onClickCard('level')"><LevelCard /></div>
      <div class="card" @click="onClickCard('rank')"><RankCard /></div>
      <div class="card" @click="onClickCard('check')"><CheckCard /></div>
    </div>
  </main>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  components: {},
  name: "HomeView",
  methods: {
    onClickCard(name: string) {
      console.log(name);
    },
  },
});
</script>

<style scoped>
.dashboard {
  width: 100vw;
  height: 100vh;
  display: grid;
}

/* 横幅広いとき */
@media (min-width: 600px) {
  .dashboard {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
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
}

/* 横幅狭いとき */
@media (max-width: 600px) {
  .dashboard {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 1fr 1fr;
  }

  .dashboard div:nth-child(1) {
    grid-area: 1 /1 /2/2;
  }
  .dashboard div:nth-child(2) {
    grid-area: 2/1/3/2;
  }
  .dashboard div:nth-child(3) {
    grid-area: 3/1/4/2;
  }
}

.dashboard .card {
  margin: 20px;
  background-color: #dddddd;
  border-radius: 10px;
  cursor: pointer;
}
</style>
