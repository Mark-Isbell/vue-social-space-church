<script setup lang="ts">
// imports
import { useChurchStore } from "@/stores/church";
import { onMounted, ref } from "vue";
import MemberLinkChurchList from "../components/MemberLinkChurchList.vue";

// state
const useChurch = useChurchStore();
const isVisible = ref(false);

function visibilityChanged(trueOrFalse, entry) {

    isVisible.value = trueOrFalse
    if (isVisible.value === true) {

        loadMoreMembers();
    }
}

async function loadMoreMembers() {
    let offset = useChurch.allChurchMembers.length;
    let result = await useChurch.getChurchMembers(100, offset);
    // consider possible addition of an error message if the call is unsuccessful
    if (result === false) {
        // no action - problem retreiving church members
    }
}

onMounted(async () => {
    let result = await useChurch.getChurchMembers(100, 0);
    if (result === false) {
        // no action - problem retreiving church members
    }
})
</script>
    
<template>
    <div class="row mt-3">
        <div class="col-3"></div>
        <div class="col-6 h4 text-center">
            All church members
        </div>
        <div class="col-3"></div>
    </div>

    <div class="row mt-3">
        <div class="col-3"></div>
        <div class="col-6">
            <div v-for="member in useChurch.allChurchMembers" :key="member">
                <MemberLinkChurchList :member="member"></MemberLinkChurchList>
            </div>
        </div>
        <div class="col-3"></div>
    </div>

    <div v-observe-visibility="visibilityChanged" class="row mt-1">
        <div class="col-3"></div>
        <div class="col-6 text-center">
            <button class="btn btn-primary" @click="loadMoreMembers()">- Load More -</button>
        </div>
        <div class="col-3"></div>
    </div>
</template>
    
<style scoped></style>
    