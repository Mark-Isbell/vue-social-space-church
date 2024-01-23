<script setup lang="ts">
// imports
import { useAuthStore } from "../stores/auth";
import { ref } from "vue";

// state
const useAuth = useAuthStore();
const emit = defineEmits(['cancel', 'savepassword']);
const revealPassword = ref(false);

// functions
async function savePassword() {
    emit('savepassword');
}
function cancel() {
    emit('cancel');
}
function toggleRevealPassword() {
    if (revealPassword.value === false) { revealPassword.value = true; } else { revealPassword.value = false }
}

</script>
        
<template>
    <div class="row mt-3">
        <div class="col-6 text-end">New Password:</div>
        <div class="col-4">
            <input v-if="revealPassword" type="text" v-model="useAuth.newPassword" />
            <input v-else type="password" v-model="useAuth.newPassword">
        </div>
        <div class="col-2">
            <button type="button" @click="toggleRevealPassword()" class="btn btn-outline-primary">👁️</button>
        </div>
    </div>

    <div class="row mt-4">
        <div class="col-3"></div>
        <div class="col-3 text-end">
            <button class="btn btn-primary" @click="savePassword()">Save</button>
        </div>
        <div class="col-3">
            <button class="btn btn-primary" @click="cancel()">Cancel</button>
        </div>
        <div class="col-3"></div>
    </div>
</template>
        
<style scoped></style>
        