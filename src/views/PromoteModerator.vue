<script setup>
// imports
import { useModeratorStore } from "@/stores/moderator";
import { ref } from "vue";

// state
const useModerator = useModeratorStore();
const emit = defineEmits(['cancel', 'addmember']);
const isPromoteButtonActive = ref(false);
const errorList = ref([]);
const props = defineProps({
    directMessageId: {},
});
const successMessage = ref("");
const showSuccess = ref(false);

async function promote() {
    isPromoteButtonActive.value = false;
    if (objectVarsAreValidated()) {
        const result = await useModerator.promoteModerator({ memberId: useModerator.newModeratorSearchReturnedId });

        if (result === true) {
            useModerator.newModeratorSearchUserName = "";
            useModerator.newModeratorSearchReturnedName = "";
            useModerator.newModeratorSearchReturnedId = "";
            useModerator.newModeratorSearchReturnedRole = "";
            showSuccessMessage();
        }
    }
    else {
        // no action - problem promoting to moderator. Possible future error messaging location.
    }
}

function showSuccessMessage() {
    successMessage.value = "Member " + useModerator.newModerator.userName + " is now a " + useModerator.newModerator.role + ".";
    showSuccess.value = true;
}

function isMemberAlreadyModerator() {
    if (useModerator.newModeratorSearchReturnedRole === "moderator") {
        return true;
    } else {
        return false;
    }
}

function objectVarsAreValidated() {

    if (isMemberAlreadyModerator() === false) {
        return true;
    } else {
        return false;
    }
}

async function searchActivated() {
    errorList.value = [];
    showSuccess.value = false;
    if (isValidated()) {
        const result = await useModerator.getChurchMemberByName()
        if (result === true && useModerator.newModeratorSearchReturnedName !== "" && (isMemberAlreadyModerator() === false && (isMemberUnValidated() === false))) {
            isPromoteButtonActive.value = true;
        } else {
            if (result === true && isMemberAlreadyModerator() === true) {
                errorList.value.push(useModerator.newModeratorSearchReturnedName + " is already a moderator")
            }
            else {
                if (result === true && isMemberUnValidated() === true) {
                    errorList.value.push(useModerator.newModeratorSearchReturnedName + " is not a validated church member yet")
                }
                else {
                    // no action
                }
            }
        }
    }
}

function isValidated() {
    if (useModerator.newModeratorSearchUserName !== "") {
        return true;
    } else {
        errorList.value.push("Please enter a user name");
        return false;
    }
}

function isMemberUnValidated() {
    if (useModerator.newModeratorSearchReturnedRole !== "member" && useModerator.newModeratorSearchReturnedRole !== "moderator") {
        return true;
    } else {
        return false;
    }

}

</script>
    
<template>
    <div>

        <div class="row mt-3">
            <div class="col-3"></div>
            <div class="col-6 h4 text-center">
                Promote To Moderator
            </div>
            <div class="col-3"></div>
        </div>

        <div class="form-group">
            <div class="input-group mb-3">
                <input type="text" v-model="useModerator.newModeratorSearchUserName" class="form-control"
                    placeholder="Enter username" aria-label="Enter username" aria-describedby="button-addon2">
                <button class="btn btn-primary" type="button" id="button-addon2" @click="searchActivated()">Search</button>
            </div>
        </div>

        <div class="card mb-3">
            <h6 class="card-header">Search Result:</h6>
            <div class="card-body">
                <p class="card-text">{{ useModerator.newModeratorSearchReturnedName }}</p>
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
                <button class="btn btn-primary me-3" :disabled="!isPromoteButtonActive" type="button"
                    @click="promote()">Promote To Moderator</button>
            </div>
        </div>
    </div>
</template>
    
<style scoped></style>
    