<script setup>
import router from "@/router";
import { useRoute } from 'vue-router'
import { useAuthStore } from "@/stores/auth"
import { onMounted, computed, watch } from "vue";
import { useChurchStore } from '@/stores/church';

// state
const auth = useAuthStore();
const useChurch = useChurchStore();
const route = useRoute();

// computed
const path = computed(() => {
  return route.path
});

// watchers
watch(() => auth.member, (n) => {
  // If path is private page and user logs out then nav to -> login
  if (n === null && !auth.publicPages.includes(path.value)) {
    router.push('login');
  }
})

function homeSelected() {
  if (auth.member) {
    if (auth.member.isEmailConfirmed === "no") {
      // not confirmed
      router.push('/createaccountuseremail')
    }
    else if (auth.returnUrl) {
      // if normal member tried to access restricted page prior to login
      router.push(auth.returnUrl);
    }
    else {
      // confirmed and associated with church with no return URL on file
      router.push('/main')
    }
  }
  else {
    router.push('/');
  }
}

// church Menu
function pushToChurchInfo() {
  router.push({ path: '/churchinfo' })
}
function pushToChurchFacts() {
  router.push({ path: '/churchfacts' })
}
function pushToChurchMembers() {
  router.push({ path: '/churchmembers' })
}
function pushToChurchLinks() {
  router.push({ path: '/churchlinks' })
}

function pushToCalendar() {

  var date = new Date();
  var month = date.getMonth() + 1;
  var year = date.getFullYear();

  useChurch.scrollMonth = month;
  useChurch.scrollYear = year;

  router.push({
    name: "calendar", params: {
      month: month,
      year: year
    }
  });
}

function pushToChurchModeration() {
  router.push({ path: '/churchmoderation' })
}

// Member Account Menu
function pushToIntroduction() {
  router.push({ path: '/introduction' })
}
function pushToFacts() {
  router.push({ path: '/facts' })
}
function pushToPhoto() {
  router.push({ path: '/memberphoto' })
}

async function pushToProfile() {
  if (auth.member !== null) {
    await useChurch.getChurchMember(auth.member.id)
    if (useChurch.profileOfChurchMember.id === auth.member.id) {
      router.push('/memberprofile')
    }
    else {
      // member profile does not match member so no navigation
    }
  }
  else {
    // no member in auth store so no getting the profile
  }
}

function pushToAccountInfo() {
  router.push({ path: '/accountinfo' })
}
function pushToAccountSecurity() {
  router.push({ path: '/accountsecurity' })
}
function pushToDirectMessages() {
  router.push({ path: '/directmessages' })
}

// Moderation Menu
function pushToCreateNewStream() {
  router.push({ path: '/createnewstream' })
}

function pushToUpdateStream() {
  router.push({ path: '/updatestream' })
}

function pushToAccessRequests() {
  router.push({ path: '/accessrequests' })
}

function pushToAddToStream() {
  router.push({ path: '/addtostream' })
}

function pushToReports() {
  router.push({ path: '/reports' })
}

function pushToRestrictions() {
  router.push({ path: '/restrictions' })
}

function pushToPromoteModerator() {
  router.push({ path: '/promotemoderator' })
}

function pushToUpdateChurch() {
  router.push({ path: '/updatechurch' })
}

function pushToUpdateChurchFacts() {
  router.push({ path: '/updatechurchfacts' })
}

function pushToUpdateChurchLinks() {
  router.push({ path: '/updatechurchlinks' })
}

function pushToChurchModerationMaintenance() {
  router.push({ path: '/churchmoderationmaintenance' })
}

function pushToChurchInviteCode() {
  router.push({ path: '/churchinvitecode' })
}

async function pushToLoginAndLogout() {
  await router.push('/logout');
  auth.logout();
  router.push({ path: '/login' });
}

onMounted(() => {
  if (auth.member) {
    auth.showMemberMenu = true;
    if (auth.member.role === "moderator") {
      auth.showModeratorMenu = true;
    }
    else {
      auth.showModeratorMenu = false;
    }
  }

})

</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
    <div class="container-fluid">
      <span class="navbar-brand span-link" @click="homeSelected()">
        Vue-Social-Space-Church
      </span>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarColor01"
        aria-controls="navbarColor01" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarColor01">
        <ul class="navbar-nav me-auto">
          <li class="nav-item active">
            <span class="nav-link span-link" @click="homeSelected()">Home
            </span>
          </li>

          <li class="nav-item dropdown" v-if="auth.showMemberMenu">
            <a class="nav-link dropdown-toggle" data-bs-toggle="dropdown" href="#" role="button" aria-haspopup="true"
              aria-expanded="false">Church</a>
            <div class="dropdown-menu">
              <span class="dropdown-item span-link" @click="pushToChurchInfo()">Info
              </span>
              <span class="dropdown-item span-link" @click="pushToChurchFacts()">Facts
              </span>
              <span class="dropdown-item span-link" @click="pushToChurchMembers()">Members
              </span>
              <span class="dropdown-item span-link" @click="pushToChurchLinks()">Links
              </span>
              <span class="dropdown-item span-link" @click="pushToCalendar()">Calendar</span>
              <div class="dropdown-divider"></div>
              <span class="dropdown-item span-link" @click="pushToChurchModeration()">Moderation Policy</span>
            </div>
          </li>

          <li class="nav-item dropdown" v-if="auth.showMemberMenu">
            <a class="nav-link dropdown-toggle" data-bs-toggle="dropdown" href="#" role="button" aria-haspopup="true"
              aria-expanded="false">Account</a>
            <div class="dropdown-menu">
              <span class="dropdown-item span-link" @click="pushToIntroduction()">My Intro
              </span>
              <span class="dropdown-item span-link" @click="pushToFacts()">My Facts
              </span>
              <span class="dropdown-item span-link" @click="pushToPhoto()">Profile Photo
              </span>
              <div class="dropdown-divider"></div>
              <span class="dropdown-item span-link" @click="pushToProfile()">Public Profile
              </span>
              <div class="dropdown-divider"></div>
              <span class="dropdown-item span-link" @click="pushToAccountInfo()">Account Information
              </span>
              <span class="dropdown-item span-link" @click="pushToAccountSecurity()">Account Security
              </span>
              <div class="dropdown-divider"></div>
              <span class="dropdown-item span-link" @click="pushToDirectMessages()">Direct Messages
              </span>
            </div>
          </li>

          <li class="nav-item dropdown" v-if="auth.showModeratorMenu">
            <a class="nav-link dropdown-toggle" data-bs-toggle="dropdown" href="#" role="button" aria-haspopup="true"
              aria-expanded="false">Moderator</a>
            <div class="dropdown-menu">
              <span class="dropdown-item span-link" @click="pushToCreateNewStream()">Create New Stream
              </span>
              <span class="dropdown-item span-link" @click="pushToUpdateStream()">Update Stream
              </span>
              <span class="dropdown-item span-link" @click="pushToAccessRequests()">Access Requests</span>
              <span class="dropdown-item span-link" @click="pushToAddToStream()">Add Member to Stream</span>
              <div class="dropdown-divider"></div>
              <span class="dropdown-item span-link" @click="pushToReports()">Reports About Comments</span>
              <span class="dropdown-item span-link" @click="pushToRestrictions()">Member Restrictions</span>
              <div class="dropdown-divider"></div>
              <span class="dropdown-item span-link" @click="pushToPromoteModerator()">Promote Moderator</span>
              <div class="dropdown-divider"></div>
              <span class="dropdown-item span-link" @click="pushToUpdateChurch()">Update Church</span>
              <span class="dropdown-item span-link" @click="pushToUpdateChurchFacts()">Update Church Facts
              </span>
              <span class="dropdown-item span-link" @click="pushToUpdateChurchLinks()">Update Church Links
              </span>
              <span class="dropdown-item span-link" @click="pushToChurchModerationMaintenance()">Update Moderation Policy
              </span>
              <div class="dropdown-divider"></div>
              <span class="dropdown-item span-link" @click="pushToChurchInviteCode()">Invitation Code</span>

            </div>
          </li>
        </ul>

        <div class="d-flex">
          <div class="me-sm-5" v-if="auth.member">
            <span class="span-link navbar-brand" @click="pushToProfile()">{{ auth.member.userName }}</span>
          </div>

          <button v-show="!auth.member" class="btn btn-primary my-2 my-sm-0 btn-space"
            @click="$router.push({ path: '/login' })">Log In</button>
          <button v-show="!auth.member" class="btn btn-secondary my-2 my-sm-0 btn-space"
            @click="$router.push({ path: '/createaccountuser' })">Sign Up</button>
          <button v-show="auth.member" class="btn btn-secondary my-2 my-sm-0 btn-space"
            @click="pushToLoginAndLogout()">Log
            Out</button>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.span-link {
  cursor: pointer;
}

.text-softened {
  color: gray;
}

.btn-space {
  margin-right: 5px;
}

.dropdown-menu {
  margin: 0 !important;
}
</style>
