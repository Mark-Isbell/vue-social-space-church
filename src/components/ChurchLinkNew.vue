<script setup>
// imports
import { ref } from "vue";
import { useChurchStore } from "@/stores/church";

// state
const useChurch = useChurchStore();
const errorList = ref([]);
const emit = defineEmits(['cancelcreate', 'createdlink']);

async function createLink() {
    if (isValidated()) {
        const linkObject = createNewLinkObject();
        const result = await useChurch.createChurchLink(linkObject);
        if (result === true) {
            useChurch.newLinkDescription = "";
            useChurch.newLinkValue = "";
            emit('createdlink');
        } else {
            errorList.value.push("problem creating church link.")
        }
    }
}
function isValidated() {
    if (useChurch.newLinkDescription !== "" && useChurch.newLinkValue !== "") {
        return true;
    } else {
        return false;
    }
}

function createNewLinkObject() {
    let newLinkObject = {
        description: useChurch.newLinkDescription,
        value: useChurch.newLinkValue
    }
    return newLinkObject
}

function cancel() {
    useChurch.newLinkDescription = "";
    useChurch.newLinkValue = "";
    emit('cancelcreate');
}

</script>
    
<template>
    <div class="form-group">
        <label class="col-form-label" for="linkDesc">New Link Description</label>
        <input type="text" class="form-control" v-model="useChurch.newLinkDescription"
            placeholder="Link Description (e.g. 'Livestream')" id="linkDesc">
    </div>

    <div class="form-group">
        <label class="col-form-label" for="linkVal">New Link Value:</label>
        <input type="text" class="form-control" v-model="useChurch.newLinkValue" placeholder="https://www.example.com"
            id="linkVal">
    </div>

    <div class="row mt-4">
        <div class="col-3"></div>
        <div class="col-3 text-end">
            <button class="btn btn-primary" @click="createLink()">Create Link</button>
        </div>
        <div class="col-3">
            <button class="btn btn-primary" @click="cancel()">Cancel</button>
        </div>
        <div class="col-3"></div>
    </div>
</template>
    
<style scoped></style>
    