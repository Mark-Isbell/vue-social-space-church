<script setup>
// imports
import { useAuthStore } from "@/stores/auth";
import { onMounted } from "vue";
import router from "@/router";

// state
const useAuth = useAuthStore();

// methods
function resendEmail() {
  let result = useAuth.resendEmail();
  if (result === true) {
    // success message
  } else {
    // error message
  }
}

onMounted(async () => {
  // load the member fresh just in case they already confirmed from different browser or device
  await useAuth.getCurrentMemberRecord();
  if (useAuth.member.role === 'verified') {
    router.push({ path: '/createaccountuseremailconfirmed' })
  }
  if (useAuth.member.role === 'member' || useAuth.member.role === 'moderator') {
    router.push({ path: '/main' })
  }
  // if these two scenarios are not found, stay on page
})
</script>

<template>
  <div class="row mt-3">
    <div class="col-3"></div>
    <div class="col-6 h4 text-center">
      Confirm Email
    </div>
    <div class="col-3"></div>
  </div>

  <div class="row mt-3">
    <div class="col-3"></div>
    <div class="col-6">
      We've sent an email to {{ useAuth.member.email }}: Please confirm your account by clicking on the link in the email.
    </div>
    <div class="col-3"></div>
  </div>

  <div class="row mt-5">
    <div class="col-3"></div>
    <div class="col-6 text-center">
      Didn't receive the email?
    </div>
    <div class="col-3"></div>
  </div>

  <div class="row mt-3 ">
    <div class="col-3"></div>
    <div class="col-6 text-center">
      <button @click=resendEmail() class="btn btn-primary">Resend Email</button>
    </div>
    <div class="col-3 mb-5"></div>
  </div>
</template>

<style scoped></style>
