<script setup>
// imports
import { onMounted, ref } from "vue";
import AccessRequest from "../components/AccessRequest.vue";
import { useModeratorStore } from "@/stores/moderator";
// state
const useModerator = useModeratorStore();
const showAccessequests = ref(false);
const showNoneMessage = ref(false);

function newSort() {
    if (useModerator.currentAccessRequestSort === "recent") {

        useModerator.accessRequests.sort((a, b) => {
            if (b.createdAt < a.createdAt)
                return -1;
            if (b.createdAt > a.createdAt)
                return 1;
            return 0;
        })
    }
    if (useModerator.currentAccessRequestSort === "oldest") {

        useModerator.accessRequests.sort((a, b) => {
            if (a.createdAt < b.createdAt)
                return -1;
            if (a.createdAt > b.createdAt)
                return 1;
            return 0;
        })
    }
    if (useModerator.currentAccessRequestSort === "stream") {
        useModerator.accessRequests.sort((a, b) => {
            if (a.streamName < b.streamName)
                return -1;
            if (a.streamName > b.streamName)
                return 1;
            return 0;
        })
    }
}

onMounted(async () => {
    await useModerator.getPendingAccessRequests()
    if (useModerator.accessRequests) {
        showAccessequests.value = true;
    }
    else {
        showNoneMessage.value = true;
    }
})

</script>
    
<template>
    <div class="h4 mt-3 text-center">
        Stream Access Requests
    </div>

    <div class="text-center mb-5">
        The following members have requested access to streams that require your approval.
        Please decide on whether you should grant access to the indicated streams for the
        members listed.
    </div>

    <div class="text-center card border-primary mb-3">
        <div class="card-header">Sorting Options</div>
        <div class="card-body">
            <select v-model="useModerator.currentAccessRequestSort" @change=newSort() name="sortingOption"
                id="sortingOption">
                <option v-for="sortingOption in useModerator.accessRequestSort" :key="sortingOption">
                    {{ sortingOption }}</option>
            </select>
        </div>
    </div>

    <div v-if="showAccessequests">
        <div v-for="request in useModerator.accessRequests" :key="request">
            <AccessRequest :request="request"></AccessRequest>
        </div>
    </div>

    <div class="row mt-4" v-if="showNoneMessage">
        <div class="col-4"></div>
        <div class="col-6">
            - No pending access requests found -
        </div>
        <div class="col-2"></div>
    </div>
</template>
    
<style scoped></style>
    