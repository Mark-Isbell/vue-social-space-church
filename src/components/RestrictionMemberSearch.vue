<script setup>
// imports
import { useModeratorStore } from "@/stores/moderator";
import { onMounted, ref } from "vue";

// state
const useModerator = useModeratorStore();
const emit = defineEmits(['searchactivated']);
const errorList = ref([]);

async function searchActivated() {
    clearSearchResults();
    emit('searchactivated');
    errorList.value = [];
    if (isValidated()) {
        const result = await useModerator.getMemberRestrictions(useModerator.restrictionSearchName)

        if (result !== true) {
            errorList.value.push("Problem retreiving information");
        }
    }
}

function clearSearchResults() {
    useModerator.allMemberRestrictions = {};
    useModerator.restrictionSearchStatus = "";
    useModerator.restrictionMemberId = 0;
    useModerator.restrictionUserName = "";
    useModerator.restrictionRole = "";
    useModerator.restrictionGlobal = "";
    useModerator.restrictionChurchLevel = "";
    useModerator.showOptionToRemoveChurchLevelRestriction = false;
    useModerator.restrictionNumberOfStreamRestrictions = 0;
    useModerator.restrictionStreamLevel = [];
}

function isValidated() {
    if (useModerator.restrictionSearchName !== "") {
        return true;
    } else {
        errorList.value.push("Please enter a user name");
        return false;
    }
}

function resetSearchVariablesAndResults() {
    useModerator.restrictionSearchName = "";
    useModerator.allMemberRestrictions = {};
    useModerator.restrictionSearchStatus = "";
    useModerator.restrictionMemberId = 0;
    useModerator.restrictionUserName = "";
    useModerator.restrictionRole = "";
    useModerator.restrictionGlobal = "";
    useModerator.restrictionChurchLevel = "";
    useModerator.showOptionToRemoveChurchLevelRestriction = false;
    useModerator.restrictionNumberOfStreamRestrictions = 0;
    useModerator.restrictionStreamLevel = [];
}

onMounted(() => {
    // reset store variables
    resetSearchVariablesAndResults();
})

</script>
    
<template>
    <div class="form-group">
        <div class="input-group mb-3">
            <input type="text" v-model="useModerator.restrictionSearchName" class="form-control"
                placeholder="Enter username" aria-label="Enter username" aria-describedby="button-addon2">
            <button class="btn btn-primary" type="button" id="button-addon2" @click="searchActivated()">Search</button>
        </div>
    </div>

    <div class="card mb-3">
        <h6 class="card-header">Account Information</h6>
        <div class="card-body">
            <p class="card-text"> Username: {{ useModerator.restrictionUserName }}</p>
        </div>
        <div class="card-body">
            <p class="card-text"> Role: {{ useModerator.restrictionRole }}</p>
        </div>
    </div>

    <div class="row mb-2">
        <div class="col-lg-12 text-center">
            <div class="text-danger" v-for="error in errorList" :key="error">
                {{ error }}
            </div>
        </div>
    </div>
</template>
    
<style scoped></style>
    