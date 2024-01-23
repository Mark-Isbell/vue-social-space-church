<script setup>
// imports
import { reactive, ref, onMounted } from "vue";
import { useErrorStore } from "@/stores/error";
import { useAuthStore } from "@/stores/auth";
import { useStreamStore } from "@/stores/stream";
import CustomQuillEditor from "../components/CustomQuillEditor.vue";

// state
const error = useErrorStore();
const props = defineProps({
    comment: {},
});
const emit = defineEmits(['cancel', 'updated']);
const useAuth = useAuthStore();
const useStream = useStreamStore();
// example: error.logError("my error string goes here and it will navigate automatically for me")
const errorMessages = ref([]);
const showErrorMessages = ref(false);
const htmlToUpload = ref(``); // intermediary processing variable - do not use for anything else
const originalCommentValue = ref(``); // used in case of error or cancel
const streamIndex = ref();
const commentIndex = ref();

const state = reactive({
    content: props.comment.comment,
    _content: '',
    editorOption: {
        placeholder: 'core',
        modules: {},
    },
    disabled: false
})

const onEditorBlur = (quill) => {
    // no action - debug location
}
const onEditorFocus = (quill) => {
    // no action - debug location
}
const onEditorReady = (quill) => {
    // no action - debug location
}
const onEditorChange = ({ quill, html, text }) => {
    // debug location
    state._content = html;
    htmlToUpload.value = html;
    addSizeToImage();
    html = htmlToUpload.value;
    // insert the userName after the first paragraph bracket
    let slightlyModifiedHTML = remove_first_occurrence(html, "<p>");
    useStream.streamComments[streamIndex.value].streamComments[commentIndex.value].comment = "<p>" + useAuth.member.userName + ": " + slightlyModifiedHTML

}

function addSizeToImage() {
    // assumes only one image, and enforces horizontal length
    if (htmlToUpload.value.includes(`img src=`)) {
        htmlToUpload.value = htmlToUpload.value.replace(`img src=`, `img width="250" src=`);
    }
}

setTimeout(() => {
    state.disabled = true
}, 2000)

function remove_first_occurrence(str, searchstr) {
    var index = str.indexOf(searchstr);
    if (index === -1) {
        return str;
    }
    return str.slice(0, index) + str.slice(index + searchstr.length);
}

async function updateComment() {
    showErrorMessages.value = false;
    errorMessages.value = [];
    let validated = validateComment()
    if (validated) {
        let commentObject = getCommentObject()

        let successOrFailure = await useStream.editComment(commentObject)
        if (successOrFailure) {
            resetComment();
            emit("updated");
        } else {
            errorMessages.value.push("Problem posting comment.");
            showErrorMessages.value = true;
            useStream.streamComments[streamIndex.value].streamComments[commentIndex.value].comment = originalCommentValue.value;
        }
    }
}

function validateComment() {
    if (useStream.streamComments[streamIndex.value].streamComments[commentIndex.value].comment === ``) {
        errorMessages.value.push("Please add some content to your comment")
        showErrorMessages.value = true;
        return false;
    }
    const numberOfImages = countImages();
    if (numberOfImages !== null && numberOfImages > 1) {
        errorMessages.value.push("Only one image per comment is allowed")
        showErrorMessages.value = true;
        return false;
    }
    if (props.comment.streammember.member.memberId !== useAuth.member.id) {
        errorMessages.value.push("Cannot update another member's comment");
        showErrorMessages.value = true;
        return false;
    }
    return true;
}

function countImages() {
    if (htmlToUpload.value.includes("<img")) {
        return htmlToUpload.value.match(/<img/g).length;
    }
    else return 0;
}

function resetComment() {
    errorMessages.value = [];
    state.content = "";
    state._content = '';
}

function getCommentObject() {
    return {
        commentId: props.comment.commentId,
        comment: useStream.streamComments[streamIndex.value].streamComments[commentIndex.value].comment,
        status: "visible"
    }
}

function cancel() {

    useStream.streamComments[streamIndex.value].streamComments[commentIndex.value].comment = originalCommentValue.value;
    emit('cancel');
}

function getFixedOriginalComment() {
    let target = "&lt;";
    let replacement = "<";
    const fixedComment = props.comment.comment.replaceAll(target, replacement);
    let userNameLabel = useAuth.member.userName + ": ";
    const commentReadyForEdit = removeFirstOccurrence(fixedComment, userNameLabel);
    return commentReadyForEdit;
}

function removeFirstOccurrence(str, searchstr) {
    var index = str.indexOf(searchstr);
    if (index === -1) {
        return str;
    }
    return str.slice(0, index) + str.slice(index + searchstr.length);
}

function setIndexOfStream() {
    streamIndex.value = useStream.getStreamCommentsIndexByName(useStream.currentStreamName);
    useStream.indexOfCurrentStream = streamIndex.value;
}

function getIndexOfCommentInStream() {
    commentIndex.value = useStream.findIndexOfCommentByCommentId(props.comment.commentId);
}

onMounted(() => {
    originalCommentValue.value = props.comment.comment; // used for error reset or cancel
    // assign initial values to be used in case of cancel
    state.content = getFixedOriginalComment();
    setIndexOfStream();
    getIndexOfCommentInStream();
})

</script>
    
<template>
    <div class="card mb-1 w-auto">

        <div class="card-body">

            <CustomQuillEditor v-model:value="state.content" @blur="onEditorBlur($event)" @focus="onEditorFocus($event)"
                @ready="onEditorReady($event)" @change="onEditorChange($event)">
            </CustomQuillEditor>

        </div>
    </div>

    <div v-if="showErrorMessages" class="row mt-2 mb-2">
        <div class="col-3"></div>
        <div class="col-7">
            <div v-for="error in errorMessages" :key="error">
                {{ error }}
            </div>
        </div>
        <div class="col-2"></div>
    </div>

    <div class="row mt-4">
        <div class="col-3"></div>
        <div class="col-3">
            <button class="btn btn-primary" @click="updateComment()">Update Comment</button>
        </div>
        <div class="col-3">
            <button class="btn btn-primary" @click="cancel()">Cancel</button>
        </div>
        <div class="col-3"></div>
    </div>
</template>
    
<style scoped>
textarea {
    width: 100%;
}
</style>
    