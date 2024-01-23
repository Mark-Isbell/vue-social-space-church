<script setup>
// imports
import { onMounted, ref } from "vue";
import { useMemberStore } from "@/stores/member";

// state
const useMember = useMemberStore();
const props = defineProps({
    fact: {},
});
const errorList = ref([]);
const showUpdate = ref(false);
const showDelete = ref(false);
const updateButtonIsActive = ref(true);
const deleteButtonIsActive = ref(true);
const indexInMemberFacts = ref();
const localFactDescription = ref("");
const localFactValue = ref("");

function toggleShowUpdate() {
    if (showUpdate.value === false) {
        showUpdate.value = true;
    } else { showUpdate.value = false; }
}

function toggleShowDelete() {
    if (showDelete.value === false) {
        showDelete.value = true;
    } else { showDelete.value = false; }
}

function deleteChosen() {
    // inactivate other buttons until they are finished
    updateButtonIsActive.value = false;
    deleteButtonIsActive.value = false;
    toggleShowDelete();
}

function cancelDelete() {
    toggleShowDelete();
    updateButtonIsActive.value = true;
    deleteButtonIsActive.value = true;
}

function cancelUpdate() {
    localFactDescription.value = "";
    localFactValue.value = "";
    toggleShowUpdate();
    updateButtonIsActive.value = true;
    deleteButtonIsActive.value = true;
}

function updateChosen() {
    // inactivate other buttons until they are finished
    updateButtonIsActive.value = false;
    deleteButtonIsActive.value = false;
    // copy over temp values from the current value in store
    // fresh index in case of delete elsewhere
    indexInMemberFacts.value = getIndexOfMemberFacts();
    localFactDescription.value = useMember.memberFacts[indexInMemberFacts.value].description;
    localFactValue.value = useMember.memberFacts[indexInMemberFacts.value].fact;
    toggleShowUpdate();
}

function getIndexOfMemberFacts() {
    const factIndex = useMember.memberFacts.findIndex(factRecord => factRecord.id === props.fact.id)
    return factIndex;
}

async function updateFact() {
    if (isValidated()) {
        let factObject = getFactObject();
        const result = await useMember.editMemberFact(factObject);
        if (result === true) {
            cancelUpdate() // just re-using the same code here otherwise
        } else {
            errorList.value.push("Problem - Fact not updated")
        }
    }
}

function getFactObject() {
    return {
        id: useMember.memberFacts[indexInMemberFacts.value].id,
        updatedDescription: localFactDescription.value,
        updatedValue: localFactValue.value
    }
}

function isValidated() {
    if (localFactDescription.value !== "" && localFactValue.value !== "") {
        return true;
    } else {
        errorList.value.push("Please enter values for both Description and Fact")
        return false;
    }
}

async function deleteFact() {
    const deleteFactId = useMember.memberFacts[indexInMemberFacts.value].id;
    await useMember.deleteMemberFact(deleteFactId);
}

onMounted(() => {
    // get index of matching record in memberFacts
    indexInMemberFacts.value = getIndexOfMemberFacts();
})

</script>
    
<template>
    <div class="col-sm-4">

        <div class="card border-secondary mb-3" style="max-width: 20rem;">
            <div class="card-header text-center text-info">Member Fact</div>
            <div class="card-body">
                <h4 class="card-title">{{ fact.description }}</h4>
                <p class="card-text"> {{ fact.fact }}</p>
            </div>
            <div class="card-header"><button :disabled="!updateButtonIsActive" @click="updateChosen()" type="button"
                    class="btn btn-outline-success">Update</button></div>



            <div v-show="showUpdate" class="card-body">
                <div class="form-group">
                    <label class="col-form-label" for="factDesc">Description</label>
                    <input type="text" class="form-control" v-model="localFactDescription" id="factDesc">
                </div>
                <div class="form-group">
                    <label class="col-form-label" for="factVal">Fact:</label>
                    <input type="text" class="form-control" v-model="localFactValue" id="factVal">
                </div>
                <button class="btn btn-primary m-1" @click="updateFact()">Save</button>
                <button class="btn btn-primary m-1" @click="cancelUpdate()">Cancel</button>
            </div>

            <div class="card-header"><button :disabled="!deleteButtonIsActive" @click="deleteChosen()" type="button"
                    class="btn btn-outline-danger">Delete</button></div>

            <div v-show="showDelete" class="card-body">
                <p class="card-text">Are you sure you want to delete this fact?</p>
                <button class="btn btn-primary m-1" @click="deleteFact()">Delete</button>
                <button class="btn btn-primary m-1" @click="cancelDelete()">Cancel</button>
            </div>
        </div>


    </div>
</template>
    
<style scoped>
.make-clickable {
    cursor: pointer;
}

div {
    white-space: pre-wrap;
}
</style>
    