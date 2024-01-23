<script setup>
import { RouterView } from "vue-router";
import TopNav from "./components/TopNav.vue";
import StreamLeftNav from "./components/StreamLeftNav.vue";
import StreamRightNav from "./components/StreamRightNav.vue";
import { useRoute } from 'vue-router'
import { computed, onMounted } from "vue";
import { useAuthStore } from "./stores/auth";
import { useChurchStore } from "./stores/church";

const route = useRoute();
const path = computed(() => route.path)
const useAuth = useAuthStore();
const useChurch = useChurchStore();

const displayStreamChurchContent = computed(() => {
  if (path.value === "/main") { return true; }
  else { return false; }
})

onMounted(() => {
  // redundant load from local storage 
  if (JSON.parse(localStorage.getItem('member'))) { useAuth.member = JSON.parse(localStorage.getItem('member')); }
  else useAuth.member = null;

  if (JSON.parse(localStorage.getItem('church'))) { useChurch.church = JSON.parse(localStorage.getItem('church')); }
  else useChurch.church = null;
})

</script>

<template>
  <TopNav></TopNav>

  <div class="row">
    <div class="col-2 gx-5">

      <div v-show="displayStreamChurchContent">
        <StreamLeftNav></StreamLeftNav>
      </div>

      <div v-show="!displayStreamChurchContent">
      </div>
    </div>

    <div class="col-8">
      <RouterView />
    </div>

    <div class="col-2">
      <div v-show="!displayStreamChurchContent">

      </div>

      <div v-show="displayStreamChurchContent">
        <StreamRightNav></StreamRightNav>
      </div>

    </div>
  </div>
</template>

<style scoped>
#my-div {
  background-color: #f00;
  width: 200px;
  height: 200px;
}

a.fill-div {
  display: block;
  height: 100%;
  width: 100%;
  text-decoration: none;
}
</style>
