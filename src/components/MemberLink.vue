<script setup>
// imports
import router from "@/router";
import { useChurchStore } from "@/stores/church";

const props = defineProps({
    member: {},
});
const useChurch = useChurchStore();

async function navigateToProfile() {
    const result = await useChurch.getChurchMember(props.member.member.memberId);
    if (result === true) {
        router.push('/memberprofile')
    }
}

</script>
    
<template>
    <span class="dropdown-item span-link" @click="navigateToProfile()">
        <div class="row mb-2">
            <div class="col-5">
                {{ member.member.userName }}
            </div>
        </div>
    </span>
</template>
    
<style scoped>
.span-link {
    cursor: pointer;
}
</style>
    