<script setup>
// imports
import { onMounted, ref } from "vue";
import { useChurchStore } from "@/stores/church";

// state
const useChurch = useChurchStore();
const props = defineProps({
    link: {},
});
const errorList = ref([]);
const showUpdate = ref(false);
const showDelete = ref(false);
const updateButtonIsActive = ref(true);
const deleteButtonIsActive = ref(true);
const indexInChurchLinks = ref();
const localLinkDescription = ref("");
const localLinkValue = ref("");

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
    localLinkDescription.value = "";
    localLinkValue.value = "";
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
    indexInChurchLinks.value = getIndexOfChurchLinks();
    localLinkDescription.value = useChurch.churchLinks[indexInChurchLinks.value].description;
    localLinkValue.value = useChurch.churchLinks[indexInChurchLinks.value].link;
    toggleShowUpdate();
}

function getIndexOfChurchLinks() {
    const linkIndex = useChurch.churchLinks.findIndex(linkRecord => linkRecord.id === props.link.id)
    return linkIndex;
}

async function updateLink() {
    if (isValidated()) {
        let linkObject = getLinkObject();
        const result = await useChurch.editChurchLink(linkObject);
        if (result === true) {
            cancelUpdate() // re-use the same code here
        } else {
            errorList.value.push("Problem - Link not updated")
        }
    }
}

function getLinkObject() {
    return {
        linkId: useChurch.churchLinks[indexInChurchLinks.value].id,
        updatedDescription: localLinkDescription.value,
        updatedValue: localLinkValue.value
    }
}

function isValidated() {
    if (localLinkDescription.value !== "" && localLinkValue.value !== "") {
        return true;
    } else {
        errorList.value.push("Please enter values for both Description and Link")
        return false;
    }
}

async function deleteLink() {
    const deleteLinkId = useChurch.churchLinks[indexInChurchLinks.value].id;
    await useChurch.deleteChurchLink(deleteLinkId);
}

onMounted(() => {
    // get index of matching record in churchLinks
    indexInChurchLinks.value = getIndexOfChurchLinks();
})

</script>

<template>
    <div class="col-sm-4">
        <div class="card border-secondary mb-3" style="max-width: 20 rem;">
            <div class="card-header text-center text-info">Church Link</div>
            <div class="card-body">
                <h4 class="card-title">{{ link.description }}</h4>
                <p class="card-text"> <a target="_blank" :href="link.link">{{ link.link }}</a> </p>
            </div>
            <div class="card-header"><button :disabled="!updateButtonIsActive" @click="updateChosen()" type="button"
                    class="btn btn-outline-success">Update</button></div>
            <div v-show="showUpdate" class="card-body">
                <div class="form-group">
                    <label class="col-form-label" for="linkDesc">Description</label>
                    <input type="text" class="form-control" v-model="localLinkDescription" id="linkDesc">
                </div>
                <div class="form-group">
                    <label class="col-form-label" for="linkVal">Link:</label>
                    <input type="text" class="form-control" v-model="localLinkValue" id="linkVal">
                </div>
                <button class="btn btn-primary m-1" @click="updateLink()">Save</button>
                <button class="btn btn-primary m-1" @click="cancelUpdate()">Cancel</button>
            </div>

            <div class="card-header"><button :disabled="!deleteButtonIsActive" @click="deleteChosen()" type="button"
                    class="btn btn-outline-danger">Delete</button></div>

            <div v-show="showDelete" class="card-body">
                <p class="card-text">Are you sure you want to delete this church link?</p>
                <button class="btn btn-primary m-1" @click="deleteLink()">Delete</button>
                <button class="btn btn-primary m-1" @click="cancelDelete()">Cancel</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.make-clickable {
    cursor: pointer;
}
</style>
