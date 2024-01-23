<script setup>
// imports
import { useAuthStore } from "../stores/auth";
import { useMemberStore } from "../stores/member";
import { onMounted } from "vue";

// state
const useMember = useMemberStore();
const useAuth = useAuthStore();
const emit = defineEmits(['closeEdit']);

// functions
async function saveIntro() {
    useMember.updateIntroductionValidationMessages = [];
    const response = await useMember.updateIntroduction(useMember.memberIntroduction);
    if (response === true) {
        emit('closeEdit');
    }
    else {
        useMember.updateIntroductionValidationMessages.push("Problem updating introduction.")
    }
}

onMounted(() => {
    useMember.memberIntroduction = useAuth.member.introduction;
})
</script>
    
<template>
    <div class="row mt-3">
        <div class="col-2"></div>
        <div class="col-8">
            <textarea v-model="useMember.memberIntroduction" type="text" name="" id=""> </textarea>
        </div>
        <div class="col-2"></div>
    </div>

    <div class="row mt-1 mb-1">
        <div class="col-4"></div>
        <div class="col-6">
            <div class="text-danger" v-for="validationMessage in useMember.updateIntroductionValidationMessages"
                :key="validationMessage">
                {{ validationMessage }}
            </div>
        </div>
        <div class="col-2"></div>
    </div>

    <div class="row mt-3">
        <div class="col-3"></div>
        <div class="col-6 text-center">
            <button class="btn btn-primary" @click="saveIntro()">Save</button>
        </div>
        <div class="col-3"></div>
    </div>

    <div class="row mt-2">
        <div class="col-2"></div>
        <div class="col-8">
            {{ useMember.memberIntroduction }}
        </div>
        <div class="col-2"></div>
    </div>
</template>
    
<style scoped>
div {
    white-space: pre-wrap;
}
</style>
    