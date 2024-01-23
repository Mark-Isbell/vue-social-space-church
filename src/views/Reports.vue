<script setup lang="ts">
// imports
import { onMounted } from "vue";
import { useModeratorStore } from "@/stores/moderator";
import Report from "../components/Report.vue";

// state
const useModerator = useModeratorStore();

onMounted(() => {
    //  first get all / any church links
    //  useChurch.getChurchLinks();
    useModerator.getReports();

})

</script>
    
<template>
    <div class="row mt-3">
        <div class="col-3"></div>
        <div class="col-6 h4 text-center">
            Reports about Comments
        </div>
        <div class="col-3"></div>
    </div>


    <div class="mt-3 row justify-content-center">

        <Report v-for="report in useModerator.reports" :key="report" :report="report"></Report>

    </div>
</template>
    
<style scoped></style>
    