<script setup lang="ts">
import LevelCard from "../components/cards/LevelCard.vue";
import RankCard from "../components/cards/RankCard.vue";
import CheckCard from "../components/cards/CheckCard.vue";
</script>

<template>
  <main>
    <div class="dashboard" @click="closeModal">
      <div
        class="card card-level"
        :class="{ clickable: !showModal() }"
        @click.stop="onClickCard('level')"
        v-show="modalType !== 'level'"
      >
        <LevelCard />
      </div>
      <div
        class="card card-rank"
        :class="{ clickable: !showModal() }"
        @click.stop="onClickCard('rank')"
        v-show="modalType !== 'rank'"
      >
        <RankCard />
      </div>
      <div
        class="card card-check"
        :class="{ clickable: !showModal() }"
        @click.stop="onClickCard('check')"
        v-show="modalType !== 'check'"
      >
        <CheckCard />
      </div>
    </div>
    <div class="fade-layer" v-show="showModal()"></div>
    <div class="modal-container" v-if="showModal()">
      <div :class="cardClass" class="modal" @click="modalClickPrevent">
        <LevelCard class="card-level" v-if="modalType === 'level'" />
        <RankCard class="card-rank" v-else-if="modalType === 'rank'" />
        <CheckCard class="card-check" v-else-if="modalType === 'check'" />
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
      modalType: null as null | string,
    };
  },
  methods: {
    onClickCard(name: string) {
      if (this.modalType !== null) {
        this.modalType = null;
        return;
      }
      // console.log(name);
      this.modalType = name;
    },
    closeModal() {
      this.modalType = null;
    },
    showModal() {
      return this.modalType !== null;
    },
    modalClickPrevent(e: Event) {
      e.stopPropagation();
    },
  },
  computed: {
    cardClass() {
      if (this.modalType === null) {
        return null;
      }
      return `card-${this.modalType}`;
    },
  },
});
</script>

<style scoped>
.dashboard {
  width: 100vw;
  height: 100vh;
  display: grid;
  z-index: 0;
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
  /* background-color: #dddddd; */
  border-radius: 10px;
}

.clickable {
  cursor: pointer;
}

.modal-container {
  position: absolute;
  top: 10vh;
  left: 10vw;
  height: 80vh;
  width: 80vw;
  /* text-align: center; */
  pointer-events: none;
  z-index: 2;
}

.modal {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: auto;
  background-color: #dddddd;
  padding: 20px;
  border-radius: 10px;
  /* margin: 10px; */
}

.fade-layer {
  position: absolute;
  top: 0px;
  left: 0px;

  width: 100%;
  height: 100%;

  background-color: #000000;
  opacity: 0.5;
  z-index: 1;

  pointer-events: none;
}

.card-level {
  --bg-color: #dff6ff;
  background-color: var(--bg-color);
}

.card-rank {
  --bg-color: #fdeedc;
  background-color: var(--bg-color);
}

.card-check {
  --bg-color: #fecd70;
  background-color: var(--bg-color);
  overflow-y: hidden;
}
</style>
