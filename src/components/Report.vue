<script setup>
// imports
import { computed, ref } from "vue";
import DOMPurify from "dompurify";
import { marked } from "marked";
import router from "@/router";
import { useModeratorStore } from "@/stores/moderator";

// state
const useModerator = useModeratorStore();
const errorMessages = ref([]);
const props = defineProps({
    report: {},
});


const purifiedReport = computed(() => {
    let target = "&lt;";
    let replacement = "<";
    const fixedReport = props.report.message.replaceAll(target, replacement);
    const purifiedReport = marked(DOMPurify.sanitize(fixedReport));
    return purifiedReport;
})

async function OpenReport() {
    // first erase any prior error messages
    errorMessages.value = [];
    useModerator.reportForReview = props.report;
    // now get the stream information related to the report
    const streamResult = await useModerator.getStreamInformation(props.report.keyfieldstreamId);
    if (streamResult === true) {
        router.push('reportdecision')
    }
    else {
        // display error message
        errorMessages.value.push("Could not retreive stream information.")
    }
}

</script>
    
<template>
    <div class="card mb-3">
        <div class="card-body smaller-font">
            <div>
                <span class="card-text" v-html="purifiedReport"></span>
            </div>
        </div>
        <div class="card-body smaller-font">
            <div class="text-danger" v-for="errorMessage in errorMessages" :key="errorMessage">
                {{ errorMessage }}
            </div>
        </div>
        <div class="card-body">
            <button class="btn btn-primary" @click="OpenReport()">Open</button>
        </div>
    </div>
</template>
    
<style scoped>
div {
    white-space: pre-wrap;
}
</style>
    