<script setup lang="ts">
// imports
import { useErrorStore } from "@/stores/error";
import { useMemberStore } from "../stores/member";
import { useChurchStore } from "../stores/church";
import { onMounted, ref, watch } from "vue";
import router from "@/router";
const error = useErrorStore();
// example: error.logError("my error string goes here and it will navigate automatically for me")

// state
const useMember = useMemberStore();
const useChurch = useChurchStore();
const showChurchName = ref(false);
const showInvalidMessage = ref(false);
const activeOrNot = ref(false);
const invalidMessage = ref("Invalid or expired invitation code")

async function sendInviteCode() {
  let successOrFailure = await useMember.updateMemberChurch(useMember.inviteCode)
  if (successOrFailure) {
    router.push('main')
  }
  else {
    error.logError("Error occurred: Church join failure.  Please try again later or re-verify the invitation code.")
  }
}

// watchers
watch(() => useMember.inviteCode, (n) => {

  // umbrella length check
  if (useMember.inviteCode.length !== 7) {
    showChurchName.value = false;
    showInvalidMessage.value = false;
    activeOrNot.value = false;
  }
  else {
    // assume here that the length is 7 so run the tests
    showChurchName.value = false;
    showInvalidMessage.value = false;
    activeOrNot.value = false;
    // test for name
    getChurchName();
  }
})

async function getChurchName() {
  const result = await useChurch.getChurchNameByInviteCode(useMember.inviteCode)
  // set toggles
  if (result === true) {
    showChurchName.value = true;
    activeOrNot.value = true;
  } else {
    showInvalidMessage.value = true;
  }
}


</script>

<template>
  <div class="row mt-5">
    <div class="col-3"></div>
    <div class="col-6">
      Thank you for confirming your email:
    </div>
    <div class="col-3"></div>
  </div>

  <div class="row mt-3">
    <div class="col-3"></div>
    <div class="col-6">
      <p>
        Your church should have provided you with an invitation code.
        Please enter the invitation code below to continue.
      </p>
    </div>
    <div class="col-3"></div>
  </div>

  <!--
    <div class="row mt-3 ">
    <div class="col-2"></div>
    <div class="col-3 text-end">Demonstration Church Invitation Code: </div>
    <div class="col-3"> XB73MZS </div>
    <div class="col-4"></div>
  </div>
  -->

  <div class="row mt-3 ">
    <div class="col-2"></div>
    <div class="col-3 text-end">Invitation code: </div>
    <div class="col-3"> <input v-model="useMember.inviteCode" type="text" name="" id=""></div>
    <div class="col-4"></div>
  </div>

  <div class="row mt-3 ">
    <div class="col-3"></div>
    <div class="col-3 text-end">
      <router-link to="/codeexplained">How do I get an invite code?</router-link>
    </div>
    <div class="col-3"> <button :disabled="!activeOrNot" @click="sendInviteCode()" class="btn btn-primary">Next</button>
    </div>
    <div class="col-3"></div>
  </div>

  <div class="row mt-3" v-show="showChurchName">
    <div class="col-3"></div>
    <div class="col-6 text-success">
      Correct invitation code: {{ useChurch.newChurchName }}
    </div>
    <div class="col-3"></div>
  </div>

  <div class="row mt-3" v-show="showInvalidMessage">
    <div class="col-3"></div>
    <div class="col-6 text-danger">
      {{ invalidMessage }}
    </div>
    <div class="col-3"></div>
  </div>
</template>

<style scoped></style>
