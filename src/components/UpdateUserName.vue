<script setup lang="ts">
// imports
import { useAuthStore } from "../stores/auth";

// state
const useAuth = useAuthStore();
const emit = defineEmits(['cancel', 'savename']);

// functions
async function saveUserName() {
    emit('savename');
}
function cancel() {
    emit('cancel');
}

</script>
        
<template>
    <div class="row mt-3">
        <div class="col-6"></div>
        <div class="col-3">
            {{ useAuth.member.userName }}
        </div>
        <div class="col-3"></div>
    </div>

    <div class="row mt-3">
        <div class="col-6 text-end">New User Name:</div>
        <div class="col-3">
            <input type="text" v-model="useAuth.member.userName">
        </div>
        <div class="col-3"></div>
    </div>

    <div class="row mt-4">
        <div class="col-3"></div>
        <div class="col-3">
            <button class="btn btn-primary" @click="saveUserName()">Save</button>
        </div>
        <div class="col-3">
            <button class="btn btn-primary" @click="cancel()">Cancel</button>
        </div>
        <div class="col-3"></div>
    </div>
</template>
        
<style scoped></style>
        