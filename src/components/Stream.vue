<script setup>
// imports
import { computed, reactive, ref } from "vue";
import { useStreamStore } from "@/stores/stream";
import { useAuthStore } from "@/stores/auth";
import CommentCard from "../components/CommentCard.vue";
import CustomQuillEditor from "../components/CustomQuillEditor.vue";

// state
const useAuth = useAuthStore();
// example: error.logError("my error string goes here and it will navigate automatically for me")
const useStream = useStreamStore();
const errorMessages = ref([]);
const showErrorMessages = ref(false);
const htmlToUpload = ref(``);
const isVisible = ref(false);

const state = reactive({
    content: '',
    _content: '',
    editorOption: {
        placeholder: 'core',
        modules: {
            // toolbars: [
            // custom toolbars options
            // will override the default configuration
            // ],
            // other moudle options here
            // otherMoudle: {}
        },
        // more options
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
    let slightlyModifiedHTML = removeFirstOccurrence(html, "<p>");
    useStream.currentStreamComment = "<p>" + useAuth.member.userName + ": " + slightlyModifiedHTML
}

function addSizeToImage() {
    if (htmlToUpload.value.includes(`img src=`)) {
        htmlToUpload.value = htmlToUpload.value.replace(`img src=`, `img width="250" src=`);
    }
}

setTimeout(() => {
    state.disabled = true
}, 2000)

function removeFirstOccurrence(str, searchstr) {
    var index = str.indexOf(searchstr);
    if (index === -1) {
        return str;
    }
    return str.slice(0, index) + str.slice(index + searchstr.length);
}

async function postComment() {
    showErrorMessages.value = false;
    errorMessages.value = [];
    let validated = validateComment();
    if (validated) {
        let commentObject = getCommentObject()

        let successOrFailure = await useStream.postComment(commentObject)
        if (successOrFailure) {
            resetComment();
        } else {
            errorMessages.value.push("Problem posting comment.");
            showErrorMessages.value = true;
        }
    }
}

function validateComment() {
    if (useStream.currentStreamComment === ``) {
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
    return true;
}

function countImages() {
    if (htmlToUpload.value.includes("<img")) {
        return htmlToUpload.value.match(/<img/g).length;
    }
    else return 0;
}

function resetComment() {
    useStream.currentStreamComment = ``;
    useStream.currentStreamBase64Image = ``;
    errorMessages.value = [];
    state.content = '';
    state._content = '';
}

function getCommentObject() {
    // one index points to header array and another points to comments array.  
    // they will not match
    return {
        streamId: useAuth.member.currentStreamId,
        streamMemberId: useStream.streamHeaderKeys[useStream.streamHeaderKeys.findIndex(header => header.streamId === useAuth.member.currentStreamId)].streammembers[0].streamMemberId,
        comment: useStream.currentStreamComment,
        image: useStream.currentStreamBase64Image
    }
}

const calculatedIndexForComments = computed(() => {
    if (useStream.indexOfCurrentStreamComments < 0) {
        return 0;
    } else {
        return useStream.indexOfCurrentStreamComments;
    }
})

function visibilityChanged(trueOrFalse, entry) {
    isVisible.value = trueOrFalse
    if (isVisible.value === true) {
        loadMoreComments();
    }
}

function getOldestCommentId() {
    // comments are already sorted newest to oldest, so grab last one in array
    let lastCommentIndex = useStream.streamComments[useStream.indexOfCurrentStreamComments].streamComments.length - 1;
    if (lastCommentIndex < 0) {
        return -1;
    } else {
        let OldestCommentId = useStream.streamComments[useStream.indexOfCurrentStreamComments].streamComments[lastCommentIndex].commentId;
        return OldestCommentId
    }
}

async function loadMoreComments() {
    let oldestCommentId = getOldestCommentId();
    if (oldestCommentId !== -1) {
        let result = await useStream.getOlderComments(useStream.streamComments[useStream.indexOfCurrentStreamComments].streamHeaderInfo.streamId, oldestCommentId);
        // no action based on 'result'
    } else {
        // no action, as no comments exist for this stream
    }
}

</script>
    
<template>
    <div v-if="useStream.displayEditor" class="card mb-1 w-100">
        <div class="card-body">
            <CustomQuillEditor v-model:value="state.content" @blur="onEditorBlur($event)" @focus="onEditorFocus($event)"
                @ready="onEditorReady($event)" @change="onEditorChange($event)">
            </CustomQuillEditor>
        </div>
    </div>

    <!--  Real-time preview for possible future enhancement
                                                                        <div class="row mt-2 mb-4">
                                                                            <div class="col-3"></div>
                                                                            <div class="col-7">
                                                                                {{ htmlToUpload }}
                                                                            </div>
                                                                            <div class="col-2"></div>
                                                                        </div>
    -->

    <div v-if="showErrorMessages" class="row mt-2 mb-2">
        <div class="col-3"></div>
        <div class="col-7">
            <div v-for="error in errorMessages" :key="error">
                {{ error }}
            </div>
        </div>
        <div class="col-2"></div>
    </div>

    <div v-if="useStream.displayEditor" class="row mt-1">
        <div class="col-3"></div>
        <div class="col-6 text-center">
            <button class="btn btn-primary" @click="postComment()">Post Comment</button>
        </div>
        <div class="col-3"></div>
    </div>


    <div class="mt-3" v-for="comment in useStream.streamComments[calculatedIndexForComments].streamComments" :key="comment">
        <CommentCard :comment="comment"></CommentCard>
    </div>



    <div v-observe-visibility="visibilityChanged" class="row mt-1">
        <div class="col-3"></div>
        <div class="col-6 text-center">
            <button class="btn btn-primary" @click="loadMoreComments()">- Load More -</button>
        </div>
        <div class="col-3"></div>
    </div>
</template>
    
<style scoped>
textarea {
    width: 100%;
}
</style>
    