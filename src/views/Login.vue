<script setup>
// imports
import { onMounted, ref, watch } from "vue";
import router from "@/router";
import { useAuthStore } from "@/stores/auth";
import { useErrorStore } from "@/stores/error";
const error = useErrorStore();
// example: error.logError("my error string goes here and it will navigate automatically for me")
const auth = useAuthStore();

// state
const email = ref("")
const password = ref("")
const validationMessages = ref([]);

// watchers
watch(() => auth.member, (n) => {
    // three potential states for an account:
    // 1: email not confirmed
    // 2: email confirmed but not part of the church
    // 3: email confirmed and church member or moderator
    if (n === null) {
        // no action - unsuccessful login.  Possible future error messaging here.
    }
    if (n.isEmailConfirmed === "no") {
        router.push('createaccountuseremail');
    } else if (n.isEmailConfirmed === "yes" && (n.role === "member" || n.role === "moderator")) {
        // they're verified and are a part of the church
        router.push(auth.returnUrl || '/main');
    } else {
        // push to invite code screen
        router.push('createaccountuseremailconfirmed');
    }
})

function trimEntryFields() {
    let trimmedEmail = email.value.trimLeft().trimRight();
    let trimmedPassword = password.value.trimLeft().trimRight();

    email.value = trimmedEmail;
    password.value = trimmedPassword;
}

async function logInMember() {
    validationMessages.value = [];
    trimEntryFields();
    let result = await auth.login(email.value, password.value)

    if (result === false) {
        validationMessages.value.push("Unsuccessful Login");
    }
    // If true then watcher navigates 
}

onMounted(() => {
    // if member is already logged in do checks
    if (auth.member) {
        if (auth.member.isEmailConfirmed === "no") {
            // not confirmed
            router.push('/createaccountuseremail')
        }
        else if (auth.returnUrl) {
            // if normal member tried to access restricted page prior to login
            router.push(auth.returnUrl);
        }
        else {
            // confirmed and associated with church with no return URL on file
            router.push('/main')
        }
    }
})


</script>
    
<template>
    <div class="row mt-3">
        <div class="col-3"></div>
        <div class="col-6 h4 text-center text-muted">
            Vue-Social-Space-Church
        </div>
        <div class="col-3"></div>
    </div>

    <div class="row">
        <div class="col-12 text-center mt-3">
            Log into Vue-Social-Space-Church
        </div>
    </div>

    <div class="row mt-3">
        <div class="col-4"></div>
        <div class="col-4">
            Email address:
        </div>
        <div class="col-4"></div>
    </div>

    <div class="row">
        <div class="col-4"></div>
        <div class="col-4">
            <input type="text" size="35" v-model="email">
        </div>
        <div class="col-4"></div>
    </div>

    <div class="row mt-3">
        <div class="col-4"></div>
        <div class="col-4">
            Password:
        </div>
        <div class="col-4"></div>
    </div>

    <div class="row">
        <div class="col-4"></div>
        <div class="col-4">
            <input type="password" size="35" v-model="password" v-on:keyup.enter="logInMember()">
        </div>
        <div class="col-4"></div>
    </div>

    <div class="row mt-3">
        <div class="col-4"></div>
        <div class="col-4 text-center">
            <button class="btn btn-primary" @click="logInMember()">Log In</button>
        </div>
        <div class="col-4"></div>
    </div>

    <div class="row mt-3">
        <div class="col-4"></div>
        <div class="col-4 text-center">
            <div class="text-danger" v-for="validationMessage in validationMessages" :key="validationMessage">
                {{ validationMessage }}
            </div>
        </div>
        <div class="col-4"></div>
    </div>

    <div class="row mt-5">
        <div class="col-3"></div>
        <div class="col-3 text-center">
            <router-link to="/createaccountuser"> Sign up</router-link>
        </div>
        <div class="col-3">
            <router-link to="/requestpasswordreset"> Forgot your password?</router-link>
        </div>
        <div class="col-3"></div>
    </div>


    <!--
            <div class="row mt-5 ">
        <div class="col-3"></div>
        <div class="col-6 text-center">
            Demonstration logins:
        </div>
        <div class="col-3 mb-5"></div>
    </div>

    <div class="row ">
        <div class="col-3"></div>
        <div class="col-6 text-center">
            email: moderator@email.com | password: password
        </div>
        <div class="col-3 mb-5"></div>
    </div>


    <div class="row">
        <div class="col-3"></div>
        <div class="col-6 text-center">
            email: member@email.com | password: password
        </div>
        <div class="col-3 mb-5"></div>
    </div>
    -->
</template>
    
<style scoped>
.visibleBorder {
    border: 1px solid black;
}
</style>
    