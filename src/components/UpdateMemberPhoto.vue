<script setup>
// imports
import { useImageStore } from "../stores/image";
import { useMemberStore } from "../stores/member";
import { ref } from "vue";
import CustomInput from "../components/CustomInput.vue";

const useImage = useImageStore();
const useMember = useMemberStore();
const myFile = ref();

async function upload() {
    const myresponse = await useMember.uploadPhoto(useImage.previewImageBase64);
    // assigning response as placeholder for possible future messaging
}

</script>
      
<template>
    <div class="row mt-4">
        <div class="col-4"></div>
        <div class="col-4 text-center">
        </div>
        <div class="col-4"></div>
    </div>

    <div class="row mt-2">
        <div class="col-8">
            <CustomInput v-model="myFile" :isImage=true placeholder-button-text="Select Pic"> </CustomInput>
        </div>
        <div class="col-4">
        </div>
    </div>

    <div class="row mt-4" v-show="useImage.previewImageBase64">
        <div class="col-2"></div>
        <div class="col-4 text-center">
            <img class="preview my-3" :src="useImage.previewImageBase64" alt="" />
        </div>
        <div class="col-6"></div>
    </div>

    <div class="row mt-4">
        <div class="col-8">
            <button @click="upload()" class="btn btn-primary">Use This Pic</button>
        </div>
        <div class="col-4">
        </div>
    </div>

    <div class="row mt-3">
        <div class="col-4"></div>
        <div class="col-4 text-center">
        </div>
        <div class="col-4"></div>
    </div>
</template>
      
<style scoped>
.imagePreviewWrapper {
    background-repeat: no-repeat;
    width: 250px;
    height: 250px;
    display: block;
    margin: 0 auto 30px;
    background-size: contain;
    background-position: center center;
}

.preview {
    max-width: 200px;
}
</style>
      