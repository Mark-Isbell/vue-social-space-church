<script setup>
// imports
import { useDirectMessageStore } from "@/stores/directmessage";
// state
const useDirectMessage = useDirectMessageStore();
const emit = defineEmits(['newDMSelection'])

</script>
    
<template>
    <select class="form-select" v-model="useDirectMessage.selectedDirectMessageName" @change="emit('newDMSelection')"
        name="updateDMName" id="updateDMName">
        <option v-for="directMessage in useDirectMessage.directMessageHeaders" :key="directMessage">
            {{ directMessage.participantString }}</option>
    </select>
</template>
    
<style scoped></style>
    