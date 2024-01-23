<script setup>
// imports
import { ref } from "vue";
import { useChurchStore } from "@/stores/church";

// state
const useChurch = useChurchStore();
const errorList = ref([]);
const emit = defineEmits(['cancelcreate', 'createdfact']);

async function createFact() {

    if (isValidated()) {
        const factObject = createNewFactObject();

        const result = await useChurch.createChurchFact(factObject);
        if (result === true) {
            useChurch.newFactDescription = "";
            useChurch.newFactValue = "";
            emit('createdfact');
        } else {
            errorList.value.push("problem creating church fact.")
        }
    }
}
function isValidated() {
    if (useChurch.newFactDescription !== "" && useChurch.newFactValue !== "") {
        return true;
    } else {
        return false;
    }
}

function createNewFactObject() {
    let newFactObject = {
        churchId: useChurch.church.id,
        description: useChurch.newFactDescription,
        value: useChurch.newFactValue
    }
    return newFactObject
}

function cancel() {
    useChurch.newFactDescription = "";
    useChurch.newFactValue = "";
    emit('cancelcreate');
}

</script>
    
<template>
    <div class="form-group">
        <label class="col-form-label" for="factDesc">New Fact Description</label>
        <input type="text" class="form-control" v-model="useChurch.newFactDescription"
            placeholder="Fact Description (e.g. 'Church history note')" id="factDesc">
    </div>

    <div class="form-group">
        <label class="col-form-label" for="linkVal">New Fact Value:</label>
        <input type="text" class="form-control" v-model="useChurch.newFactValue" placeholder="Our church was founded in ..."
            id="factVal">
    </div>

    <div class="row mt-4">
        <div class="col-3"></div>
        <div class="col-3 text-end">
            <button class="btn btn-primary" @click="createFact()">Create Fact</button>
        </div>
        <div class="col-3">
            <button class="btn btn-primary" @click="cancel()">Cancel</button>
        </div>
        <div class="col-3"></div>
    </div>
</template>
    
<style scoped>
div {
    white-space: pre-wrap;
}
</style>
    