<script setup>
// imports
import { useModeratorStore } from "@/stores/moderator";
// state
const useModerator = useModeratorStore();
const emit = defineEmits(['newSelection'])

</script>
    
<template>
    <div class="row mt-3">
        <div class="col-5"></div>
        <div class="col-6">
            <select v-model="useModerator.addToStreamName" @change="emit('newSelection')" name="AddToStreamName"
                id="addToStreamName">
                <option v-for="streamName in useModerator.addToStreamNames" :key="streamName">
                    {{ streamName }}</option>
            </select>
        </div>
        <div class="col-1"></div>
    </div>
</template>
    
<style scoped></style>
    