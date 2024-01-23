<script setup lang="ts">
// imports
import { onMounted, ref, watch } from "vue";
import { useAuthStore } from "@/stores/auth";
import router from "@/router";
import { useRoute } from 'vue-router';
import { useErrorStore } from "@/stores/error";

// state
const error = useErrorStore();
const route = useRoute();
const auth = useAuthStore();
const pleaseWaitMessage = ref("Please wait .");
const confToken = ref();
const isValidated = ref();

async function validateToken() {

    const result = await auth.validateEmailConfirmationToken(confToken.value);
    if (result === true) {
        router.push('createaccountuseremailconfirmed')
    } else {
        error.logError("Oops!  Email not confirmed.")
    }
}

onMounted(() => {

    if (!route.query.token) {
        error.logError("invalid value received for email confirmation token")
    }
    else {
        confToken.value = route.query.token;
        validateToken();
    }
})

</script>
    
<template>
    <div class="row" v-show="!isValidated">
        <div class="col-3"></div>
        <div class="col-6 text-center">
            {{ pleaseWaitMessage }}
        </div>
        <div class="col-3"></div>
    </div>

    <div class="row" v-show="isValidated">
        <div class="col-3"></div>
        <div class="col-6 text-center">
            Email Successfully Validated ... Forwarding...
        </div>
        <div class="col-3"></div>
    </div>
</template>

<style scoped></style>
