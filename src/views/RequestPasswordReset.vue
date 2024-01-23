<script setup>
// imports
import { watch, ref } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useErrorStore } from "@/stores/error";
const error = useErrorStore();
// example: error.logError("my error string goes here and it will navigate automatically for me")

// state
const auth = useAuthStore();
const email = ref("");
const emailSentTo = ref("");
const resultMessage = ref("");
const displayResultMessage = ref(false);
const activeOrNot = ref(true);
// error messages
const validationMessages = ref([]);

watch(() => email.value, (n) => {

    activeOrNot.value = true;
})

async function requestResetLink() {
    validationMessages.value = [];
    let isEmailFormatValid = isEmailValid();
    if (isEmailFormatValid) {
        activeOrNot.value = false;
        const result = await auth.requestPasswordReset(email.value);
        if (result === true) {
            emailSentTo.value = email.value;
            email.value = "";
            displayResultMessage.value = true;
            resultMessage.value = "Password reset link sent to: " + emailSentTo.value
        }
        else if (result === false) {
            // interrogate the error
            if (auth.passwordResetRequestErrorMessage === "") {
                validationMessages.value.push("Server error");
            }
            else
            // ENUM: "Invalid credentials" || "Email restricted from password change" 
            { validationMessages.value.push(auth.passwordResetRequestErrorMessage) };
        }
    }
    else {
        validationMessages.value.push("Invalid email format")
    }
}

function isEmailValid() {
    return email.value.match(
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
}


</script>
    
<template>
    <div class="row mt-5">
        <div class="col-3"></div>
        <div class="col-6 text-center">
            <p>
                If you forgot your password, enter your email and we will send a password reset link if we find a user
                with the matching email:
            </p>
        </div>
        <div class="col-3"></div>
    </div>

    <div class="row mt-3">
        <div class="col-6 text-end">Your email:</div>
        <div class="col-6"><input type="text" name="" v-model="email"></div>
    </div>

    <div class="row mt-5">
        <div class="col-3"></div>
        <div class="col-6 text-center">
            <button :disabled="!activeOrNot" @click="requestResetLink()" class="btn btn-primary">Request Reset
                Link</button>
        </div>
        <div class="col-3 mb-5"></div>
    </div>

    <div class="row mt-3" v-show="displayResultMessage">
        <div class="col-3"></div>
        <div class="col-6 text-center">
            {{ resultMessage }}
        </div>
        <div class="col-3 mb-5"></div>
    </div>

    <div class="row">
        <div class="col-3"></div>
        <div class="col-6 text-center">
            <div class="text-danger" v-for="validationMessage in validationMessages" :key="validationMessage">
                {{ validationMessage }}
            </div>
        </div>
        <div class="col-3 mb-5"></div>
    </div>
</template>
    
<style scoped></style>
    