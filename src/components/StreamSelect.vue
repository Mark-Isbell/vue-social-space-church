<script setup>
// imports
import { useStreamStore } from "@/stores/stream";

// state
const useStream = useStreamStore();
const emit = defineEmits(['newSelection'])

</script>
    
<template>
    <div class="row mt-4 mb-2">
        <div class="col-5 text-primary text-end">Stream: </div>
        <div class="col-5">
            <select class="form-select" v-model="useStream.currentStreamName" @change="emit('newSelection')"
                name="currentStreamName" id="currentStreamName">
                <option v-for="stream in useStream.streamHeaders" :key="stream">
                    {{ stream.streamName }}</option>
            </select>
        </div>
        <div class="col-2"></div>
    </div>
</template>
    
<style scoped></style>
    