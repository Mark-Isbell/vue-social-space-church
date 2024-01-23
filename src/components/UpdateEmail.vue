<script setup lang="ts">
// imports
import { useAuthStore } from "../stores/auth";

// state
const useAuth = useAuthStore();
const emit = defineEmits(['cancel', 'saveemail']);

// functions
async function saveEmail() {
    emit('saveemail');
}
function cancel() {
    emit('cancel');
}

</script>
        
<template>
    <div class="row mt-3">
        <div class="col-6"></div>
        <div class="col-3">
            {{ useAuth.member.email }}
        </div>
        <div class="col-3"></div>
    </div>

    <div class="row mt-3">
        <div class="col-6 text-end">New Email:</div>
        <div class="col-3">
            <input type="text" v-model="useAuth.member.email">
        </div>
        <div class="col-3"></div>
    </div>

    <div class="row mt-4">
        <div class="col-3"></div>
        <div class="col-3">
            <button class="btn btn-primary" @click="saveEmail()">Save</button>
        </div>
        <div class="col-3">
            <button class="btn btn-primary" @click="cancel()">Cancel</button>
        </div>
        <div class="col-3"></div>
    </div>
</template>
        
<style scoped></style>
        