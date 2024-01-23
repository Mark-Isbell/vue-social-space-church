<script setup lang="ts">
// imports
import { onMounted, ref } from "vue";
import { useChurchStore } from "@/stores/church";
import ChurchFactSmall from "../components/ChurchFactSmall.vue";

// state
const useChurch = useChurchStore();
const displayFacts = ref(false);
const displayErrorMessage = ref(false);

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
        // problem - no action
    }
})


</script>
    
<template>
    <div class="row mt-3">
        <div class="col-3"></div>
        <div class="col-6 h4 text-center">
            Church Facts
        </div>
        <div class="col-3"></div>
    </div>
    <div v-if="displayFacts">
        <ChurchFactSmall v-for="fact in useChurch.churchFacts" :key="fact" :fact="fact"></ChurchFactSmall>
    </div>
    <div v-if="displayErrorMessage" class="row mt-3">
        <div class="col-3"></div>
        <div class="col-6 h4 text-center">
            Church facts could not be retreived.
        </div>
        <div class="col-3"></div>
    </div>
</template>
    
<style scoped></style>
    