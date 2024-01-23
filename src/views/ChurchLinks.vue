<script setup lang="ts">
// imports
import { onMounted, ref } from "vue";
import { useChurchStore } from "@/stores/church";
import ChurchLinkSmall from "../components/ChurchLinkSmall.vue";

// state
const useChurch = useChurchStore();
const displayLinks = ref(false);
const displayErrorMessage = ref(false);

onMounted(async () => {
    // first check for church record
    if (!useChurch.church) {
        let result = await useChurch.getChurch();
    }

    // should be church now but check anyway
    if (useChurch.church) {
        // first get all / any church links
        let result = await useChurch.getChurchLinks();
        if (result === true) {
            displayLinks.value = true;
        } else {
            displayErrorMessage.value = true;
        }
    }
})


</script>
    
<template>
    <div class="row mt-3">
        <div class="col-3"></div>
        <div class="col-6 h4 text-center">
            Church Links
        </div>
        <div class="col-3"></div>
    </div>
    <div v-if="displayLinks">
        <ChurchLinkSmall v-for="link in useChurch.churchLinks" :key="link" :link="link"></ChurchLinkSmall>
    </div>
    <div v-if="displayErrorMessage" class="row mt-3">
        <div class="col-3"></div>
        <div class="col-6 h4 text-center">
            Church links could not be retreived.
        </div>
        <div class="col-3"></div>
    </div>
</template>
    
<style scoped></style>
    