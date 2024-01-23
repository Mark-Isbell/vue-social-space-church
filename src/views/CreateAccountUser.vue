<script setup>
// imports
import { onMounted, ref } from "vue";
import { useAuthStore } from "@/stores/auth";
import router from "@/router";

// state
const useAuth = useAuthStore();
const email = ref("");
const username = ref("");
const password1 = ref("");
const password2 = ref("");

// error messages
const validationMessages = ref([]);

async function activateRegistration() {
  if (validateFields() === true) {
    let result = await useAuth.register(username.value, email.value, password1.value, "unverified")
    if (result === true) {
      router.push('/createaccountuseremail');
    }
    else {
      // check for reason.  If it exists, display it. If not, provide a general error message.
      // ENUM: "Email already used"  || "User name already used" || ""
      if (useAuth.registrationErrorMessage !== "") {
        validationMessages.value.push(useAuth.registrationErrorMessage);
      }
      else if (useAuth.registrationErrorMessage === "") {
        validationMessages.value.push("Server Error");
      }
    }
  } else {
    // no action, or placeholder for adding a control for the error section here
  }
}

function isEmailValid() {
  return email.value.match(
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
}

function validatePassword() {
  if (password1.value.length === 0) {
    validationMessages.value.push("please enter a password");
    return false
  }
  if (password1.value !== password2.value) {
    validationMessages.value.push("the re-entry of password does not match");
    return false;
  }
  else {
    // check for leading blank
    if ((Array.from(password1.value)[0]) === " ") {
      validationMessages.value.push("Password cannot include leading blanks or trailing blanks");
      return false;
    }
    // check for trailing blank
    if ((password1.value.slice(-1)) === " ") {
      validationMessages.value.push("Password cannot include leading blanks or trailing blanks");
      return false;
    }
  }
  return true;
}

function validateFields() {
  // reset the validation messages each time the user hits "Next"
  validationMessages.value = [];
  // validations - userName
  // all unicode is okay
  // 1) must be at least one character long - cannot be an empty field
  // 2) cannot contain leading or trailing blanks
  if (username.value.length < 1) {
    validationMessages.value.push("User Name cannot be blank or include leading blanks or trailing blanks");
  }
  if (username.value.length > 0) {
    // check for leading or trailing blanks
    // check for leading blank
    if ((Array.from(username.value)[0]) === " ") {
      validationMessages.value.push("User Name cannot be blank or include leading blanks or trailing blanks");
    }
    // check for trailing blank
    if ((username.value.slice(-1)) === " ") {
      validationMessages.value.push("User Name cannot be blank or include leading blanks or trailing blanks");
    }
  }

  // validations - email
  if (!isEmailValid()) {
    validationMessages.value.push("Invalid email")
  }

  // validations - password
  validatePassword();

  if (validationMessages.value.length > 0) {
    return false;
  }
  return true;
}

onMounted(() => {
  // if member is already logged in do checks
  if (useAuth.member) {
    if (useAuth.member.isEmailConfirmed === "no") {
      // not confirmed
      router.push('/createaccountuseremail')
    }
    else if (useAuth.returnUrl) {
      // if normal member tried to access restricted page prior to login
      router.push(useAuth.returnUrl);
    }
    else {
      // confirmed and associated with church with no return URL on file
      router.push('/main')
    }
  }
})

</script>

<template>
  <div class="row">
    <div class="col-3"></div>
    <div class="col-6 mt-3 h4 text-center text-muted">
      Vue-Social-Space-Church
    </div>
    <div class="col-3"></div>
  </div>

  <div class="row">
    <div class="col-12 text-center mt-3">
      Create Your Account
    </div>
  </div>


  <div class="row mt-3">
    <div class="col-6 text-end">Your email:</div>
    <div class="col-6"><input type="text" name="" v-model="email"></div>
  </div>

  <div class="row mt-2">
    <div class="col-6 text-end">Your username:</div>
    <div class="col-6"><input type="text" name="" v-model="username"></div>
  </div>

  <div class="row mt-2">
    <div class="col-6 text-end">Your password:</div>
    <div class="col-6"><input type="password" name="" v-model="password1"></div>
  </div>

  <div class="row mt-2">
    <div class="col-6 text-end">Re-enter your password:</div>
    <div class="col-6"><input type="password" name="" v-model="password2"></div>
  </div>

  <div class="row">
    <div class="col-3"></div>
    <div class="col-6 text-center">
      <div class="text-danger" v-for="validationMessage in validationMessages" :key="validationMessage">
        {{ validationMessage }}
      </div>
    </div>
    <div class="col-3 mb-5"></div>
  </div>

  <div class="row mt-3 ">
    <div class="col-3"></div>
    <div class="col-6 text-center">
      <button @click="activateRegistration()" class="btn btn-primary">Next</button>
    </div>
    <div class="col-3 mb-5"></div>
  </div>

  <div class="row mt-5">
    <div class="col-4"></div>
    <div class="col-4 text-center">
      <router-link to="/login"> Log In</router-link>
    </div>
    <div class="col-4">
    </div>
  </div>
</template>

<style scoped></style>
