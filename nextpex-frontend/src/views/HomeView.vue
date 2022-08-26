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
    <div class="modal-container" v-if="showModal" @click="closeModal">
      <div class="modal">
        <p>This is a test</p>
        <p>aaa</p>
      </div>
    </div>
  </main>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  components: {},
  name: "HomeView",
  data() {
    return {
      showModal: false,
    };
  },
  methods: {
    onClickCard(name: string) {
      console.log(name);
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
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

.modal-container {
  position: absolute;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  text-align: center;
  /* pointer-events: none; */
}

.modal {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: auto;
}
</style>
