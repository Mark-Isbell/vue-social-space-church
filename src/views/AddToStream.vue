<script setup>
// imports

import { useModeratorStore } from "@/stores/moderator";
import { useStreamStore } from "@/stores/stream";
import { computed, onMounted, ref } from "vue";
import StreamSelectForAdd from "../components/StreamSelectForAdd.vue";

// state
const useModerator = useModeratorStore();
const useStream = useStreamStore();
const emit = defineEmits(['cancel', 'addmember']);
const isAddButtonActive = ref(false);
const errorList = ref([]);
const successMessage = ref("");
const showSuccess = ref(false);
const streamIndex = ref(-1);

async function add() {
    isAddButtonActive.value = false;

    if (objectVarsAreValidated()) {
        const result = await useModerator.addToStream({ memberId: useModerator.addMemberSearchReturnedId, streamId: useModerator.addToStreamId });

        if (result === true) {
            showSuccessMessage();
            useModerator.addMemberSearchUserName = "";
            useModerator.addMemberSearchReturnedName = "";
            useModerator.addMemberSearchReturnedId = "";
            useModerator.addMemberSearchReturnedRole = "";
        }
    }
    else {
        // problem
    }
}

function showSuccessMessage() {
    successMessage.value = "Member " + useModerator.addMemberSearchReturnedName + " is now a part of the " + useModerator.addToStreamName + " stream.";
    showSuccess.value = true;
}

function isMemberAlreadyInStream() {
    // this does not check a specific status of the streammember record
    streamIndex.value = useModerator.addMemberStreamList.findIndex(stream => stream.streamId === useModerator.addToStreamId);

    if (streamIndex.value > -1) {
        return true;
    } else {
        return false;
    }
}

function objectVarsAreValidated() {
    errorList.value = [];
    showSuccess.value = false;
    // now check to see that a stream and member are both chosen
    if (useModerator.addToStreamId === "" || useModerator.addMemberSearchReturnedId === "") {
        errorList.value.add("Please select a stream along with a member.");
        return false;
    }

    // placeholder for possible second check for existing stream ID in member's list
    return true;
}

async function searchActivated() {

    errorList.value = [];
    showSuccess.value = false;
    if (isValidated()) {
        const memberSearchResult = await useModerator.getNewStreamMemberByName();

        if (memberSearchResult === true && useModerator.addMemberSearchReturnedName !== "" && (isMemberAlreadyInStream() === false)) {
            isAddButtonActive.value = true;
        } else {
            if (memberSearchResult === true && isMemberAlreadyInStream() === true) {
                errorList.value.push("Member is / was already a member of this church stream with status: " + useModerator.addMemberStreamList[streamIndex.value].streamMemberStatus)
            }
            else {
                // no action
            }
        }
    }
}

function isValidated() {
    if (useModerator.addMemberSearchUserName !== "" && useModerator.addToStreamId !== "") {
        return true;
    } else {
        errorList.value.push("Please select a stream and enter a user name");
        return false;
    }
}

// STREAM SELECT FUNCTIONS BELOW

const showStreamDetails = computed(() => {
    if (useModerator.addToStreamName === "") {
        return false;
    } else {
        return true;
    }
})

function clearAnyExistingValues() {
    useModerator.addToStreamId = "";
    useModerator.addToStreamStatus = "";
    useModerator.addToStreamDescription = "";

    // Clear any member search results when a new stream is selected - another approach is to 
    // retrigger validations and leave the member search result
    useModerator.addMemberSearchUserName = "";
    useModerator.addMemberStreamList = [];
    useModerator.addMemberSearchReturnedId = "";
    useModerator.addMemberSearchReturnedRole = "";
    useModerator.addMemberSearchReturnedName = "";
    useModerator.addMember = {};

    successMessage.value = "";
    showSuccess.value = false;
}

function newStreamSelection() {
    clearAnyExistingValues()
    // find index of stream in stream headers using stream name
    const headerIndex = useStream.getStreamIndexByName(useModerator.addToStreamName);

    loadFromStreamHeaders(headerIndex);
}

function loadFromStreamHeaders(headerIndex) {
    useModerator.addToStreamId = useStream.streamHeaders[headerIndex].streamId;
    useModerator.addToStreamStatus = useStream.streamHeaders[headerIndex].streamStatus;
    useModerator.addToStreamDescription = useStream.streamHeaders[headerIndex].streamDescription;
}


function populateStreamNameChoices() {
    let streamNames = [];
    for (let i = 0; i < useStream.streamHeaders.length; i++) {
        if (useStream.streamHeaders[i].streamName !== "church") { streamNames.push(useStream.streamHeaders[i].streamName) }
    }
    useModerator.addToStreamNames = streamNames;

}

onMounted(async () => {

    await useStream.getStreamHeaders();
    populateStreamNameChoices();
})

</script>
    
<template>
    <div class="row mt-3">
        <div class="col-12 h4 text-center">
            Add Member(s) to Stream
        </div>
    </div>

    <div v-if="showStreamDetails">

        <div class="row mt-3">
            <div class="col-12 h6 text-center">
                Stream Information
            </div>
        </div>
        <div class="row">
            <div class="col-12 text-center">
                Stream name: {{ useModerator.addToStreamName }}
            </div>
        </div>
        <div class="row">
            <div class="col-12 text-center">
                Stream description: {{ useModerator.addToStreamDescription }}
            </div>
        </div>
        <div class="row">
            <div class="col-12 text-center">
                Stream status: {{ useModerator.addToStreamStatus }}
            </div>
        </div>

    </div>

    <div class="row mt-2">
        <StreamSelectForAdd @newSelection="newStreamSelection()"></StreamSelectForAdd>
    </div>

    <div class="row mt-3">
        <div class="col-3"></div>
        <div class="col-6 h6 text-center">
            Member Search
        </div>
        <div class="col-3"></div>
    </div>

    <div class="form-group">
        <div class="input-group mb-3">
            <input type="text" v-model="useModerator.addMemberSearchUserName" class="form-control"
                placeholder="Enter username" aria-label="Enter username" aria-describedby="button-addon2">
            <button class="btn btn-primary" type="button" id="button-addon2" @click="searchActivated()">Search</button>
        </div>
    </div>

    <div class="card mb-3">
        <h6 class="card-header">Search Result:</h6>
        <div class="card-body">
            <p class="card-text">{{ useModerator.addMemberSearchReturnedName }}</p>
        </div>
    </div>

    <div class="row mb-2">
        <div class="col-lg-12 text-center">
            <div class="text-danger" v-for="error in errorList" :key="error">
                {{ error }}
            </div>
        </div>
    </div>

    <div v-show="showSuccess" class="row mb-2">
        <div class="col-lg-12 text-center text-success">
            {{ successMessage }}
        </div>
    </div>

    <div class="row">
        <div class="col-lg-12 text-center">
            <button class="btn btn-primary me-3" :disabled="!isAddButtonActive" type="button" @click="add()">Add
                Member to Stream</button>
        </div>
    </div>
</template>
    
<style scoped></style>
    