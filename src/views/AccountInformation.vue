
<script setup>

import { useAuthStore } from "../stores/auth";
import { onMounted, ref } from "vue";
import UpdateUserName from "../components/UpdateUserName.vue";
import UpdateEmail from "../components/UpdateEmail.vue";
const useAuth = useAuthStore();

const toggleUserNameUpdate = ref(false);
const toggleEmailUpdate = ref(false);

const initialUserName = ref();
const initialEmail = ref();

const validationMessages = ref([]);

function showUpdateUserName() {
  if (toggleUserNameUpdate.value === false) { toggleUserNameUpdate.value = true; }
  else { toggleUserNameUpdate.value = false; }
}

function showUpdateEmail() {
  if (toggleEmailUpdate.value === false) { toggleEmailUpdate.value = true; }
  else { toggleEmailUpdate.value = false; }
}

function toggleAllClosed() {
  toggleUserNameUpdate.value = false;
  toggleEmailUpdate.value = false;
}

function isEmailValid() {
  return useAuth.member.email.match(
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
}

function validateEmailAndUserName() {
  // first reset validations every time this method is triggered
  validationMessages.value = [];
  // validations - userName
  // all unicode is okay
  // 1) must be at least one character long - cannot be an empty field
  // 2) cannot contain leading or trailing blanks
  if (useAuth.member.userName.length < 1) {
    validationMessages.value.push("User Name cannot be blank or include leading blanks or trailing blanks");
  }
  if (useAuth.member.userName.length > 0) {
    // check for leading or trailing blanks
    // check for leading blank
    if ((Array.from(useAuth.member.userName)[0]) === " ") {
      validationMessages.value.push("User Name cannot be blank or include leading blanks or trailing blanks");
    }
    // check for trailing blank
    if ((useAuth.member.userName.slice(-1)) === " ") {
      validationMessages.value.push("User Name cannot be blank or include leading blanks or trailing blanks");
    }
  }

  // validations - email
  if (!isEmailValid()) {
    validationMessages.value.push("Invalid email")
  }

  if (validationMessages.value.length > 0) {
    return false;
  }
  return true;
}

async function saveNameAndEmail() {
  if (
    initialUserName.value === useAuth.member.userName &&
    initialEmail.value === useAuth.member.email
  ) {
    toggleAllClosed()
    validationMessages.value = []
  } else {
    if (validateEmailAndUserName()) {
      let accountObject = {
        userName: useAuth.member.userName,
        email: useAuth.member.email
      }

      const result = await useAuth.updateAccount(accountObject);

      if (result === false) {
        useAuth.member.userName = initialUserName.value;
        useAuth.member.email = initialEmail.value;
        if (useAuth.updateMemberErrorMessage !== "") {
          validationMessages.value.push(useAuth.updateMemberErrorMessage);
        }
        else if (useAuth.updateMemberErrorMessage === "") {
          validationMessages.value.push("Server Error");
        }
      }
      else {
        toggleAllClosed()
        // update ALL LOCAL VALUES AFTER SUCCESSFUL UPDATE
        initialUserName.value = useAuth.member.userName;
        initialEmail.value = useAuth.member.email;
        validationMessages.value = []
      }
    }
    else {
      // here we've discovered email and username are not valid.  
      // we've already populated validationsMessages with the specifics
    }
  }
}
function cancel() {
  useAuth.member.userName = initialUserName.value
  useAuth.member.email = initialEmail.value
  validationMessages.value = []
  toggleAllClosed()
}

onMounted(() => {
  // assign initial values to be used in case of cancel

  if (useAuth.member !== null) {
    initialUserName.value = useAuth.member.userName;
    initialEmail.value = useAuth.member.email;
  } else {
    // nothing
  }
})

</script>
  
<template>
  <div class="row mt-3">
    <div class="col-3"></div>
    <div class="col-6 h4 text-center">
      Account Information
    </div>
    <div class="col-3"></div>
  </div>

  <div class="row mt-2">
    <div class="col-6 text-end"> Current User Name:</div>
    <div class="col-3">{{ initialUserName }}</div>
    <div class="col-3"> <span class="make-clickable" @click="showUpdateUserName()">
        📝
      </span></div>
  </div>

  <div v-show="toggleUserNameUpdate">
    <div class="row">
      <div class="col-3"></div>
      <div class="col-6 text-center">
        <UpdateUserName @savename="saveNameAndEmail()" @cancel="cancel()">
        </UpdateUserName>
      </div>
      <div class="col-3"></div>
    </div>
  </div>

  <div class="row mt-3">
    <div class="col-6 text-end">Email:</div>
    <div class="col-3">{{ initialEmail }}</div>
    <div class="col-3">
      <span class="make-clickable" @click="showUpdateEmail()">
        📝
      </span>
    </div>
  </div>

  <div v-show="toggleEmailUpdate">
    <div class="row">
      <div class="col-3"></div>
      <div class="col-6 text-center">
        <UpdateEmail @saveemail="saveNameAndEmail()" @cancel="cancel()">
        </UpdateEmail>
      </div>
      <div class="col-3"></div>
    </div>
  </div>

  <div class="row mt-3 mb-1">
    <div class="col-4"></div>
    <div class="col-6">
      <div class="text-danger" v-for="message in validationMessages" :key="message">
        {{ message }}
      </div>
    </div>
    <div class="col-2"></div>
  </div>
</template>
  
<style scoped>
.make-clickable {
  cursor: pointer;
}
</style>
  