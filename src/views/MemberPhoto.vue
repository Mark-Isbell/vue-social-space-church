<script setup lang="ts">
// imports
import { ref } from "vue";
import { useAuthStore } from "@/stores/auth";
import UpdateMemberPhoto from "../components/UpdateMemberPhoto.vue";

// state
const auth = useAuthStore();
const showUpdatePhoto = ref(false);

function activateUpdatePhoto() {
    if (showUpdatePhoto.value === false) { showUpdatePhoto.value = true; }
    else showUpdatePhoto.value = false;
}

</script>

<template>
    <div class="row mt-5">
        <div class="col-3"></div>
        <div class="col-6 h4 text-center">
            Member Photo
        </div>
        <div class="col-3"></div>
    </div>

    <div class="row mt-5" v-show="auth.member.profilePic">
        <div class="col-3"></div>
        <div class="col-6 text-center">
            <img class="preview my-3" :src="auth.member.profilePic" alt="" />
        </div>
        <div class="col-3"></div>
    </div>

    <div class="row mt-5">
        <div class="col-3"></div>
        <div class="col-6 text-center">
            <span class="make-clickable" @click="activateUpdatePhoto()">
                Update / Change Photo 📝
            </span>
        </div>
        <div class="col-3"></div>
    </div>

    <div class="row mt-5" v-show="showUpdatePhoto">
        <div class="col-4"></div>
        <div class="col-6 text-center">
            <UpdateMemberPhoto></UpdateMemberPhoto>
        </div>
        <div class="col-2"></div>
    </div>
</template>
    
<style scoped>
.preview {
    max-width: 200px;
}

.make-clickable {
    cursor: pointer;
}
</style>
    