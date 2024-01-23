import { defineStore } from "pinia";
import BackEndCalls from "../services/BackEndCalls";
import { useChurchStore } from "@/stores/church";
import { useDirectMessageStore } from "@/stores/directmessage";
import { useErrorStore } from "@/stores/error";
import { useImageStore } from "@/stores/image";
import { useMemberStore } from "@/stores/member";
import { useModeratorStore } from "@/stores/moderator";
import { useStreamStore } from "@/stores/stream";

export const useAuthStore = defineStore({
  id: "auth",
  state: () => ({
    // initialize state from local storage to enable member to stay logged in
    // redundant load placed in App.vue. 
    member: JSON.parse(localStorage.getItem('member')),
    newPassword: "",
    loggedInUserName: "",
    showModeratorMenu: false,
    showMemberMenu: false,
    returnUrl: null,
    // password reset api call
    passwordResetRequestErrorMessage: "", // ENUM: "Invalid credentials" || "Email restricted from password change"
    pathHistory: [],
    // role-based security 
    publicPages: ['landingpage','about','login','logout', 'createaccountuser', 'requestpasswordreset','catcher','catcherpasswordreset','errorpage'],
    unverifiedPages: ['landingpage','about','login','logout', 'createaccountuser', 'createaccountuseremail','createaccountuseremailconfirmed','requestpasswordreset','catcher','catcherpasswordreset','errorpage','codeexplained'],
    verifiedPages: ['landingpage','about','login','logout', 'createaccountuser', 'createaccountuseremail','createaccountuseremailconfirmed','requestpasswordreset','catcher','catcherpasswordreset','errorpage','codeexplained'],
    memberPages: ['landingpage','about','login','logout', 'createaccountuser', 'createaccountuseremail','createaccountuseremailconfirmed','requestpasswordreset','catcher','catcherpasswordreset','errorpage','main','createaccountuseremail','createaccountuseremailconfirmed','codeexplained','accountinfo','accountsecurity','memberprofile','memberphoto','introduction','facts','directmessages','churchinfo','churchfacts','churchmoderation','churchmembers','churchlinks','calendar'],
    moderatorPages: ['landingpage','about','login','logout', 'createaccountuser', 'createaccountuseremail','createaccountuseremailconfirmed','requestpasswordreset','catcher','catcherpasswordreset','errorpage','main','createaccountuseremail','createaccountuseremailconfirmed','codeexplained','accountinfo','accountsecurity','memberprofile','memberphoto','introduction','facts','directmessages','churchinfo','churchfacts','churchmoderation','churchmembers','churchlinks','calendar','churchmoderationmaintenance','churchsignup','churchsignupinvitecode','reportdecision','reports','restrictions','updatechurchlinks','createnewstream','accessrequests','updatestream','updatechurch','promotemoderator','addtostream','globalblocklist','globalblockcreate','updatechurchfacts','churchinvitecode'],
 
    // registration call
    registrationErrorMessage: "",

    // update account call
    updateMemberErrorMessage: ""
  }),
  getters: {

  },
  actions: {

  async updateAccount(accountObject) {
    try { 
    const response = await BackEndCalls.updateAccount(accountObject);

    // update pinia state
    this.member = response.data.data;

    // store user details and jwt in local storage to keep user logged in between page refreshes
    localStorage.setItem('member', JSON.stringify(this.member));
    return true;
  } catch (error) {
    if(error.response.data.message) {
          
    // ENUM: "Email already used"  || "User name already used" || undefined
    this.updateMemberErrorMessage = error.response.data.message
    }
    return false;
  }
},

  async register(username, email, password, role) {
    try {
    const response = await BackEndCalls.postRegistration(username, email, password, role);
    // update pinia state
    this.member = response.data.member;
    // store user details and jwt in local storage to keep user logged in between page refreshes
    localStorage.setItem('member', JSON.stringify(this.member));
    localStorage.setItem('token', response.data.token);
    return true;
  } catch (error) {
    if(error.response.data.message) {
    // ENUM: "Email already used"  || "User name already used" || undefined
    this.registrationErrorMessage = error.response.data.message
    }
    return false;      
  }
},

async getCurrentMemberRecord() {
  try {
  const response = await BackEndCalls.getCurrentMemberRecord();
  // update pinia state
  this.member = response.data.member;
  // store user details and jwt in local storage to keep user logged in between page refreshes
  localStorage.setItem('member', JSON.stringify(this.member));
  localStorage.setItem('token', response.data.token);
  return true;
} catch (error) {
  return false; 
}
},

async resendEmail() {
  try {
  const response = await BackEndCalls.resendEmail();
  return true;
} catch (error) {
  return false;      
}
},

  async login(email, password) {
    const useStream = useStreamStore();
    try {
    const response = await BackEndCalls.postLogin(email, password);

    // update pinia state
    if(this.member && this.member.currentStreamId) {
      useStream.currentStream = this.member.currentStreamId
    }
    this.member = response.data.member;
    
    // store user details and jwt in local storage to keep user logged in between page refreshes
    localStorage.setItem('member', JSON.stringify(this.member));
    localStorage.setItem('token', response.data.token);

    // update login state
    this.loggedInUserName = this.member.userName;
    // assign menu variables for topNav
    // member menu
    if(this.member ) {
      this.showMemberMenu = true; 
    } else {
      this.showMemberMenu = false;
    }
    // moderator menu
    if(this.member && this.member.role === "moderator") {
      this.showModeratorMenu = true; 
    } else {
      this.showModeratorMenu = false;
    }
    return true;
  } catch (error) {
    return false;           
  }
},
    
  async logout() {
    const useChurch = useChurchStore();
    const useDirectMessage = useDirectMessageStore();
    const useError = useErrorStore();
    const useImage = useImageStore();
    const useMember = useMemberStore();
    const useModerator = useModeratorStore();
    const useStream = useStreamStore();

    this.member = null;
    localStorage.removeItem('member');
    localStorage.removeItem('token');
    localStorage.removeItem('church');
    this.loggedInUserName = "";
    this.showModeratorMenu = false;
    this.showMemberMenu = false;
    // reset the stores to initial state

    useChurch.$reset();
    useDirectMessage.$reset();
    useError.$reset(); 
    useImage.$reset(); 
    useMember.$reset();
    useModerator.$reset();
    useStream.$reset();      
  },
      
  async validateEmailConfirmationToken(token) {
    try {
    const response = await BackEndCalls.validateToken(token);
    
    // update pinia state
    this.member = response.data.member;
    
    // store user details and jwt in local storage to keep user logged in between page refreshes
    localStorage.setItem('member', JSON.stringify(this.member));
    localStorage.setItem('token', response.data.token);
    
    return true;  
  } catch (error) {
    return false;
  }
},

  async requestPasswordReset(email) {
    try {
    const response = await BackEndCalls.requestResetLink(email);
    return true;
  } catch (error) {
    if(error.response.data.message) {
    // ENUM: "Invalid credentials" || "Email restricted from password change" 
    this.passwordResetRequestErrorMessage = error.response.data.message; 
    }
    return false; 
  }
},

  async sendResetPassword(token, password) {
    try {
    const response = await BackEndCalls.sendResetAndToken(token, password);
    
    // update pinia state
    this.member = response.data.member;
    
    // refresh store variables used by top nav
    this.loggedInUserName = this.member.userName;
    // assign top nav menu variables
    // member menu
    if(this.member) {
    this.showMemberMenu = true; 
    } else {
      this.showMemberMenu = false; 
    }
    // moderator menu
    if(this.member && this.member.role === "moderator") {
    this.showModeratorMenu = true; 
    } else {
    this.showModeratorMenu = false; 
    }
    // store user details and jwt in local storage to keep user logged in between page refreshes
    localStorage.setItem('member', JSON.stringify(this.member));
    localStorage.setItem('token', response.data.token);
    return true;
  } catch (error) {
    return false;         
  }
},

  async changePassword(password) {
    try {
    const response = await BackEndCalls.changePassword(password);
    
    // update pinia state
    this.member = response.data.member;
    
    // store user details and jwt in local storage to keep user logged in between page refreshes
    localStorage.setItem('member', JSON.stringify(this.member));
    localStorage.setItem('token', response.data.token);
    return true;
  } catch (error) {
    return false;         
  }
},
},
});
