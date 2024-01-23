<script setup>
// imports
import { onMounted, ref } from "vue";
import { useStreamStore } from "@/stores/stream";
import { useMemberStore } from "@/stores/member";

const useStream = useStreamStore();
const useMember = useMemberStore();
const requestButtonIsActive = ref(true);
const cancelButtonIsActive = ref(true);
const emit = defineEmits(['cancelrequest', 'requestdone']);
const validationMessages = ref([]);
const errorMessages = ref([]);
const showExistingRequests = ref(false);
const showSuccess = ref(false);
const showErrorMessages = ref(false);

async function requestJoin() {
    if (pendingRequestExists()) {
        errorMessages.value.push("Previous request already sent.")
        cancelButtonIsActive.value = true;
    }
    else {
        requestButtonIsActive.value = false;
        cancelButtonIsActive.value = false;
        const result = await useMember.requestToJoinStream(useStream.getStreamId());
        if (result === true) {
            await useMember.getExistingStreamRequests(useStream.getStreamId())
            useMember.requestJoinMessage = "";
            showSuccess.value = true;
            showExistingRequests.value = true;
        } else {
            useMember.requestJoinMessage = "";
            errorMessages.value.push("request not created.")
            showErrorMessages.value = true;
        }
    }
}

function cancel() {
    useMember.requestJoinMessage = "";
    if (useStream.priorStreamId === "") { useStream.currentStreamName = "church" }
    else {
        useStream.currentStreamName = useStream.getStreamName();
    }
    emit('cancelrequest');
}

function pendingRequestExists() {
    const indexOfPending = useMember.existingStreamRequests.findIndex(request => request.requestStatus === "pending");
    if (indexOfPending > -1) { return true; }
    else { return false; }
}

onMounted(async () => {
    await useMember.getExistingStreamRequests(useStream.getStreamId())
    if (useMember.existingStreamRequests) {
        showExistingRequests.value = true;
        if (pendingRequestExists()) {
            requestButtonIsActive.value = false;
        }
    }
})

</script>
    
<template>
    <div class="row">
        <div class="col-3"></div>
        <div class="col-6 text-center">
            Request to join stream: {{ useStream.requestJoinMessage }}
        </div>
        <div class="col-3"></div>
    </div>

    <div class="row mt-2">
        <div class="col-3"></div>
        <div class="col-8">
            <textarea v-model="useMember.requestJoinMessage" rows="5" cols="40" type="text" name="" id=""> </textarea>
        </div>
        <div class="col-1"></div>
    </div>

    <div class="row mt-4">
        <div class="col-4"></div>
        <div class="col-2">
            <button :disabled="!requestButtonIsActive" class="btn btn-primary text-end" @click="requestJoin()">Send
                Request
                To Join</button>
        </div>
        <div class="col-2">
            <button :disabled="!cancelButtonIsActive" class="btn btn-primary" @click="cancel()">Cancel</button>
        </div>
        <div class="col-4"></div>
    </div>

    <div class="row mt-3" v-show="showSuccess">
        <div class="col-3"></div>
        <div class="col-6 text-center text-success">
            Request sent to Moderator(s)
        </div>
        <div class="col-3"></div>
    </div>

    <div class="row mt-3 mb-1">
        <div class="col-4"></div>
        <div class="col-6">
            <div class="text-danger" v-for="validationMessage in validationMessages" :key="validationMessage">
                {{ validationMessage }}
            </div>
        </div>
        <div class="col-2"></div>
    </div>

    <div class="row mt-3 mb-1" v-show="showErrorMessages">
        <div class="col-4"></div>
        <div class="col-6">
            <div class="text-danger" v-for="errorMessage in errorMessages" :key="errorMessage">
                {{ errorMessage }}
            </div>
        </div>
        <div class="col-2"></div>
    </div>

    <div class="row mt-4" v-if="showExistingRequests">
        <div class="col-3"></div>
        <div class="col-6">
            Requests previously sent to moderator(s) for access to stream:
        </div>
        <div class="col-3"></div>
    </div>

    <div class="row mt-3 mb-1" v-if="showExistingRequests">
        <div class="col-3"></div>
        <div class="col-6">
            <div class="text-danger" v-for="request in useMember.existingStreamRequests" :key="request">
                {{ request }}
            </div>
        </div>
        <div class="col-3"></div>
    </div>
</template>
    
<style scoped></style>
    