<script setup lang="ts">
// imports
import { useChurchStore } from "../stores/church";
import { onMounted, ref } from "vue";
import UpdateModeration from "../components/UpdateModeration.vue";
import { useErrorStore } from "@/stores/error";
const error = useErrorStore();
// example: error.logError("my error string goes here and it will navigate automatically for me")

// state
const useChurch = useChurchStore();
const toggleUpdate = ref(false);
const displayTemplate = ref(false);

function showupdate() {
    if (toggleUpdate.value === false) {
        useChurch.updateModerationPolicy = useChurch.church.moderationPolicy;
        useChurch.updateModerationValidationMessages = [];
        toggleUpdate.value = true;
    }
    else { toggleUpdate.value = false; }
}

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
        <div class="row mt-3">
            <div class="col-3"></div>
            <div class="col-6 text-center h4">
                Church Moderation Policy Maintenance
            </div>
            <div class="col-3"></div>
        </div>

        <div class="row mt-4">
            <div class="col-3"></div>
            <div class="col-6 text-center">
                <p>Current moderation policy:</p>
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

        <div class="row">
            <div class="col-3"></div>
            <div class="col-6 h4 text-center">
                <span class="make-clickable" @click="showupdate()">
                    📝
                </span>
            </div>
            <div class="col-3"></div>
        </div>

        <div v-show="toggleUpdate">
            <div class="row">
                <div class="col-3"></div>
                <div class="col-6 h4 text-center">
                    <UpdateModeration @closeEdit="showupdate()"></UpdateModeration>
                </div>
                <div class="col-3"></div>
            </div>
        </div>
    </div>
</template>
    
<style scoped>
.make-clickable {
    cursor: pointer;
}

div {
    white-space: pre-wrap;
}
</style>
    