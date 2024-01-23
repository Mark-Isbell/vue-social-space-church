<script setup lang="ts">
// imports
import { onMounted, ref } from "vue";
import { useMemberStore } from "@/stores/member";
import Fact from "../components/Fact.vue";
import FactNew from "../components/FactNew.vue";

// state
const useMember = useMemberStore();
const showCreate = ref(false);

function toggleCreateNewFact() {
    if (showCreate.value === false) {
        showCreate.value = true;
    } else { showCreate.value = false }
}

onMounted(() => {
    // first get all / any member facts
    useMember.getMemberFacts();
})

</script>
    
<template>
    <div class="row mt-3">
        <div class="col-3"></div>
        <div class="col-6 h4 text-center">
            My Facts
        </div>
        <div class="col-3"></div>
    </div>

    <div v-show="!showCreate" class="row mt-3">
        <div class="col-3"></div>
        <div class="col-6 text-center"><button class="btn btn-primary" @click="toggleCreateNewFact()">Add Fact</button>
        </div>
        <div class="col-3"></div>
    </div>

    <div v-show="showCreate">
        <FactNew @cancelcreate="toggleCreateNewFact()"></FactNew>
    </div>

    <div class="row mt-2 justify-content-center">
        <Fact v-for="fact in useMember.memberFacts" :key="fact" :fact="fact"></Fact>
    </div>
</template>
    
<style scoped></style>
    