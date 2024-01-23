<script setup lang="ts">
// imports
import { onMounted, ref } from "vue";
import { useChurchStore } from "@/stores/church";
import ChurchLink from "../components/ChurchLink.vue";
import ChurchLinkNew from "../components/ChurchLinkNew.vue";

// state
const useChurch = useChurchStore();
const showCreate = ref(false);

function toggleCreateNewLink() {
    if (showCreate.value === false) {
        showCreate.value = true;
    } else { showCreate.value = false }
}

onMounted(() => {
    // first get all / any church links
    useChurch.getChurchLinks();
})

</script>
    
<template>
    <div class="row mt-3">
        <div class="col-3"></div>
        <div class="col-6 h4 text-center">
            Update Church Livestream and Media Links
        </div>
        <div class="col-3"></div>
    </div>


    <div v-show="!showCreate" class="row mt-3">
        <div class="col-3"></div>
        <div class="col-6 text-center">
            <button class="btn btn-primary" @click="toggleCreateNewLink()">Add Link</button>
        </div>
        <div class="col-3"></div>
    </div>

    <div v-show="showCreate" class="row mt-3">
        <div class="col-3"></div>
        <div class="col-6 text-center">
            Note: All links must contain 'https://' or 'http://'
        </div>
        <div class="col-3"></div>
    </div>



    <div v-show="showCreate">
        <ChurchLinkNew @cancelcreate="toggleCreateNewLink()"></ChurchLinkNew>
    </div>


    <div class="mt-3 row justify-content-center">

        <ChurchLink v-for="link in useChurch.churchLinks" :key="link" :link="link"></ChurchLink>

    </div>
</template>
    
<style scoped></style>
    