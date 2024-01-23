<script setup>
// imports
import { useModeratorStore } from "@/stores/moderator";

// state
const useModerator = useModeratorStore();
const props = defineProps({
        streamRestriction: {},
        userName: ""
});

async function moderatorRemoveStreamRestriction() {
        const removeResult = await useModerator.unrestrict({
                memberId: props.streamRestriction.memberId,
                streamId: props.streamRestriction.streamId
        })
        if (removeResult === true) {
                const getRestrictionsResult = await useModerator.getMemberRestrictions(props.userName)
                // this call to getRestrictionsResult should destroy the object that called it  
        } else if (removeResult === false) {
                // no action 
        }
}

</script>

<template>
        <div class="card mb-3">
                <h6 class="card-header">Stream Restriction for stream: {{ streamRestriction.streamName }}</h6>
                <div class="card-body">
                        <p class="card-text">
                                Stream Type: {{ streamRestriction.stream.streamType }}
                        </p>
                        <p class="card-text">
                                Stream Status: {{ streamRestriction.stream.streamStatus }}
                        </p>
                        <p class="card-text">
                                Posting Ability: {{ streamRestriction.streamMemberStatus }}
                        </p>
                        <p class="text-center">
                                <button class="btn btn-primary" type="button" @click="moderatorRemoveStreamRestriction()">Remove
                                        Restriction</button>
                        </p>
                </div>
        </div>
</template>

<style scoped></style>
