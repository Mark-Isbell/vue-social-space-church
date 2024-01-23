<script setup>
// imports
import { ref, computed, onMounted } from "vue";
import DOMPurify from "dompurify";
import { marked } from "marked";
import CommentEditor from "../components/CommentEditor.vue";
import { useStreamStore } from "@/stores/stream";
import { useAuthStore } from "@/stores/auth";

// state
const props = defineProps({
    comment: {},
});
const useStream = useStreamStore();
const useAuth = useAuthStore();
const purifiedComment = computed(() => {
    let target = "&lt;";
    let replacement = "<";
    const fixedComment = props.comment.comment.replaceAll(target, replacement);
    const purifiedComment = marked(DOMPurify.sanitize(fixedComment));
    return purifiedComment;
})
const modalId = ref();

const dataBsTarget = computed(() => {
    return "#" + modalId.value;
})


const computedLikesNumber = computed(() => {
    if (props.comment.likesNumber === 0) {
        return "";
    } else {
        return props.comment.likesNumber.toString();
    }
})

const computedPraisesNumber = computed(() => {
    if (props.comment.praisesNumber === 0) {
        return "";
    } else {
        return props.comment.praisesNumber.toString();
    }
})

const showEditSection = ref(false);
const showDeleteConfirmation = ref(false);
const deleteErrorMessages = ref([]);
const reactionAction = ref(); // add or remove
const reactionType = ref();  // like or praise
const reportReason = ref("");
const showOnlyClose = ref(false);
const showErrorInReporting = ref(false);
const showEditIcon = ref(true);
const showDeleteIcon = ref(true);

function resetReportVars() {
    reportReason.value = "";
    showOnlyClose.value = false;
    showErrorInReporting.value = false;
}

async function generateModeratorReport() {
    showErrorInReporting.value = false;
    let reportObject = createReportOjbect();
    const result = await useStream.reportComment(reportObject)
    if (result === true) {
        reportReason.value = "";
        alterReportModalDisplay();
    } else {
        displayErrorNotification();
    }
}

function displayErrorNotification() {
    showErrorInReporting.value = true;
}

function alterReportModalDisplay() {
    showOnlyClose.value = true;
}

function createReportOjbect() {
    let reportMessage = createReportMessage();
    return {
        message: reportMessage,
        KeyFieldMemberId: props.comment.streammember.member.memberId,
        KeyFieldStreamId: useAuth.member.currentStreamId,
        KeyFieldStreamCommentId: props.comment.commentId
    }
}

function createReportMessage() {
    let messageString = "This comment was reported by ";  // this will be a vhtml String
    let currentMemberUser = useAuth.member.userName;
    let commentUser = props.comment.streammember.member.userName;
    let commentContent = purifiedComment.value; // trying to use purified version due to left-bracket issue

    messageString = `<p>` + messageString + currentMemberUser + `.  The commentor was ` + commentUser + `.  The reason for the report was: ` + reportReason.value + `.  The comment content: </p>` + commentContent;
    return messageString;
}

function activateEdit() {
    showEditSection.value = true;
}

function cancelEdit() {
    showEditSection.value = false;
}

function updated() {
    showEditSection.value = false;
}

function addPraiseClicked() {
    reactionAction.value = getAction(props.comment.praises);
    reactionType.value = "praise"
    updateReaction();
}

function addLikeClicked() {
    reactionAction.value = getAction(props.comment.likes);
    reactionType.value = "like"
    updateReaction();
}

function getAction(texCommaSeparatedList) {
    let doesListIncludeMember = texCommaSeparatedList.includes(useAuth.member.id);
    if (doesListIncludeMember) {
        return "remove";
    } else {
        return "add";
    }
}

async function updateReaction() {
    const reactionObject = getReactionObject();
    const result = await useStream.updateReaction(reactionObject)
}

function getReactionObject() {
    return {
        streamId: useAuth.member.currentStreamId,
        commentId: props.comment.commentId,
        reactionType: reactionType.value,
        action: reactionAction.value
    };
}

async function deleteComment() {
    deleteErrorMessages.value = [];
    const result = await useStream.deleteComment(props.comment.commentId);
    if (result === false) {
        deleteErrorMessages.value.push("Problem deleting comment");

    } else {
        // if true, then this comment then should dissappear from list
    }
}

function deleteSelected() {
    // reset any prior error messages
    deleteErrorMessages.value = [];
    if (showDeleteConfirmation.value === true) {
        showDeleteConfirmation.value = false;
    } else {
        showDeleteConfirmation.value = true;
    }
}

function cancelDelete() {
    if (showDeleteConfirmation.value === true) {
        showDeleteConfirmation.value = false;
    }
}

onMounted(() => {
    // vue does not trigger computed values when a new item is added to array so had to use onMounted in reverse  
    // i.e. only time adding to array dynamically is when user creates a new one, so default is to display option
    // but ... props don't get set at the onMounted step so it was giving me undefined 
    if (props.comment.streammember.member.memberId !== undefined && props.comment.streammember.member.memberId !== useAuth.member.id) {
        showEditIcon.value = false;
        showDeleteIcon.value = false;
    }
    modalId.value = "target" + Math.floor(Math.random() * 10000000);
})
</script>
    
<template>
    <div class="card mb-3">
        <div class="card-body smaller-font">
            <div v-if="!showEditSection">
                <span class="card-text" v-html="purifiedComment"></span>
            </div>

            <div v-if="showEditSection">
                <CommentEditor :comment="comment" @cancel="cancelEdit()" @updated="updated()"></CommentEditor>
            </div>
            <div v-if="showDeleteConfirmation">
                <div class="card bg-light mb-3" style="max-width: 20rem;">
                    <div class="card-body">
                        <p class="card-text">Are you sure you want to delete this comment?</p>
                        <button type="button" class="btn btn-secondary me-3" @click="deleteComment()">Yes:
                            Delete</button>
                        <button type="button" class="btn btn-secondary me-3" @click="cancelDelete()">Cancel</button>
                    </div>
                </div>
                <div class="text-danger" v-for="message in deleteErrorMessages" :key="message">
                    {{ message }}
                </div>
            </div>
        </div>
        <div class="card-footer">
            <span class="badge bg-secondary make-clickable" @click="addLikeClicked()" title="Like" alt="Like">❤️
                {{ computedLikesNumber }}</span>
            <span class="badge bg-secondary make-clickable" @click="addPraiseClicked()" title="Praise" alt="Praise">✝️
                {{ computedPraisesNumber }}</span>
            <span v-show="showEditIcon" class="badge bg-secondary make-clickable" @click="activateEdit()" title="Edit"
                alt="Edit">📝</span>
            <span v-show="showDeleteIcon" class="badge bg-secondary make-clickable" @click="deleteSelected()" title="Delete"
                alt="Delete">❌</span>
            <span class="badge bg-secondary make-clickable" @click="resetReportVars()" data-bs-toggle="modal"
                :data-bs-target="dataBsTarget" title="Report" alt="Report">🚩</span>
        </div>

    </div>

    <div :id="modalId" class="modal">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Report Comment to Moderator(s)</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true"></span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label for="exampleTextarea">Reason for reporting:</label>
                        <textarea v-model="reportReason" class="form-control" id="exampleTextarea" rows="3"></textarea>
                    </div>
                </div>
                <div v-if="!showOnlyClose" class="modal-footer">
                    <button type="button" class="btn btn-primary" @click="generateModeratorReport()">Send to
                        Moderator(s)</button>
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <div class="text-danger" v-show="showErrorInReporting">
                        Error creating report
                    </div>
                </div>
                <div v-if="showOnlyClose" class="modal-footer">
                    <div class="text-danger">Report Sent to moderator</div>
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>
</template>
    
<style scoped>
.make-clickable {
    cursor: pointer;
}

.smaller-font {
    font-size: small;
}
</style>
    