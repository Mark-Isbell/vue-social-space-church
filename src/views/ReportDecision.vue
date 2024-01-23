<script setup>
// imports
import { useModeratorStore } from "../stores/moderator";
import { ref, onMounted } from "vue";
import { useErrorStore } from "@/stores/error";
import DOMPurify from "dompurify";
import { marked } from "marked";
import router from "@/router";
const error = useErrorStore();
// example: error.logError("my error string goes here and it will navigate automatically for me")

// state
const showReport = ref(false);
const useModerator = useModeratorStore();
const purifiedReport = ref("");
const displayErrorMessage = ref(false);
const showFollowUpSection = ref(false);
// following variables used for short done -> ignore option
const showShortNextButton = ref(false);
const isShortDoneButtonActive = ref(true);
const displayIgnoredMessage = ref(false);
const displaySuccessMessage = ref(false);
// following variables used for display of restriction progress
const displaybackToReportsAfterRestriction = ref(false);
const showRestrictionDoneButton = ref(true);
const displayRestrictionSuccess = ref(false);

// processing steps
const processingStepsCompleted = ref("");
const showStepResult = ref(false);

function getReportForDisplay() {
    let target = "&lt;";
    let replacement = "<";
    let fixedReport = "";

    if (useModerator.reportForReview.message) {
        fixedReport = useModerator.reportForReview.message.replaceAll(target, replacement);
    }
    purifiedReport.value = marked(DOMPurify.sanitize(fixedReport));
}

function newActionSelected() {
    if (useModerator.reportActionChoice === "Ignore report") {
        showFollowUpSection.value = false;
        showShortNextButton.value = true;
    }
    else if (useModerator.reportActionChoice === "Delete post and ...") {
        showShortNextButton.value = false;
        showFollowUpSection.value = true;
    }
}

function newRestrictionChosen() {

    if (useModerator.restrictionChoice !== "") {
        showRestrictionDoneButton.value = true;
    } else if (useModerator.restrictionChoice === "") {
        showRestrictionDoneButton.value = false;
    }
}

async function shortDoneClicked() {

    const result = await useModerator.complete(
        {
            messageId: useModerator.reportForReview.id,
            moderatorResponse: useModerator.reportActionReason,
            moderatorAction: useModerator.reportActionChoice,
            moderatorRestriction: useModerator.restrictionChoice
        });

    if (result === true) {
        isShortDoneButtonActive.value = false;
        displayIgnoredMessage.value = true;
    } else if (result === false) {
        isShortDoneButtonActive.value = false;
        displayErrorMessage.value = true;
    }
}

async function restrictDoneClicked() {

    isShortDoneButtonActive.value = false;
    showRestrictionDoneButton.value = false;
    displayErrorMessage.value = false;
    displaybackToReportsAfterRestriction.value = false;
    // tree logic
    if (useModerator.restrictionChoice === "No Restriction on Member") {
        noRestrictionChosen();
    } else if (useModerator.restrictionChoice === "Restrict Member From Posting In Stream") {
        restrictOneChosen();
    }
    else if (useModerator.restrictionChoice === "Restrict Member From Posting In All Their Streams") {
        restrictAllChosen();
    } else if (useModerator.restrictionChoice === "Remove Memeber From Church") {
        removeFromChurchChosen();
    }
}


async function noRestrictionChosen() {
    //  "No Restriction on Member"

    // delete comment
    const result = await useModerator.deleteMemberComment(useModerator.reportForReview.keyfieldstreamcommentId)
    if (result === true) {


        // update steps.  
        processingStepsCompleted.value = processingStepsCompleted.value + "  Comment deleted."

    } else if (result === false) {
        displayErrorMessage.value = true;

        // update steps. 
        processingStepsCompleted.value = processingStepsCompleted.value + "  Comment not deleted. (is this a duplicate report?)"
    }

    // complete report
    let statusAdded = useModerator.reportActionReason + "  AUTOMATED PROCESS LOG: " + processingStepsCompleted.value
    const updateReportResult = await useModerator.complete(
        {
            messageId: useModerator.reportForReview.id,
            moderatorResponse: statusAdded,
            moderatorAction: useModerator.reportActionChoice,
            moderatorRestriction: useModerator.restrictionChoice
        });
    if (updateReportResult === true) {


        // update steps.  
        processingStepsCompleted.value = processingStepsCompleted.value + "  Moderator report updated."

        displayRestrictionSuccess.value = true;
        displaybackToReportsAfterRestriction.value = true;
    }
    else {
        displayErrorMessage.value = true;

        // update steps.  
        processingStepsCompleted.value = processingStepsCompleted.value + "  Moderator report not updated."
    }

    // update step status:
    showStepResult.value = true;

}

async function removeFromChurchChosen() {

    // 1) delete comment 2) remove member from church 3) complete report

    // 1 - delete the comment
    const result = await useModerator.deleteMemberComment(useModerator.reportForReview.keyfieldstreamcommentId)
    if (result === true) {
        processingStepsCompleted.value = processingStepsCompleted.value + "  Comment deleted."
    }
    else if (result === false) {

        displayErrorMessage.value = true;
        processingStepsCompleted.value = processingStepsCompleted.value + "  Comment not deleted. (is this a duplicate report?)"
    }

    // 2 - remove member from church 
    // NOTE: The back-end API will also do a restrict-all on all streams immediately
    // to address the possbility that the member has an active login 
    const restrictResult = await useModerator.removeFromChurch(
        {
            memberId: useModerator.reportForReview.keyfieldmemberId,
            moderatorMessageId: useModerator.reportForReview.id
        }
    )
    if (restrictResult === true) {
        processingStepsCompleted.value = processingStepsCompleted.value + "  Restriction applied."
    }
    else if (result === false) {
        // problem removing member from church
        displayErrorMessage.value = true;
        processingStepsCompleted.value = processingStepsCompleted.value + " Restriction not applied."
    }

    // 3 - complete the moderator report
    let statusAdded = useModerator.reportActionReason + "  AUTOMATED PROCESS LOG: " + processingStepsCompleted.value
    const updateReportResult = await useModerator.complete(
        {
            messageId: useModerator.reportForReview.id,
            moderatorResponse: statusAdded,
            moderatorAction: useModerator.reportActionChoice,
            moderatorRestriction: useModerator.restrictionChoice
        });
    if (updateReportResult === true) {

        displayRestrictionSuccess.value = true;
        displaybackToReportsAfterRestriction.value = true;
        processingStepsCompleted.value = processingStepsCompleted.value + "  Moderator report updated."
    }
    else {
        // problem completing moderator report
        displayErrorMessage.value = true;
        processingStepsCompleted.value = processingStepsCompleted.value + "  Moderator report not updated."
    }
    showStepResult.value = true;
}

async function restrictAllChosen() {

    // 1) delete comment 2) restrict member 3) complete report

    // 1 - delete the comment
    const result = await useModerator.deleteMemberComment(useModerator.reportForReview.keyfieldstreamcommentId)
    if (result === true) {
        processingStepsCompleted.value = processingStepsCompleted.value + "  Comment deleted."
    }
    else if (result === false) {

        displayErrorMessage.value = true;
        processingStepsCompleted.value = processingStepsCompleted.value + "  Comment not deleted. (is this a duplicate report?)"
    }

    // step 2 - place restrict all on member
    const restrictResult = await useModerator.restrictAll(
        {
            memberId: useModerator.reportForReview.keyfieldmemberId
        }
    )
    if (restrictResult === true) {
        processingStepsCompleted.value = processingStepsCompleted.value + "  Restriction applied."
    }
    else if (result === false) {

        displayErrorMessage.value = true;
        processingStepsCompleted.value = processingStepsCompleted.value + "  Restriction not applied."
    }

    // step 3 Update report
    let statusAdded = useModerator.reportActionReason + "  AUTOMATED PROCESS LOG: " + processingStepsCompleted.value
    const updateReportResult = await useModerator.complete(
        {
            messageId: useModerator.reportForReview.id,
            moderatorResponse: statusAdded,
            moderatorAction: useModerator.reportActionChoice,
            moderatorRestriction: useModerator.restrictionChoice
        });
    if (updateReportResult === true) {

        displayRestrictionSuccess.value = true;
        displaybackToReportsAfterRestriction.value = true;
        processingStepsCompleted.value = processingStepsCompleted.value + "  Moderator report updated."
    }
    else {

        displayErrorMessage.value = true;
        processingStepsCompleted.value = processingStepsCompleted.value + "  Moderator report not updated."
    }
    showStepResult.value = true;
}

async function restrictOneChosen() {
    // purpose: restrict member from posting in stream

    // 1) delete comment 2) restrict member 3) complete report

    // 1 - delete the comment
    const result = await useModerator.deleteMemberComment(useModerator.reportForReview.keyfieldstreamcommentId)
    if (result === true) {
        processingStepsCompleted.value = processingStepsCompleted.value + "  Comment deleted."
    }
    else if (result === false) {

        displayErrorMessage.value = true;
        processingStepsCompleted.value = processingStepsCompleted.value + "  Comment not deleted. (is this a duplicate report?)"
    }

    // 2 - place the restriction on the member 
    const restrictResult = await useModerator.restrictOne(
        {
            streamId: useModerator.reportForReview.keyfieldstreamId,
            memberId: useModerator.reportForReview.keyfieldmemberId
        }
    )
    if (restrictResult === true) {
        processingStepsCompleted.value = processingStepsCompleted.value + "  Restriction applied."
    }
    else if (result === false) {
        // problem placing restriction on member
        displayErrorMessage.value = true;
        processingStepsCompleted.value = processingStepsCompleted.value + "  Restriction not applied."
    }

    // 3 - complete the moderator report
    let statusAdded = useModerator.reportActionReason + "  AUTOMATED PROCESS LOG: " + processingStepsCompleted.value
    const updateReportResult = await useModerator.complete(
        {
            messageId: useModerator.reportForReview.id,
            moderatorResponse: statusAdded,
            moderatorAction: useModerator.reportActionChoice,
            moderatorRestriction: useModerator.restrictionChoice
        });
    if (updateReportResult === true) {
        // report successfully updated
        displayRestrictionSuccess.value = true;
        displaybackToReportsAfterRestriction.value = true;
        processingStepsCompleted.value = processingStepsCompleted.value + "  Moderator report updated."
    }
    else {
        // problem completing moderator report
        displayErrorMessage.value = true;
        processingStepsCompleted.value = processingStepsCompleted.value + "  Moderator report not updated."
    }
    showStepResult.value = true;
}


function backToReports() {
    router.push('reports');
}

function resetResolutionDecisions() {
    useModerator.reportActionChoice = "";
    useModerator.restrictionChoice = "";
    useModerator.reportActionReason = "";
}


onMounted(() => {
    // reset decision variables in store
    resetResolutionDecisions();
    if (!useModerator.reportForReview.message) {
        // no report detected
        showReport.value = false;
        router.push({ path: '/reports' })

    } else {
        // report detected
        getReportForDisplay();
        showReport.value = true;
    }
})

</script>
    
<template>
    <div class="row mt-3">
        <div class="col-3"></div>
        <div class="col-6 text-center h4">
            Review Report
        </div>
        <div class="col-3"></div>
    </div>

    <div class="card mt-1">
        <div class="card-header">
            <div class="h5 text-center">Report</div>
            <div v-if="showReport">
                <span class="card-text" v-html="purifiedReport"></span>
            </div>

        </div>


        <div class="card-header">
            <p>Stream: {{ useModerator.reportStream.name }}</p>
            <p>Stream Type: {{ useModerator.reportStream.type }}</p>
            <p>Stream Status: {{ useModerator.reportStream.status }}</p>
        </div>



        <div class="card-header">Report Status: {{ useModerator.reportForReview.status }}
        </div>


        <div class="card-header">Moderator Response: {{ useModerator.reportForReview.moderatorResponse }}
        </div>

        <div class="card-header">Moderator Action: {{ useModerator.reportForReview.moderatorAction }}
        </div>


        <div class="card-header">Moderator Restriction: {{ useModerator.reportForReview.moderatorRestriction }}
        </div>

        <div v-if="showStepResult" class="text-danger card-header">Processing Steps:
            <p>
                {{ processingStepsCompleted }}
            </p>
        </div>


        <div class="card-body smaller-font">

            <div class="row">
                <div class="col-5 text-primary text-end">Moderator Action: </div>
                <div class="col-5">
                    <select :disabled="!isShortDoneButtonActive" class="form-select"
                        v-model="useModerator.reportActionChoice" @change="newActionSelected()" name="reportActionChoice"
                        id="reportActionChoice">
                        <option v-for="action in useModerator.reportActionOptions" :key="action">
                            {{ action }}</option>
                    </select>
                </div>
                <div class="col-2"></div>
            </div>



            <div v-if="showShortNextButton">
                <div class="row text-primary text-center">
                    <div class="form-group">
                        <label class="col-form-label" for="reason">Reason:</label>
                        <textarea :disabled="!isShortDoneButtonActive" class="form-control" id="reason"
                            v-model="useModerator.reportActionReason"></textarea>
                    </div>
                </div>
            </div>

            <p v-if="showShortNextButton" class="text-center mt-3">
                <button :disabled="!isShortDoneButtonActive" class="btn btn-primary"
                    @click="shortDoneClicked()">Done</button>
            </p>

            <div v-if="displayIgnoredMessage">
                <p class="text-center text-success mt-2">
                    Report resolved and updated.
                </p>
                <p class="text-center">
                    <button class="btn btn-primary" @click="backToReports()">Back to Reports</button>
                </p>
            </div>



        </div>
    </div>


    <div v-if="showFollowUpSection" class="card mt-4">
        <div class="card-header">Choose Follow-up restriction for member that authored reported content:
        </div>
        <div class="card-body smaller-font">

            <div class="row">
                <div class="col-5 text-primary text-end">Additional Restriction: </div>
                <div class="col-5">
                    <select :disabled="!showRestrictionDoneButton" class="form-select"
                        v-model="useModerator.restrictionChoice" @change="newRestrictionChosen()" name="reportActionChoice"
                        id="reportActionChoice">
                        <option v-for="restriction in useModerator.restrictionOptions" :key="restriction">
                            {{ restriction }}</option>
                    </select>
                </div>
                <div class="col-2"></div>
            </div>






            <div class="row text-primary text-center">
                <div class="form-group">
                    <label class="col-form-label" for="reason">Reason:</label>
                    <textarea :disabled="!showRestrictionDoneButton" class="form-control" id="reason"
                        v-model="useModerator.reportActionReason"></textarea>
                </div>
            </div>

            <p class="text-center mt-3">
                {{ useModerator.restrictionChoice }}
            </p>

            <p class="text-center mt-3">
                {{ useModerator.reportActionReason }}
            </p>

            <p v-if="showRestrictionDoneButton" class="text-center mt-3">
                <button class="btn btn-primary" @click="restrictDoneClicked()">Done</button>
            </p>
            <p v-if="displayRestrictionSuccess" class="text-success text-center">
                Report resolved and restriction decision applied.
            </p>

            <div v-if="displayRestrictionSuccess">
                <p class="text-center">
                    <button class="btn btn-primary" @click="backToReports()">Back to Reports</button>
                </p>
            </div>
        </div>
    </div>
</template>
    
<style scoped>
.make-clickable {
    cursor: pointer;
}

div {
    white-space: pre-wrap;
}
</style>
    