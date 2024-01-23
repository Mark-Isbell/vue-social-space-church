<script setup>
// imports
import { ref } from "vue";
import { useStreamStore } from "@/stores/stream";
import { useMemberStore } from "@/stores/member";

// state
const useStream = useStreamStore();
const useMember = useMemberStore();
const showSuccessMessage = ref(false);
const buttonsAreActive = ref(true);
const errorMessages = ref([]);
const emit = defineEmits(['canceljoin', 'streammembershipdone']);

async function joinStream() {
    buttonsAreActive.value = false;
    const result = await useMember.joinStream(useStream.getStreamId())
    if (result === true) {
        showSuccessMessage.value = true;
        emit('streammembershipdone');
    }
    else {
        errorMessages.value.push("Oops!  Something went wrong.")
        // emit cancel signal back to main.vue 
    }
}

function cancel() {
    if (useStream.priorStreamId === "") { useStream.currentStreamName = "church" }
    else {
        useStream.currentStreamName = useStream.getStreamName();
    }
    emit('canceljoin');
}

</script>
    
<template>

    <div class="row mt-5">
        <div class="col-3"></div>
        <div class="col-6 text-center">
            <p>
                {{useStream.currentStreamName}} is open to all church members.
                Would you like to join this stream?
            </p>
        </div>
        <div class="col-3"></div>
    </div>


    <div class="row mt-3">
        <div class="col-6 text-end">Stream Description:</div>
        <div class="col-3">Stream Description: (stream description goes here)</div>
        <div class="col-3">
        </div>
    </div>

    <div class="row mt-4">
        <div class="col-4"></div>
        <div class="col-2">
            <button :disabled="!buttonsAreActive" class="btn btn-primary text-end" @click="joinStream()">Join
                Stream</button>
        </div>
        <div class="col-2">
            <button :disabled="!buttonsAreActive" class="btn btn-primary" @click="cancel()">Cancel</button>
        </div>
        <div class="col-4"></div>
    </div>

    <div class="row" v-show="showSuccessMessage">
        <div class="col-3"></div>
        <div class="col-6 text-center text-success">
            Joined Stream!
        </div>
        <div class="col-3"></div>
    </div>

</template>
    
<style scoped>

</style>
    