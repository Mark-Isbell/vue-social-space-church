<script setup lang="ts">
// imports
import { useChurchStore } from "../stores/church";
import { onMounted, ref } from "vue";
import { useErrorStore } from "@/stores/error";
const error = useErrorStore();
// example: error.logError("my error string goes here and it will navigate automatically for me")

// state
const useChurch = useChurchStore();
const displayTemplate = ref(false);
const showSuccessMessage = ref(false);
const showFailureMessage = ref(false);

function resetSuccessOrFailure() {
    showSuccessMessage.value = false;
    showFailureMessage.value = false;
}

async function generateNewCode() {
    resetSuccessOrFailure();
    const response = await useChurch.generateNewInvitationCode();
    if (response === true) {
        showSuccessMessage.value = true;
    }
    else {
        showFailureMessage.value = true;
    }
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
                Church Invitation Code
            </div>
            <div class="col-3"></div>
        </div>

        <div class="row mt-4">
            <div class="col-3"></div>
            <div class="col-6 text-center">
                <p>Current church invitation code to give to new members that will allow them to finish registration:</p>
            </div>
            <div class="col-3"></div>
        </div>

        <div class="row mt-4">
            <div class="col-3"></div>
            <div class="col-6 text-center">
                <p>{{ useChurch.church.invitationCode }}</p>
            </div>
            <div class="col-3"></div>
        </div>

        <div class="row mt-4">
            <div class="col-3"></div>
            <div class="col-6 text-center">
                <button class="btn btn-primary" @click="generateNewCode()">Generate New Code</button>
            </div>
            <div class="col-3"></div>
        </div>

        <div v-show="showSuccessMessage" class="row mt-4">
            <div class="col-3"></div>
            <div class="col-6 text-success text-center">
                <p>New Invitation Code successfully generated: {{ useChurch.church.invitationCode }} </p>
            </div>
            <div class="col-3"></div>
        </div>


        <div v-show="showFailureMessage" class="row mt-4">
            <div class="col-3"></div>
            <div class="col-6 text-danger text-center">
                <p>New Invitation Code NOT generated. Old one is still in place: {{ useChurch.church.invitationCode }} </p>
            </div>
            <div class="col-3"></div>
        </div>

        <div class="row mt-4">
            <div class="col-3"></div>
            <div class="col-6 text-center">
                <p>Warning: Generating a new code means the old one will not longer be accepted during new member
                    registration</p>
            </div>
            <div class="col-3"></div>
        </div>

    </div>
</template>
    
<style scoped></style>
    