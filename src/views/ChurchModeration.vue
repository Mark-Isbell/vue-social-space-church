<script setup lang="ts">
// imports
import { onMounted, ref } from "vue";
import { useErrorStore } from "@/stores/error";
import { useChurchStore } from "../stores/church";

// state
const error = useErrorStore();
// example: error.logError("my error string goes here and it will navigate automatically for me")
const useChurch = useChurchStore();
const displayTemplate = ref(false);

onMounted(async () => {
    let result = await useChurch.getChurch();
    if (result === false) {
        error.logError("Error retreiving church information.")
    } else if (result === true) {
        displayTemplate.value = true;
    }
})
</script>
    
<template>
    <div v-if="displayTemplate">
        <div class="mt-3 row">
            <div class="col-3"></div>
            <div class="col-6 h4 text-center">
                Church moderation policy
            </div>
            <div class="col-3"></div>
        </div>


        <div class="row mt-4">
            <div class="col-3"></div>
            <div class="col-6 text-center">

                <p>{{ useChurch.church.moderationPolicy }}</p>
            </div>
            <div class="col-3"></div>
        </div>
    </div>
</template>
    
<style scoped>
div {
    white-space: pre-wrap;
}
</style>
    