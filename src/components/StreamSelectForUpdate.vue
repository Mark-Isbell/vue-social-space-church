<script setup>
// imports
import { useModeratorStore } from "@/stores/moderator";

// state
const useModerator = useModeratorStore();
const emit = defineEmits(['newSelection'])

</script>
    
<template>
    <div class="row">
        <div class="col-12 text-center">
            Updating Stream: {{ useModerator.updateStreamName }}
        </div>
    </div>

    <div class="row mt-3">
        <div class="col-5"></div>
        <div class="col-6">
            <select v-model="useModerator.updateStreamName" @change="emit('newSelection')" name="updateStreamName"
                id="updateStreamName">
                <option v-for="streamName in useModerator.updatableStreamNames" :key="streamName">
                    {{ streamName }}</option>
            </select>
        </div>
        <div class="col-1"></div>
    </div>
</template>
    
<style scoped></style>
    