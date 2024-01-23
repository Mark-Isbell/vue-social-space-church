<script setup>
// imports
import { ref } from "vue";
import { useMemberStore } from "@/stores/member";

// state
const useMember = useMemberStore();
const errorList = ref([]);
const emit = defineEmits(['cancelcreate', 'createdfact']);

async function createFact() {
    if (isValidated()) {
        const factObject = createNewFactObject();

        const result = await useMember.createMemberFact(factObject);
        if (result === true) {
            useMember.newFactDescription = "";
            useMember.newFactValue = "";
            emit('createdfact');
        } else {
            errorList.value.push("problem creating member fact.")
        }
    }
}
function isValidated() {
    if (useMember.newFactDescription !== "" && useMember.newFactValue !== "") {
        return true;
    } else {
        return false;
    }
}

function createNewFactObject() {
    let newFactObject = {
        description: useMember.newFactDescription,
        value: useMember.newFactValue
    }
    return newFactObject
}

function cancel() {
    useMember.newFactDescription = "";
    useMember.newFactValue = "";
    emit('cancelcreate');
}

</script>
    
<template>
    <div class="form-group">
        <label class="col-form-label" for="factDesc">New Fact Description</label>
        <input type="text" class="form-control" v-model="useMember.newFactDescription"
            placeholder="Fact Description (e.g. 'favorite coffee')" id="factDesc">
    </div>

    <div class="form-group">
        <label class="col-form-label" for="factVal">New Fact Value:</label>
        <input type="text" class="form-control" v-model="useMember.newFactValue" placeholder="Black Hills Brewing"
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
    