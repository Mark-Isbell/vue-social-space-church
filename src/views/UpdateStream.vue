<script setup>
// imports
import { onMounted, ref } from "vue";
import { useStreamStore } from "@/stores/stream";
import StreamSelectForUpdate from "../components/StreamSelectForUpdate.vue";
import { useModeratorStore } from "@/stores/moderator";

// state
const useStream = useStreamStore();
const useModerator = useModeratorStore();
const showPositiveResult = ref(false);
const activeOrNot = ref(true);
const validationMessages = ref([]);

async function validateAndUpdate() {
    let isValidated = validateFields()
    if (isValidated) {
        const streamObject = createStreamObject();
        const result = await useModerator.updateStream(streamObject)
        if (result === true) {
            clearEntryFields();
            await getFreshStreamHeaders();
            showPositiveResult.value = true;
            activeOrNot.value = false;
        }
    }
}

async function getFreshStreamHeaders() {
    await useStream.getStreamHeaders();
    populateStreamNameChoices();
}

function clearEntryFields() {
    useModerator.updateStreamId = "";
    useModerator.updateStreamName = "";
    useModerator.updateStreamStatus = "";
    useModerator.updateStreamDescription = "";
}

function validateFields() {
    validationMessages.value = []
    if (useModerator.updateStreamName === "") {
        validationMessages.value.push("Missing Stream Name")
    }
    if (useModerator.updateStreamStatus === "") {
        validationMessages.value.push("Missing Stream Status")
    }
    if (useModerator.updateStreamDescription === "") {
        validationMessages.value.push("Missing Stream Description")
    }
    if (validationMessages.value.length > 0) {
        return false;
    } else { return true; }
}

function createStreamObject() {
    return {
        streamId: useModerator.updateStreamId,
        name: useModerator.updateStreamName,
        status: useModerator.updateStreamStatus,
        description: useModerator.updateStreamDescription
    }
}

function populateStreamNameChoices() {
    let streamNames = [];
    for (let i = 0; i < useStream.streamHeaders.length; i++) {
        if (useStream.streamHeaders[i].streamName !== "church") { streamNames.push(useStream.streamHeaders[i].streamName) }
    }
    useModerator.updatableStreamNames = streamNames;

}

function loadFromStreamHeaders(headerIndex) {
    useModerator.updateStreamId = useStream.streamHeaders[headerIndex].streamId;
    useModerator.updateStreamStatus = useStream.streamHeaders[headerIndex].streamStatus;
    useModerator.updateStreamDescription = useStream.streamHeaders[headerIndex].streamDescription;
}

function clearAnyExistingValues() {
    useModerator.updateStreamId = "";
    useModerator.updateStreamStatus = "";
    useModerator.updateStreamDescription = "";
}

function newStreamSelection() {
    clearAnyExistingValues()
    // find index of stream in stream headers using stream name
    const headerIndex = useStream.getStreamIndexByName(useModerator.updateStreamName);

    loadFromStreamHeaders(headerIndex);
}

onMounted(async () => {
    await useStream.getStreamHeaders();
    populateStreamNameChoices();
})

</script>
    
<template>
    <div class="row mt-5">
        <StreamSelectForUpdate @newSelection="newStreamSelection()"></StreamSelectForUpdate>
    </div>

    <div class="row mt-3">
        <div class="col-6"></div>
        <div class="col-6">{{ useModerator.updateStreamName }}</div>
    </div>

    <div class="row mt-3">
        <div class="col-6 text-end">Stream Name:</div>
        <div class="col-6"><input v-model="useModerator.updateStreamName" type="text" name="" id=""></div>
    </div>

    <div class="row mt-3">
        <div class="col-6 text-end">Stream Status: {{ useModerator.updateStreamStatus }}</div>
        <div class="col-3">
            <select v-model="useModerator.updateStreamStatus" name="streamStatus" id="streamStatus">
                <option v-for="status in useModerator.updateStatusChoices" :key="status">
                    {{ status }}</option>
            </select>
        </div>
        <div class="col-3"></div>
    </div>

    <div class="row mt-3">
        <div class="col-6 text-end">Stream Description:</div>
        <div class="col-3">{{ useModerator.updateStreamDescription }}</div>
        <div class="col-3">
        </div>
    </div>

    <div class="row mt-2">
        <div class="col-3"></div>
        <div class="col-8 text-center">
            <textarea v-model="useModerator.updateStreamDescription" rows="5" cols="40" type="text" name=""
                id=""> </textarea>
        </div>
        <div class="col-1"></div>
    </div>

    <div class="row mt-4">
        <div class="col-3"></div>
        <div class="col-6 text-center">
            <button :disabled="!activeOrNot" class="btn btn-primary" @click="validateAndUpdate()">Update Stream</button>
        </div>
        <div class="col-3"></div>
    </div>


    <div class="row mt-4" v-show="showPositiveResult">
        <div class="col-3"></div>
        <div class="col-6 text-center text-success">
            Stream successfully updated!
        </div>
        <div class="col-3"></div>
    </div>

    <div class="row mt-3 mb-1">
        <div class="col-4"></div>
        <div class="col-6">
            <div class="text-danger" v-for="message in validationMessages" :key="message">
                {{ message }}
            </div>
        </div>
        <div class="col-2"></div>
    </div>
</template>
    
<style scoped>
div {
    white-space: pre-wrap;
}
</style>
    