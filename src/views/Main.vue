<script setup>
// imports
import { onMounted, ref } from "vue";
import StreamSelect from "../components/StreamSelect.vue";
import StreamJoin from "../components/StreamJoin.vue";
import StreamRequest from "../components/StreamRequest.vue";
import Stream from "../components/Stream.vue";
import { useStreamStore } from "@/stores/stream";
import { useAuthStore } from "@/stores/auth";
import { useMemberStore } from "@/stores/member";

// state
const useStream = useStreamStore();
const useAuth = useAuthStore();
const useMember = useMemberStore();
const showStream = ref(false);
const showStreamRequest = ref(false);
const showStreamJoin = ref(false);
const streamMemberStatus = ref("");
const keyIndex = ref(); // assigned during onmounted

function setCurrentStreamName() {
  useStream.setCurrentStreamName(useAuth.member.currentStreamId)
}

async function inflateInitialStream() {
  await useStream.inflateCurrentStream(useAuth.member.currentStreamId);
}

function newSelection() {
  showStream.value = false;
  showStreamRequest.value = false;
  showStreamJoin.value = false;
  useStream.storePriorStream();  // store the old stream ID before attempting update
  updateStream();
}

async function updateStream() {
  showStream.value = false;

  const updateMemberResult = await useMember.updateMemberStream()
  // in this case we don't need to call setCurrentStreamName since StreamSelect is its vmodel hook
  // now check for keys before calling 

  if (checkForKeys() === false) {
    activateJoinOrRequest();
  }
  else {
    await inflateInitialStream();
    setLocalStreamMemberStatus();
    setEditorVisibility();
    showStream.value = true;
  }
}

function activateJoinOrRequest() {
  // toggle the correct option depending on the stream type
  const headerIndex = useStream.streamHeaders.findIndex(header => header.streamId === useAuth.member.currentStreamId)
  const type = useStream.streamHeaders[headerIndex].streamType

  if (type === "custom" || type === "singles") {
    showStreamRequest.value = true;
  } else {
    showStreamJoin.value = true;
  }
}

function checkForKeys() {
  keyIndex.value = useStream.streamHeaderKeys.findIndex(headerKey => headerKey.streamId === useAuth.member.currentStreamId)

  if (keyIndex.value === -1) { return false; } else { return true; }
}

function setLocalStreamMemberStatus() {
  streamMemberStatus.value = useStream.streamHeaderKeys[keyIndex.value].streammembers[0].status;
}

function setEditorVisibility() {
  if (streamMemberStatus.value === "normal") {
    useStream.displayEditor = true;
  } else {
    useStream.displayEditor = false;
  }
}

function checkForLeftStatus() {

  if (keyIndex.value > -1) {
    setLocalStreamMemberStatus();
    setEditorVisibility();
    if (streamMemberStatus.value === "memberleftstream") {
      return true; // they left so they must join or request to join again
    } else {
      return false;  // then member must be "restricted" or "normal" which is okay for navigation
    }
  } else {
    return false; // -1 means there are is no streammember record yet
  }
}

async function streammembershipdone() {
  // streamheader keys now exist for current stream so proceed with loading stream
  await inflateInitialStream();
  showStreamJoin.value = false;
  showStream.value = true;
  // trigger left-nav update 
  await useStream.getStreamMembers(useStream.currentStreamName)
}

function cancelRequest() {
  showStreamRequest.value = false;
  // the stream name has already been set by StreamRequest.vue during its cancel.
  updateStream();
}

function cancelJoin() {
  showStreamJoin.value = false;
  // the stream name has already been set by StreamJoin.vue during its cancel.
  updateStream();
}


onMounted(async () => {

  await useStream.getStreamHeaders();
  setCurrentStreamName();
  if (checkForKeys() === false || checkForLeftStatus() === true) {
    activateJoinOrRequest();
  }
  else {
    await inflateInitialStream()
    showStream.value = true;
  }
})
</script>

<template>
  <StreamSelect @newSelection="newSelection()">
  </StreamSelect>
  <!-- StreamJoin and StreamRequest handle access to the stream if the member isn't already a member -->
  <div v-if="showStreamJoin">
    <StreamJoin @streammembershipdone="streammembershipdone()" @canceljoin="cancelJoin()">
    </StreamJoin>
  </div>

  <div v-if="showStreamRequest">
    <StreamRequest @requestdone="requestDone()" @cancelrequest="cancelRequest()">
    </StreamRequest>
  </div>

  <div v-if="showStream">
    <Stream></Stream>
  </div>
</template>

<style scoped></style>
