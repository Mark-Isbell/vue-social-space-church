<script setup>
// imports
import { onMounted, ref } from "vue";
import { useAuthStore } from "../stores/auth";
import UpdatePassword from "../components/UpdatePassword.vue";

const useAuth = useAuthStore();
const togglePasswordUpdate = ref(false);
const initialPassword = ref();
const validationMessages = ref([]);

function showUpdatePassword() {
    if (togglePasswordUpdate.value === false) { togglePasswordUpdate.value = true; }
    else { togglePasswordUpdate.value = false; }
}

function toggleAllClosed() {
    togglePasswordUpdate.value = false;
}

function validatePassword() {
    if (useAuth.newPassword.length === 0) {
        validationMessages.value.push("please enter a new password");
        return false
    }
    else {
        // check for leading blank
        if ((Array.from(useAuth.newPassword)[0]) === " ") {
            validationMessages.value.push("Password cannot include leading blanks or trailing blanks");
            return false;
        }
        // check for trailing blank
        if ((useAuth.newPassword.slice(-1)) === " ") {
            validationMessages.value.push("Password cannot include leading blanks or trailing blanks");
            return false;
        }
        return true;
    }
}

async function savePassword() {
    validationMessages.value = [];
    if (
        initialPassword.value === useAuth.newPassword
    ) {
        toggleAllClosed()
    } else {

        let isPasswordValid = validatePassword();

        if (isPasswordValid === true) {

            const result = await useAuth.changePassword(useAuth.newPassword);

            if (result === false) {
                useAuth.newPassword = initialPassword.value;
                validationMessages.value.push("Update unsuccessful. Please try again.")
            }
            else {
                toggleAllClosed()
                // update store and local value after a successful update
                useAuth.newPassword = "";
                initialPassword.value = useAuth.newPassword;
            }
        }
        else {
            // validation messages will be displayed until user tries again
        }
    }
}
function cancel() {
    useAuth.newPassword = initialPassword.value
    toggleAllClosed()
}

onMounted(() => {
    // assign initial values to be used in case of cancel
    if (useAuth.member !== null) {
        initialPassword.value = useAuth.newPassword;
    } else {
        // nothing
    }
})

</script>
    
<template>
    <div class="row mt-3">
        <div class="col-3"></div>
        <div class="col-6 h4 text-center">
            Account Security
        </div>
        <div class="col-3"></div>
    </div>

    <div class="row mt-2">
        <div class="col-5 text-end">Password:</div>
        <div class="col-3">******** </div>
        <div class="col-1"><span class="make-clickable" @click="showUpdatePassword()">
                📝
            </span> </div>
        <div class="col-3"></div>
    </div>

    <div v-show="togglePasswordUpdate">
        <div class="row">
            <div class="col-3"></div>
            <div class="col-6 text-center">
                <UpdatePassword @savepassword="savePassword()" @cancel="cancel()">
                </UpdatePassword>
            </div>
            <div class="col-3"></div>
        </div>
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
.make-clickable {
    cursor: pointer;
}
</style>
    