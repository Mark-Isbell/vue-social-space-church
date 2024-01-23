import { defineStore } from "pinia";
import BackEndCalls from "../services/BackEndCalls";
import { useAuthStore } from "@/stores/auth";
import { useStreamStore } from "@/stores/stream";

export const useMemberStore = defineStore({
  id: "member",
  state: () => ({
    // new church
    inviteCode: "",
    // new stream join requests
    existingStreamRequests: [],
    requestJoinMessage: "",
    // member facts
    memberFacts: [],
    // new member fact
    newFactDescription: "",
    newFactValue: "",
    // updating member intro
    memberIntroduction: "",
    updateIntroductionValidationMessages: [],
  }),
  getters: {

  },
  actions: {

  async updateMemberChurch(inviteCode) {

    // this api called when member enters invitation code
    const useAuth = useAuthStore(); 
    
    try {
    const response = await BackEndCalls.updateChurchForMember(inviteCode);
    
    // update pinia state
    useAuth.member = response.data.member;

    // store user details and jwt in local storage to keep user logged in between page refreshes
    localStorage.setItem('member', JSON.stringify(useAuth.member));

    return true;
  } catch (error) {
    return false;          
  }
},

  async uploadPhoto(base64StringImage) {
    const useAuth = useAuthStore();
    try {            
    const response = await BackEndCalls.postMemberPhoto(base64StringImage);
    
    // update pinia state
    useAuth.member = response.data.data;

    // store user details and jwt in local storage to keep user logged in between page refreshes
    localStorage.setItem('member', JSON.stringify(useAuth.member));
  } catch (error) {
    // no action           
  }
},

  async updateIntroduction(introduction) {
    const useAuth = useAuthStore();
    try {
    const response = await BackEndCalls.updateIntroduction(introduction);
    
    // update pinia state
    useAuth.member = response.data.data;

    // store user details and jwt in local storage to keep user logged in between page refreshes
    localStorage.setItem('member', JSON.stringify(useAuth.member));
    return true;

  } catch (error) {
    return false;          
  }
},

  async updateAccount(accountObject) {
    const useAuth = useAuthStore();
    try {        
    const response = await BackEndCalls.updateAccount(accountObject);

    // update pinia state
    useAuth.member = response.data.data;

    // store user details and jwt in local storage to keep user logged in between page refreshes
    localStorage.setItem('member', JSON.stringify(useAuth.member));
    return true;
  } catch (error) {
    return false;          
  }
},

  async updateMemberStream() {
    const useStream = useStreamStore();
    const useAuth = useAuthStore();
    const newStreamIndex = useStream.streamHeaders.findIndex(header => header.streamName === useStream.currentStreamName)
    const newStreamId = useStream.streamHeaders[newStreamIndex].streamId
    try {
    const response = await BackEndCalls.updateMemberStream(newStreamId);

    // update member
    useAuth.member = response.data.data;

    // store user details and jwt in local storage to keep user logged in between page refreshes
    localStorage.setItem('member', JSON.stringify(useAuth.member));
  } catch (error) {
    // no action            
  }
},

  async joinStream(streamId) {
    const useStream = useStreamStore();
    const useAuth = useAuthStore();
    try {
    const response = await BackEndCalls.joinStream(streamId);
    
    // update member
    useAuth.member = response.data.member;

    // update streamHeaderKeys
    useStream.streamHeaderKeys.push(response.data.streamHeaderKey)

    // store user details and jwt in local storage to keep user logged in between page refreshes
    localStorage.setItem('member', JSON.stringify(useAuth.member));
    return true;
  } catch (error) {
    return false;        
  }
},

  async requestToJoinStream(streamId) {
    try {
    // requestJoinMessage
    const streamJoinRequest = { 
    message: this.requestJoinMessage, 
    KeyFieldStreamId: streamId
    }
    const response = await BackEndCalls.requestToJoinStream(streamJoinRequest);
    return true;
  } catch (error) {
    return false;        
  }
},

  async getExistingStreamRequests(streamId) {
    try {
    const response = await BackEndCalls.getExistingStreamRequests(streamId);
    this.existingStreamRequests = response.data.streamRequests
    
    return true;
  } catch (error) {
    return false;        
  }
},

  async getMemberFacts() {
    try {
    const response = await BackEndCalls.getMemberFacts();

    // assign member facts
    this.memberFacts = response.data.facts;

    return true;
  } catch (error) {
    return false;         
  }
},

  async editMemberFact(factObject) {
    try {
    const response = await BackEndCalls.editMemberFact(factObject);

    // update member fact
    // first find index
    const factIndex = this.memberFacts.findIndex(fact => fact.id === response.data.updatedFact.id)
    this.memberFacts[factIndex].description = response.data.updatedFact.description;
    this.memberFacts[factIndex].fact = response.data.updatedFact.fact;
      
    return true;
  } catch (error) {
    return false;         
  }
},

  async deleteMemberFact(factId) {
    try {
    const response = await BackEndCalls.deleteMemberFact(factId);

    if(response.data.deleteResult !== 1){
    return false;
    } else {
    // update member facts
    // first find index
    const factIndex = this.memberFacts.findIndex(fact => fact.id === factId)
    this.memberFacts.splice(factIndex, 1); // remove fact from array
    
    return true;
  }
  } catch (error) {
    return false;         
  }
},

  async createMemberFact(factObject) {
    try {
    const response = await BackEndCalls.createMemberFact(factObject);

    // update member facts array
    this.memberFacts.push(response.data.fact); 
    
    return true;
  } catch (error) {
    return false;         
  }
},
},
});
