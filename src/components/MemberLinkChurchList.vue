<script setup>
// imports
import router from "@/router";
import { computed } from "vue";
import { useChurchStore } from "@/stores/church";

const props = defineProps({
    member: {},
});
const useChurch = useChurchStore();

const computedCreatedAt = computed(() => {
    const createdDate = new Date(props.member.createdAt);
    const createdAt_date = createdDate.getDate();
    const createdAt_month = createdDate.getMonth() + 1; //Months are zero based
    const createdAt_year = createdDate.getFullYear();
    const combinedDate = "" + createdAt_month + "/" + createdAt_date + "/" + createdAt_year;

    return combinedDate;
})

async function navigateToProfile() {
    const result = await useChurch.getChurchMember(props.member.memberId);
    if (result === true) {
        router.push('/memberprofile')
    }
}

</script>
    
<template>
    <span class="dropdown-item span-link" @click="navigateToProfile()">
        <div class="row mb-2">
            <div class="col-5">
                {{ member.userName }}
            </div>

            <div class="col-3">
                {{ member.role }}
            </div>

            <div class="col-4">
                Joined: {{ computedCreatedAt }}
            </div>
        </div>
    </span>
</template>
    
<style scoped>
.span-link {
    cursor: pointer;
}
</style>
    