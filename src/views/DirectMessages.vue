<script setup>
// imports
import router from "@/router";
import { onMounted, ref } from "vue";
import DirectMessage from "../components/DirectMessage.vue";
import { useDirectMessageStore } from "@/stores/directmessage";

// state
const useDirectMessage = useDirectMessageStore();
const showNoDirectMessages = ref(false);
const showDirectMessageComponent = ref(false);

function navigateToChurchMembers() {
    router.push({ path: '/churchmembers' })
}

onMounted(async () => {
    await useDirectMessage.getDirectMessageHeaders();
    if (useDirectMessage.directMessageHeaders.length > 0) {
        showDirectMessageComponent.value = true;
    }
    else {
        showNoDirectMessages.value = true;
    }
})
</script>
    
<template>
    <div class="row mt-3">
        <div class="col-3"></div>
        <div class="col-6 h4 text-center">
            Direct Messages
        </div>
        <div class="col-3"></div>
    </div>

    <div v-if="showDirectMessageComponent">
        <DirectMessage></DirectMessage>
    </div>

    <div v-show="showNoDirectMessages" class="row mt-5">
        <div class="col-3"></div>
        <div class="col-6 text-center">
            <p>It looks like you don't have any direct messages!
            </p>
            <p>Hint: To start a new direct message, click on the "Direct Message" button in a church member's profile.
            </p>
            <p>
                <button class="btn btn-primary" @click="navigateToChurchMembers()">Show Church Members</button>
            </p>
        </div>
        <div class="col-3"></div>
    </div>
</template>
    
<style scoped></style>
    