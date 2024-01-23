<script setup>
// imports
import { useModeratorStore } from "@/stores/moderator";
import { ref } from "vue";

// state
const useModerator = useModeratorStore();
const props = defineProps({
    request: {},
});
const buttonsAreActive = ref(true);
const validationMessages = ref([]);

async function updateAccessRequest() {

    buttonsAreActive.value = false;
    validationMessages.value = [];
    if (fieldsValidated()) {
        const response = await useModerator.updateRequest(getRequestUpdateObject())
        // the updateRequest action removes (this) request from the array
    } else {
        buttonsAreActive.value = true;
    }
}

function fieldsValidated() {

    if (props.request.status === "pending") {
        validationMessages.value.push("Please select a decision before updating")
        return false;
    }
    else { return true; }
}

function getRequestUpdateObject() {
    const updateObject = {
        moderatorMessageId: props.request.moderatorMessageId,
        status: props.request.status,
        moderatorResponse: props.request.moderatorResponse
    };

    return updateObject;
}
</script>
    
<template>
    <div class="card border-primary mb-3">
        <div class="card-header">Stream Requested: {{ request.stream.streamName }}</div>
        <div class="card-header">User Name: {{ request.member.userName }}</div>
        <div class="card-header">Date Requested: {{ request.createdAt }}</div>
        <div class="card-body">
            <h6 class="card-title">Request Message From Member:</h6>
            <p class="card-text">{{ request.message }}
            </p>
        </div>

        <div class="card-body">
            <h6 class="card-title">Moderator Note:</h6>
            <p class="card-text">Moderator's note about their decision to approve or deny access.
            </p>
            <textarea v-model="request.moderatorResponse" rows="5" cols="25" type="text" name="" id=""> </textarea>
        </div>

        <div class="card-body">
            <h6 class="card-title">Decision:</h6>

            <select v-model="request.status" name="decision" id="decision">
                <option v-for="decisionOption in useModerator.accessDecisionOptions" :key="decisionOption">
                    {{ decisionOption }}</option>
            </select>
            <div class="text-center">
                <button :disabled="!buttonsAreActive" class="ml-3 btn btn-primary text-end"
                    @click="updateAccessRequest()">Update</button>
            </div>

            <div class="text-danger" v-for="validationMessage in validationMessages" :key="validationMessage">
                {{ validationMessage }}
            </div>
        </div>
    </div>
</template>
    
<style scoped></style>
    