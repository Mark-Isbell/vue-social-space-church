<script setup>
// imports
import { ref } from "vue";
import { useStreamStore } from "@/stores/stream";

// state
const useStream = useStreamStore();
const showPositiveResult = ref(false);
const activeOrNot = ref(true);
const validationMessages = ref([]);

async function validateAndCreate() {
    let isValidated = validateFields()
    if (isValidated) {
        const streamObject = createStreamObject();
        const result = await useStream.postNewStream(streamObject)
        if (result === true) {
            clearEntryFields();
            showPositiveResult.value = true;
            activeOrNot.value = false;
        } else {
            validationMessages.value.push("Problem encountered; new stream not created");
        }
    }
}

function clearEntryFields() {
    useStream.newStreamName = "";
    useStream.newStreamType = "";
    useStream.newStreamDescription = "";
}

function validateFields() {
    validationMessages.value = []
    if (useStream.newStreamName === "") {
        validationMessages.value.push("Missing Stream Name")
    }
    if (useStream.newStreamType === "") {
        validationMessages.value.push("Missing Stream Type")
    }
    if (useStream.newStreamDescription === "") {
        validationMessages.value.push("Missing Stream Description")
    }
    if (validationMessages.value.length > 0) {
        return false;
    } else { return true; }
}

function createStreamObject() {
    return {
        streamName: useStream.newStreamName,
        streamType: useStream.newStreamType,
        streamDescription: useStream.newStreamDescription
    }
}

</script>
    
<template>
    <div class="row mt-5">
        <div class="col-3"></div>
        <div class="col-6 h4 text-center">
            Create new stream
        </div>
        <div class="col-3"></div>
    </div>

    <div class="row mt-3">
        <div class="col-6"></div>
        <div class="col-6">{{ useStream.newStreamName }}</div>
    </div>

    <div class="row mt-3">
        <div class="col-6 text-end">Stream Name:</div>
        <div class="col-6"><input v-model="useStream.newStreamName" type="text" name="" id=""></div>
    </div>

    <div class="row mt-3">
        <div class="col-6 text-end">Stream Type:</div>
        <div class="col-3">
            <select v-model="useStream.newStreamType" name="streamType" id="streamType">
                <option value="normal">normal</option>
                <option value="singles">singles</option>
                <option value="custom">custom</option>
            </select>
        </div>
        <div class="col-3"></div>
    </div>

    <div class="row mt-3">
        <div class="col-6 text-end">Stream Description:</div>
        <div class="col-3">{{ useStream.newStreamDescription }}</div>
        <div class="col-3">
        </div>
    </div>

    <div class="row mt-2">
        <div class="col-3"></div>
        <div class="col-8 text-center">
            <textarea v-model="useStream.newStreamDescription" rows="5" cols="40" type="text" name="" id=""> </textarea>
        </div>
        <div class="col-1"></div>
    </div>

    <div class="row mt-4">
        <div class="col-3"></div>
        <div class="col-6 text-center">
            <button :disabled="!activeOrNot" class="btn btn-primary" @click="validateAndCreate()">Create Stream</button>
        </div>
        <div class="col-3"></div>
    </div>


    <div class="row mt-4" v-show="showPositiveResult">
        <div class="col-3"></div>
        <div class="col-6 text-center text-success">
            Stream successfully created!
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
    