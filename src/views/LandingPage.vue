<script setup>
// imports
import router from "@/router";
import { useErrorStore } from "@/stores/error";

// state
const error = useErrorStore();
// example: error.logError("my error string goes here and it will navigate automatically for me")

// methods
const navToCreateAccount = () => {
  router.push('createaccountuser');
}
</script>

<template>
  <div class="row mt-5">
    <div class="col-3"></div>
    <div class="col-6 h2 text-center">
      Welcome to Vue-Social-Space-Church
    </div>
    <div class="col-3"></div>
  </div>

  <div class="row mt-3">
    <div class="col-3"></div>
    <div class="col-6 h4 text-muted em text-center">
      <em>This is the demonstration implementation for an open-source, social media, javascript project.
      </em>

    </div>
    <div class="col-3"></div>
  </div>



  <div class="row mt-3 ">
    <div class="col-3"></div>
    <div class="col-6 text-center">
      <button v-on:click="navToCreateAccount" class="btn btn-primary btn-lg">Sign Up</button>
    </div>
    <div class="col-3 mb-5"></div>
  </div>


  <!--






  <div class="row mt-5 ">
    <div class="col-3"></div>
    <div class="col-6 text-center">
      Demonstration logins:
    </div>
    <div class="col-3 mb-5"></div>
  </div>

  <div class="row ">
    <div class="col-3"></div>
    <div class="col-6 text-center">
      email: moderator@email.com | password: password
    </div>
    <div class="col-3 mb-5"></div>
  </div>


  <div class="row">
    <div class="col-3"></div>
    <div class="col-6 text-center">
      email: member@email.com | password: password
    </div>
    <div class="col-3 mb-5"></div>
  </div>

  <div class="row mt-3">
    <div class="col-3"></div>
    <div class="col-6 text-center">
      front end github:
      <a target="_blank"
        href="https://github.com/Mark-Isbell/vue-social-space-church">github.com/Mark-Isbell/vue-social-space-church</a>
    </div>
    <div class="col-3"></div>
  </div>

  <div class="row mt-3">
    <div class="col-3"></div>
    <div class="col-6 text-center">
      back end github:
      <a target="_blank"
        href="https://github.com/Mark-Isbell/vue-social-space-church-api">github.com/Mark-Isbell/vue-social-space-church-api</a>
    </div>
    <div class="col-3"></div>
  </div>
  -->
</template>

<style scoped></style>
