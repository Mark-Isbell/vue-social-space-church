<script setup lang="ts">
// imports
import { onMounted, ref } from "vue";
import { useChurchStore } from "@/stores/church";
import ChurchFact from "../components/ChurchFact.vue";
import ChurchFactNew from "../components/ChurchFactNew.vue";

// state
const useChurch = useChurchStore();
const displayFacts = ref(false);
const displayErrorMessage = ref(false);
const showCreate = ref(false);

function toggleCreateNewFact() {
    if (showCreate.value === false) {
        showCreate.value = true;
    } else { showCreate.value = false }
}


onMounted(async () => {
    // first check for church record 
    if (!useChurch.church) {
        await useChurch.getChurch();
    }

    // should be church now but check anyway
    if (useChurch.church) {
        // first get all / any church links
        let result = await useChurch.getChurchFacts(useChurch.church.id);
        if (result === true) {
            displayFacts.value = true;
        } else {
            displayErrorMessage.value = true;
        }
    } else {
        // no action - problem retreiving church facts
    }
})

</script>
    
<template>
    <div class="row mt-3">
        <div class="col-3"></div>
        <div class="col-6 h4 text-center">
            Update Church Facts
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
        <ChurchFactNew @cancelcreate="toggleCreateNewFact()"></ChurchFactNew>
    </div>


    <div v-if="displayFacts" class="mt-3 row justify-content-center">

        <ChurchFact v-for="fact in useChurch.churchFacts" :key="fact" :fact="fact"></ChurchFact>

    </div>
</template>
    
<style scoped></style>
    