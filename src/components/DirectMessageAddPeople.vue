<script setup>
// imports
import { useChurchStore } from "@/stores/church";
import { useDirectMessageStore } from "@/stores/directmessage";
import { ref } from "vue";

// state
const useChurch = useChurchStore();
const useDirectMessage = useDirectMessageStore();
const emit = defineEmits(['cancel', 'addmember']);
const isAddButtonActive = ref(false);
const errorList = ref([]);
const props = defineProps({
    directMessageId: {},
});

function cancel() {
    errorList.value = [];
    resetSearchFields();
    emit('cancel');
}

function resetSearchFields() {
    useChurch.memberSearchUserName = "";
    useChurch.memberSearchReturnedName = "";
    useChurch.memberSearchReturnedId = "";
}

async function add() {
    isAddButtonActive.value = false;
    if (objectVarsAreValidated()) {
        const result = await useDirectMessage.addMemberToDirectMessage(getDMMemberObject())
        if (result === true) {
            resetSearchFields();
            emit('addmember');
        }
    }
    else {
        // do nothing - problem adding member to direct message
    }
}

function isMemberAlreadyInDirectMessage() {
    const dmIndex = useDirectMessage.directMessageHeaders.findIndex(header => header.directMessageId === props.directMessageId);
    const dmParticipantString = useDirectMessage.directMessageHeaders[dmIndex].participantString;
    if (dmParticipantString.includes(useChurch.memberSearchReturnedName)) {
        return true;
    } else {
        return false;
    }
}

function objectVarsAreValidated() {
    if ((isMemberAlreadyInDirectMessage() === false) && useChurch.memberSearchReturnedId !== "" && useDirectMessage.currentDirectMessage.directMessageId !== "") {
        return true;
    } else {
        return false;
    }
}

function getDMMemberObject() {
    return {
        memberId: useChurch.memberSearchReturnedId,
        directMessageId: props.directMessageId
    }
}

async function searchActivated() {
    errorList.value = [];
    if (isValidated()) {
        const result = await useChurch.getChurchMemberByName(useChurch.memberSearchUserName)
        if (result === true && useChurch.memberSearchReturnedName !== "" && (isMemberAlreadyInDirectMessage() === false)) {
            isAddButtonActive.value = true;
        } else {
            if (isMemberAlreadyInDirectMessage()) {
                errorList.value.push("Member is already in direct message")
            }
        }
    }
}

function isValidated() {
    if (useChurch.memberSearchUserName !== "") {
        return true;
    } else {
        errorList.value.push("Please enter a user name");
        return false;
    }
}

</script>
    
<template>
    <div class="form-group">
        <div class="input-group mb-3">
            <input type="text" v-model="useChurch.memberSearchUserName" class="form-control" placeholder="Enter username"
                aria-label="Enter username" aria-describedby="button-addon2">
            <button class="btn btn-primary" type="button" id="button-addon2" @click="searchActivated()">Search</button>
        </div>
    </div>

    <div class="card mb-3">
        <h6 class="card-header">Search Result:</h6>
        <div class="card-body">
            <p class="card-text">{{ useChurch.memberSearchReturnedName }}</p>
        </div>
    </div>

    <div class="row mb-2">
        <div class="col-lg-12 text-center">
            <div class="text-danger">
                WARNING: New recipients will see older messages!
            </div>
        </div>
    </div>
    <div class="row mb-2">
        <div class="col-lg-12 text-center">
            <div class="text-danger">
                HINT: To keep older message private from new member, create a NEW direct message with the same members
                plus new member.
            </div>
        </div>
    </div>

    <div class="row mb-2">
        <div class="col-lg-12 text-center">
            <div class="text-danger" v-for="error in errorList" :key="error">
                {{ error }}
            </div>
        </div>
    </div>

    <div class="row">
        <div class="col-lg-12 text-center">
            <button class="btn btn-primary me-3" :disabled="!isAddButtonActive" type="button" @click="add()">Add</button>
            <button class="btn btn-primary me-3" type="button" @click="cancel()">Cancel</button>
        </div>
    </div>
</template>
    
<style scoped></style>
    