<script setup>
// imports
import { onMounted, computed, ref } from "vue";
import { useChurchStore } from "@/stores/church";
import { useMemberStore } from "@/stores/member";
import { useAuthStore } from "@/stores/auth";
import { useDirectMessageStore } from "@/stores/directmessage";
import router from "@/router";
import FactMemberProfile from "@/components/FactMemberProfile.vue";

// state
const useChurch = useChurchStore();
const useMember = useMemberStore();
const useAuth = useAuthStore();
const singleDirectMessageList = ref([]); // list of members with existing single DM
const singleExistsIndex = ref(-1);
const useDirectMessage = useDirectMessageStore();

const showProfilePic = ref(false);
const displayDirectMessageButton = ref(false);

async function activateDirectMessage() {
  if (!targetIsSelf()) {
    if (directMessageAlreadyExists()) {
      useDirectMessage.selectedDirectMessageName = singleDirectMessageList.value[singleExistsIndex.value].fullParticipantString;
      router.push('/directmessages')
    } else {
      const directMessageObject = getDirectMessageOjbect();
      const response = await useDirectMessage.createDirectMessage(directMessageObject);

      if (response === true) {
        await useDirectMessage.updateMemberWithCurrentDirectMessageId(useDirectMessage.currentDirectMessage.id);
        router.push('/directmessages')
      }
      else {

        // error condition.  Just stay on page and display error ...
      }
    }
  }
}

function targetIsSelf() {
  // members cannot DM with themselves

  if (!useChurch.profileOfChurchMember.id || useChurch.profileOfChurchMember.id === useAuth.member.id) { return true; }
  else { return false; }
}

function getDirectMessageOjbect() {
  let DMObject = {
    title: "placeholder for future development",
    memberId: useChurch.profileOfChurchMember.id,
    memberName: useChurch.profileOfChurchMember.userName
  }
  return DMObject;
}

function directMessageAlreadyExists() {
  const checkIndex = singleDirectMessageList.value.findIndex(dmSingleObject => dmSingleObject.singleName === useChurch.profileOfChurchMember.userName);

  if (checkIndex === -1) { return false; }
  else {
    singleExistsIndex.value = checkIndex;
    return true;
  }
}

function createSingleDirectMessageList() {
  // Add a count function to String prototype
  String.prototype.count = function (c) {
    var result = 0, i = 0;
    for (i; i < this.length; i++)if (this[i] == c) result++;
    return result;
  };
  // create a list of existing direct messages represented by single names
  // participantString uses comma separated names
  const fieldToReplace1 = "" + useAuth.member.userName;
  const fieldToReplace2 = ",";
  for (let i = 0; i < useDirectMessage.directMessageHeaders.length; i++) {
    if (useDirectMessage.directMessageHeaders[i].participantString.count(",") === 1) {
      let beginningSingleName = useDirectMessage.directMessageHeaders[i].participantString.replace(fieldToReplace1, "");
      let finalSingleName = beginningSingleName.replace(fieldToReplace2, "");
      let singleListObject = {
        fullParticipantString: useDirectMessage.directMessageHeaders[i].participantString,
        singleName: finalSingleName
      }
      singleDirectMessageList.value.push(singleListObject);
    }
  }

}

const computedCreatedAt = computed(() => {


  const createdDate = new Date(useChurch.profileOfChurchMember.createdAt);
  const createdAt_date = createdDate.getDate();
  const createdAt_month = createdDate.getMonth() + 1; //Months are zero based
  const createdAt_year = createdDate.getFullYear();
  const combinedDate = "" + createdAt_month + "/" + createdAt_date + "/" + createdAt_year;

  return combinedDate;
})

onMounted(async () => {
  // get user member's direct message headers first regardless of further action
  await useDirectMessage.getDirectMessageHeaders();
  // create helper to decide to create new DM or go to existing DM
  createSingleDirectMessageList();

  // now analyze the profile of the church member that was clicked or loaded
  if (useChurch.profileOfChurchMember.profilePic) {
    showProfilePic.value = true;
  }
  if (useChurch.profileOfChurchMember.id > 0 && useChurch.profileOfChurchMember.id !== useAuth.member.id) { displayDirectMessageButton.value = true; }

})

</script>

<template>
  <div class="row justify-content-center mt-5">
    <div class="col-lg-3"></div>
    <div class="col-4 h4 text-center">
      Member Profile: {{ useChurch.profileOfChurchMember.userName }}
    </div>
    <div class="col-lg-5"></div>
  </div>

  <div class="row justify-content-center mt-1">
    <div class="col-lg-3"></div>
    <div class="col-4 h6 text-center">
      Role: {{ useChurch.profileOfChurchMember.role }}
    </div>
    <div class="col-lg-5"></div>
  </div>

  <div class="row justify-content-center mt-1">
    <div class="col-lg-3"></div>
    <div class="col-4 h6 text-center">
      Joined: {{ computedCreatedAt }}
    </div>
    <div class="col-lg-5"></div>
  </div>
  <div class="row justify-content-center mt-2">
    <div class="col-lg-4"></div>
    <div class="col-lg-4 text-center">
      <div class="card text-center border-primary mb-3" style="max-width: 20rem;">
        <div class="card-header">
          <div v-show="displayDirectMessageButton">
            <button class="btn btn-primary text-end" @click="activateDirectMessage()">Direct Message</button>
          </div>
        </div>
        <div class="card-body">
          <div v-show="useChurch.profileOfChurchMember.profilePic">
            <h4 class="card-title">Member Image</h4>
            <img width="110" height="110" class="preview my-3" :src="useChurch.profileOfChurchMember.profilePic" alt="" />
          </div>
          <div v-show="!useChurch.profileOfChurchMember.profilePic">
            <h4 class="card-title">Member Image</h4>
            <img slot="picture" src="@/assets/defaultProfileImage/blankProfileImage.png" alt="Member Image" width="110"
              height="110">
          </div>
        </div>
      </div>
    </div>

    <div class="col-lg-4"></div>


  </div>

  <div class="row justify-content-center mt-4 mb-2">
    <div class="col-12 text-primary text-center">
      Short Biography
    </div>
  </div>

  <div class="card border-primary mb-3 w-100">
    <div class="card-header">
      About Me:
    </div>
    <div class="card-body">
      {{ useChurch.profileOfChurchMember.introduction }}
    </div>
  </div>

  <div class="row justify-content-center mt-4 mb-2">
    <div class="col-12 text-primary text-center">
      Other Facts About Me
    </div>
  </div>

  <FactMemberProfile v-for="fact in useChurch.profileOfChurchMemberFacts" :key="fact" :fact="fact"></FactMemberProfile>
</template>

<style scoped>
div {
  white-space: pre-wrap;
}
</style>
