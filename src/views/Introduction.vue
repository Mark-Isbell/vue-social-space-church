<script setup lang="ts">
// imports
import { useAuthStore } from "../stores/auth";
import { ref } from "vue";
import { useMemberStore } from "../stores/member";
import UpdateIntroduction from "../components/UpdateIntroduction.vue";
import { useErrorStore } from "@/stores/error";
const error = useErrorStore();
// example: error.logError("my error string goes here and it will navigate automatically for me")

// state
const useMember = useMemberStore();
const useAuth = useAuthStore();
const toggleUpdate = ref(false);

function showupdate() {
    if (toggleUpdate.value === false) {
        useMember.memberIntroduction = useAuth.member.introduction;
        useMember.updateIntroductionValidationMessages = [];
        toggleUpdate.value = true;
    }
    else { toggleUpdate.value = false; }
}
</script>
    
<template>
    <div>
        <div class="row mt-3">
            <div class="col-3"></div>
            <div class="col-6 text-center h4">
                Introduction
            </div>
            <div class="col-3"></div>
        </div>

        <div class="row mt-4">
            <div class="col-3"></div>
            <div class="col-6 text-center">
                <p>Your current introduction:</p>
            </div>
            <div class="col-3"></div>
        </div>

        <div class="row mt-4">
            <div class="col-3"></div>
            <div class="col-6 text-center">

                <p>{{ useAuth.member.introduction }}</p>
            </div>
            <div class="col-3"></div>
        </div>

        <div class="row mt-1">
            <div class="col-3"></div>
            <div class="col-6 h4 text-center">
                <span class="make-clickable" @click="showupdate()">
                    📝
                </span>

            </div>
            <div class="col-3"></div>
        </div>

        <div v-show="toggleUpdate">
            <div class="row">
                <div class="col-3"></div>
                <div class="col-6 h4 text-center">
                    <UpdateIntroduction @closeEdit="showupdate()"></UpdateIntroduction>
                </div>
                <div class="col-3"></div>
            </div>
        </div>
    </div>
</template>
    
<style scoped>
div {
    white-space: pre-wrap;
}

.make-clickable {
    cursor: pointer;
}
</style>
    