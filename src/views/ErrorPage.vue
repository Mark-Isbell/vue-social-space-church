<script setup lang="ts">
// imports
import router from "@/router";
import { useErrorStore } from "@/stores/error";
import { useAuthStore } from "@/stores/auth";

// state
const auth = useAuthStore();
const error = useErrorStore();

// functions
async function navigateAway() {
    if (auth.member && (auth.member.role === "member" || auth.member.role === "moderator")) {
        await router.push('/main')
    }
    if (auth.member && auth.member.role === "unverified") {
        await router.push('/createaccountuseremail')
    }
    if (auth.member && auth.member.role === "verified") {
        await router.push('/createaccountuseremailconfirmed')
    }
    else if (!auth.member) {

        auth.logout() // this is safe if there's something unexpected in auth
        await router.push('/login')
    }
}
</script>
    
<template>
    <div class="row mt-5">
        <div class="col-3"></div>
        <div class="col-6 text-center">
            Oops! Error encountered: {{ error.customError }}
        </div>
        <div class="col-3"></div>
    </div>

    <div class="row">
        <div class="col-3"></div>
        <div class="col-6 text-center">
            <button @click="navigateAway()" class="btn btn-primary"> Ok </button>
        </div>
        <div class="col-3"></div>
    </div>
</template>
    
<style scoped></style>
    