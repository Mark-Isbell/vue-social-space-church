<script setup>
import { useAuthStore } from "@/stores/auth";
import { useDirectMessageStore } from "@/stores/directmessage";
import { computed, onMounted, ref } from "vue";
import DirectMessageSelect from "../components/DirectMessageSelect.vue";
import DirectMessageAddPeople from "../components/DirectMessageAddPeople.vue";

// state
const useDirectMessage = useDirectMessageStore();
const useAuth = useAuthStore();
const displayComments = ref(false);
const constructedComments = ref("");
const directMessageIdForAdding = ref("");
const showAddPeople = ref(false);
const showAddPeopleButton = ref(false);
const isVisible = ref(false);

const constructedCommentsAreaRef = ref(null);

const toField = computed(() => {
    const fieldToReplace = useAuth.member.userName + ",";
    let newToField = useDirectMessage.selectedDirectMessageName.replace(fieldToReplace, "");
    return newToField;
})

function toggleShowAddPeople() {
    if (showAddPeople.value === false) {
        showAddPeople.value = true;
    } else {
        showAddPeople.value = false;
    }
}

async function createComment() {
    let isCommentValid = validateComment();
    if (isCommentValid) {
        let commentObject = createCommentObject();

        const result = await useDirectMessage.createDirectMessageComment(commentObject);

        if (result === true) {
            useDirectMessage.currentDirectMessageComment = "";
            constructedCommentsAreaRef.value.scrollTop = constructedCommentsAreaRef.value.scrollHeight;
        }
    }
    else {
        // do nothing as field is blank
    }
}

function validateComment() {
    if (useDirectMessage.currentDirectMessageComment === "") {
        return false;
    } else {
        return true;
    }
}

function createCommentObject() {
    const dmId = getDirectMessageIdWithName();
    const dmMemberId = getDmMemberIdByDmId(dmId);

    let commentObject = {
        directMessageId: dmId,
        directMessageMemberId: dmMemberId,
        comment: useDirectMessage.currentDirectMessageComment
    }
    return commentObject;
}

function getDmMemberIdByDmId(dmId) {
    const dmIndex = useDirectMessage.directMessageHeaders.findIndex(header => header.directMessageId === dmId);
    const dmMemberId = useDirectMessage.directMessageHeaders[dmIndex].directmessagemembers[0].directMessageMemberId;
    return dmMemberId;
}

function getDirectMessageIdWithName() {
    const dmIndex = useDirectMessage.directMessageHeaders.findIndex(header => header.participantString === useDirectMessage.selectedDirectMessageName);
    const dmId = useDirectMessage.directMessageHeaders[dmIndex].directMessageId;
    return dmId;
}

function getDirectMessageNameWithId(targetDirectMessageId) {
    const dmIndex = useDirectMessage.directMessageHeaders.findIndex(header => header.directMessageId === targetDirectMessageId);
    const directMessageName = useDirectMessage.directMessageHeaders[dmIndex].participantString;
    return directMessageName;
}

async function getComments(directMessageId) {
    const result = await useDirectMessage.getDirectMessageComments(directMessageId)
    if (result === true) {
        displayComments.value = true;
        return true;
    }
    else {
        return false;
    }
}

async function memberAdded() {
    constructedCommentsAreaRef.value.scrollTop = constructedCommentsAreaRef.value.scrollHeight;
}

async function newSelection() {
    // clear variables for new direct message content
    resetDirectMessageVariablesAndStore();
    if (useDirectMessage.selectedDirectMessageName !== "") {
        const directMessageId = getDirectMessageIdWithName();
        directMessageIdForAdding.value = directMessageId;
        await useDirectMessage.updateMemberWithCurrentDirectMessageId(directMessageId);
        await getComments(directMessageId);
        showAddPeopleButton.value = true;
        constructedCommentsAreaRef.value.scrollTop = constructedCommentsAreaRef.value.scrollHeight;
    }
}

function resetDirectMessageVariablesAndStore() {
    constructedComments.value = "";
    useDirectMessage.currentDirectMessage = {};
    useDirectMessage.currentDirectMessageMembers = [];
    useDirectMessage.currentDirectMessageComments = [];
    useDirectMessage.currentDirectMessageComment = "";
}

function visibilityChanged(trueOrFalse, entry) {
    isVisible.value = trueOrFalse
    if (isVisible.value === true) {
        loadMoreDirectMessages();
    }
}

async function loadMoreDirectMessages() {
    // check to see if there is more than one direct message before proceeding
    if (useDirectMessage.currentDirectMessageComments.length > 0) {
        const oldestComment = getOldestComment();
        await useDirectMessage.getOlderDirectMessageComments(oldestComment.directMessageId, oldestComment.directMessageCommentId)
    }
}

function getOldestComment() {
    if (useDirectMessage.currentDirectMessageComments) {
        return useDirectMessage.currentDirectMessageComments[0];
    }
}

onMounted(async () => {
    if (useDirectMessage.selectedDirectMessageName !== "") {
        const directMessageId = getDirectMessageIdWithName();
        directMessageIdForAdding.value = directMessageId;
        await getComments(directMessageId);
        showAddPeopleButton.value = true;
        constructedCommentsAreaRef.value.scrollTop = constructedCommentsAreaRef.value.scrollHeight;
    }
    else {
        let localMember = {};
        if (JSON.parse(localStorage.getItem('member'))) { localMember = JSON.parse(localStorage.getItem('member')); }
        else localMember = null;
        if (localMember && localMember.currentDirectMessageId !== null) {
            let result = await getComments(localMember.currentDirectMessageId);
            if (result === true) {
                useDirectMessage.selectedDirectMessageName = getDirectMessageNameWithId(localMember.currentDirectMessageId)
                directMessageIdForAdding.value = localMember.currentDirectMessageId;
                showAddPeopleButton.value = true;
                constructedCommentsAreaRef.value.scrollTop = constructedCommentsAreaRef.value.scrollHeight;
            }
        }
        else {
            // no member record
        }
    }
})
</script>


<template>
    <div class="row mt-3">
        <div class="col-3"></div>
        <div class="col-6 h6 text-center">
            <DirectMessageSelect @newDMSelection="newSelection()"></DirectMessageSelect>
        </div>
        <div class="col-3"></div>
    </div>

    <div class="row mt-3" v-show="showAddPeopleButton">
        <div class="col-3"></div>
        <div class="col-6 h6 text-center">
            <button @click="toggleShowAddPeople()" class="btn btn-outline-primary">Add People</button>
        </div>
        <div class="col-3"></div>
    </div>

    <div v-if="showAddPeople">
        <DirectMessageAddPeople :directMessageId="directMessageIdForAdding" @addmember="memberAdded()"
            @cancel="toggleShowAddPeople()">
        </DirectMessageAddPeople>
    </div>

    <div class=" mt-2 card border-primary">
        <div class="row mt-3">
            <div class="col-12 text-center text-muted">
                Direct Message to: {{ toField }}
            </div>
        </div>

        <div class="row mt-3">
            <div class="col-1"></div>
            <div class="col-10" style="overflow-y: scroll; height:400px;" ref="constructedCommentsAreaRef">

                <div v-observe-visibility="visibilityChanged">
                    <button class="btn btn-primary btn-sm" @click="loadMoreDirectMessages()">- Load More Previous Messages
                        -</button>
                </div> <br><br>
                <div v-for="comment in useDirectMessage.currentDirectMessageConstructedComments" :key="comment">
                    {{ comment.comment }}
                </div>
                <br>
            </div>
            <div class="col-1"></div>
        </div>

        <div class="row mt-2">
            <div class="col-1"></div>
            <div class="col-10 text-center">
                <textarea v-model="useDirectMessage.currentDirectMessageComment" class="form-control" name="" id=""
                    cols="50" rows="2"></textarea>
            </div>
            <div class="col-1"></div>
        </div>

        <div class="row mt-2">
            <div class="col-12 text-center">
                <button @click="createComment()" class="btn btn-primary">Send Message</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.scrollable {
    overflow-y: scroll;
    height: 400px;
}

div {
    white-space: pre-wrap;
}
</style>
    