<script setup>
// imports
import { computed, ref } from "vue";
import RestrictionMemberSearch from "../components/RestrictionMemberSearch.vue";
import RestrictionStreamCard from "../components/RestrictionStreamCard.vue";
import { useModeratorStore } from "@/stores/moderator";

// state
const useModerator = useModeratorStore();
const removeChurchLevelJoinRestrictionErrors = ref([]);

// state
const showMemberSearch = ref(true);

const displayStreamRestrictions = computed(() => {
    let displayStreamRestrictionLoop = false;
    if (useModerator.restrictionNumberOfStreamRestrictions !== 0) {
        displayStreamRestrictionLoop = true;
    }
    return displayStreamRestrictionLoop;
})

async function removeChurchRestriction() {

    removeChurchLevelJoinRestrictionErrors.value = [];

    const result = await useModerator.undoChurchRestriction({
        memberId: useModerator.restrictionMemberId
    })
    if (result === true) {
        const getRestrictionsResult = await useModerator.getMemberRestrictions(useModerator.restrictionUserName);
    }
    if (result === false) {
        removeChurchLevelJoinRestrictionErrors.value.push("Problem encountered with removing restriction")
    }
}

async function searchActivated() {
    removeChurchLevelJoinRestrictionErrors.value = [];
}

</script>
    
<template>
    <div class="row">
        <div class="col-3"></div>
        <div class="col-6 h4 mt-3 text-center">
            Restrictions
        </div>
        <div class="col-3"></div>
    </div>

    <div v-if="showMemberSearch">
        <RestrictionMemberSearch @searchactivated="searchActivated()">
        </RestrictionMemberSearch>
    </div>

    <div class="card mb-3">
        <h6 class="card-header">Account Restrictions</h6>
        <div class="card-body">
            <p class="card-text"> Church Join Restriction: {{ useModerator.restrictionChurchLevel }}</p>
            <p v-if="useModerator.showOptionToRemoveChurchLevelRestriction" class="text-center">
                <button class="btn btn-primary" type="button" @click="removeChurchRestriction()">Remove
                    Restriction on Joining Church</button>
            </p>

            <div class="text-danger" v-for="message in removeChurchLevelJoinRestrictionErrors" :key="message">
                {{ message }}
            </div>
        </div>
    </div>

    <div class="card mb-3">
        <h6 class="card-header">Church Stream Restrictions</h6>
        <div class="card-body">
            <p class="card-text"> Number of streams restricted: {{ useModerator.restrictionNumberOfStreamRestrictions }}
            </p>
            <p v-if="displayStreamRestrictions">
                <RestrictionStreamCard v-for="streamRestriction in useModerator.restrictionStreamLevel"
                    :key="streamRestriction" :streamRestriction=streamRestriction
                    :userName="useModerator.restrictionUserName">
                </RestrictionStreamCard>
            </p>
        </div>
    </div>
</template>
    
<style scoped></style>
    