<script setup>
// imports
import { onMounted, ref } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useRoute } from 'vue-router';
import { useErrorStore } from "@/stores/error";
import router from "@/router";
const error = useErrorStore();
// example: error.logError("my error string goes here ")

// state
const route = useRoute();
const auth = useAuthStore();
const password1 = ref("");
const password2 = ref("");
const resetToken = ref();
// error messages
const validationMessages = ref([]);

function validatePassword() {

    if (password1.value.length === 0) {
        validationMessages.value.push("please enter a password");
        return false
    }
    if (password1.value !== password2.value) {
        validationMessages.value.push("the re-entry of password does not match");
        return false;
    }
    else {
        // check for leading blank
        if ((Array.from(password1.value)[0]) === " ") {
            validationMessages.value.push("Password cannot include leading blanks or trailing blanks");
            return false;
        }
        // check for trailing blank
        if ((password1.value.slice(-1)) === " ") {
            validationMessages.value.push("Password cannot include leading blanks or trailing blanks");
            return false;
        }
    }
    return true;
}

async function sendReset() {
    validationMessages.value = [];
    if (resetToken.value) {
        let isPasswordValid = validatePassword();

        if (isPasswordValid) {
            const result = await auth.sendResetPassword(resetToken.value, password1.value)

            if (result === true) {
                // router push
                if (auth.member && auth.member.isEmailConfirmed === "no") {
                    router.push('createaccountuseremail');
                } else if (auth.member.isEmailConfirmed === "yes" && (auth.member.role === "member" || auth.member.role === "moderator")) {
                    // conclusion is that they're verified and are a part of the church
                    router.push('/main');
                } else {
                    // push to invite code screen
                    router.push('createaccountuseremailconfirmed');
                }
            } else {
                error.logError("Server error")
            }
        } else {
            // do nothing until user fixes the password issue and try again
        }
    }
    else {
        // route to error page

        error.logError("Invalid password reset token")
    }

}

onMounted(() => {
    // assign initial values to be used in case of cancel

    if (!route.query.token) {
        // route to error page
        error.logError("Invalid value received for password reset token")
    }
    else {
        resetToken.value = route.query.token;

    }
})

</script>
    
<template>
    <div class="row mt-5">
        <div class="col-3"></div>
        <div class="col-6 h4 text-center">
            Please Reset your password:
        </div>
        <div class="col-3"></div>
    </div>


    <div class="row mt-2">
        <div class="col-6 text-end">Your password:</div>
        <div class="col-6"><input type="password" name="password1" v-model="password1"></div>
    </div>

    <div class="row mt-2">
        <div class="col-6 text-end">Re-enter your password:</div>
        <div class="col-6"><input type="password" name="password2" v-model="password2"></div>
    </div>


    <div class="row mt-3 ">
        <div class="col-3"></div>
        <div class="col-6 text-center">
            <button @click="sendReset" class="btn btn-primary">Reset Password</button>
        </div>
        <div class="col-3 mb-5"></div>
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

<style scoped></style>
    