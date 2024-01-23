<script setup>
// imports
import { useChurchStore } from "../stores/church";
import { onMounted } from "vue";

// state
const useChurch = useChurchStore();
const emit = defineEmits(['closeEdit']);

async function saveModerationPolicy() {
    useChurch.updateModerationValidationMessages = [];
    const response = await useChurch.updateChurchModerationPolicy({ moderationPolicy: useChurch.updateModerationPolicy });
    if (response === true) {
        emit('closeEdit');
    }
    else {
        useChurch.updateModerationValidationMessages.push("Problem updating moderation policy.")
    }
}

onMounted(() => {
    useChurch.updateModerationPolicy = useChurch.church.moderationPolicy;
})
</script>
    
<template>
    <div class="row mt-2">
        <div class="col-2"></div>
        <div class="col-8">
            <textarea v-model="useChurch.updateModerationPolicy" type="text" name="" id=""> </textarea>
        </div>
        <div class="col-2"></div>
    </div>

    <div class="row mt-3 mb-1">
        <div class="col-4"></div>
        <div class="col-6">
            <div class="text-danger" v-for="validationMessage in useChurch.updateModerationValidationMessages"
                :key="validationMessage">
                {{ validationMessage }}
            </div>
        </div>
        <div class="col-2"></div>
    </div>

    <div class="row mt-4">
        <div class="col-3"></div>
        <div class="col-6 text-center">
            <button class="btn btn-primary" @click="saveModerationPolicy()">Save</button>
        </div>
        <div class="col-3"></div>
    </div>

    <div class="row mt-2">
        <div class="col-2"></div>
        <div class="col-8">
            {{ useChurch.updateModerationPolicy }}
        </div>
        <div class="col-2"></div>
    </div>
</template>
    
<style scoped></style>
    