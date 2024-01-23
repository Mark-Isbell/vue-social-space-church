<script setup>
// imports
import { ref, watch } from "vue";
import MemberLink from "../components/MemberLink.vue";
import { useStreamStore } from "@/stores/stream";
const useStream = useStreamStore();

// state
const showStreamMembers = ref(false);

// watchers
watch(() => useStream.currentStreamName, (n) => {
    // safety check then streammember refresh
    if (n !== "") { getStreamMemberList(n); }
})

async function getStreamMemberList(newStreamName) {
    await useStream.getStreamMembers(newStreamName)
    if (useStream.currentStreamMembers.length > 0) {
        showStreamMembers.value = true;
    }
}

</script>
    
<template>
    <div class="sidebar sidebar-lg sidebar-fixed sidebar-self-hiding-md d-none d-xl-inline">
        <div class="mt-5">
            <div v-for="member in useStream.currentStreamMembers" :key="member">
                <MemberLink :member="member"></MemberLink>
            </div>
        </div>
    </div>
</template>
    
<style scoped></style>
    