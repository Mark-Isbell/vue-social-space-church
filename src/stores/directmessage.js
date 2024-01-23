import { defineStore } from "pinia";
import BackEndCalls from "../services/BackEndCalls";
import { useAuthStore } from "@/stores/auth";

export const useDirectMessageStore = defineStore({
  id: "directmessage",
  state: () => ({
    // all direct message header info
    directMessageHeaders: [],

    // selected Direct Message name
    selectedDirectMessageName: "",

    // current direct message
    currentDirectMessage: {},
    currentDirectMessageMembers: [],
    currentDirectMessageComments: [], 
    currentDirectMessageConstructedComments: [],
    
    // current comment
    currentDirectMessageComment: ""
  }),
  getters: {

  },
  actions: {

  async getDirectMessageComments(directMessageId) {
    try {    
    const response = await BackEndCalls.getDirectMessageComments(directMessageId);
    
    // store the raw array of comments
    this.currentDirectMessageComments = response.data.directMessageComments.reverse();

    // construct formatted array of comments for display
    let newConstructedComments = this.buildConstructedComments(this.currentDirectMessageComments);  
    this.currentDirectMessageConstructedComments = newConstructedComments; 
    return true;
  } catch (error) {
    return false;        
  }
},

  async getOlderDirectMessageComments(directMessageId, oldestCommentId) {
    // get next set of older comments for infinite scroll
    try {
    const response = await BackEndCalls.getOlderDirectMessageComments(directMessageId, oldestCommentId); 

    // add the older comments to the array of raw data
    this.currentDirectMessageComments = response.data.directMessageComments.reverse().concat(this.currentDirectMessageComments); 

    // add the older comments to the formatted array for display
    let newConstructedComments = this.buildConstructedComments(response.data.directMessageComments);  
    this.currentDirectMessageConstructedComments = newConstructedComments.concat(this.currentDirectMessageConstructedComments);
          
    return true;
  } catch(err) {
    return false;
  }
},

  buildConstructedComments(arrayOfRawComments) {
    // returns an array of constructed direct message comments
    let constructedArray = [];
    for(let i = 0;i<arrayOfRawComments.length;i++) {
    let constructedComment = {};
    constructedComment.comment = "" + arrayOfRawComments[i].directMessageMember.member.userName +
    ":  " + arrayOfRawComments[i].comment 
    constructedArray.push(constructedComment); 
    }
    return constructedArray
  },

  async getDirectMessageHeaders() { 
    try {    
    const response = await BackEndCalls.getDirectMessageHeaders();
    this.directMessageHeaders = response.data.directMessageHeaders;
    return true;
  } catch (error) {
  return false;        
  }
},

  async createDirectMessage(directMessageObject) {
    try {    
    const response = await BackEndCalls.createDirectMessage(directMessageObject);
    
    this.currentDirectMessage = response.data.directMessage;
    this.currentDirectMessageMembers.push(response.data.directMessageMember1);
    this.currentDirectMessageMembers.push(response.data.directMessageMember2);
    this.selectedDirectMessageName = this.currentDirectMessage.participantString;

    return true;
  } catch (error) {
    return false;        
  }
},

  async createDirectMessageComment(directMessageCommentObject) {     
    try {    
    const response = await BackEndCalls.createDirectMessageComment(directMessageCommentObject);
    this.currentDirectMessageComments.push(response.data.comment)

    // add the new comment to the formatted array for display
    let arrayOfOne = []
    arrayOfOne.push(response.data.comment);
    let newConstructedComment = this.buildConstructedComments(arrayOfOne);  
    this.currentDirectMessageConstructedComments = this.currentDirectMessageConstructedComments.concat(newConstructedComment);

    return true;
  } catch (error) {
    return false;        
  }
},

  async addMemberToDirectMessage(directMessageMemberObject) {
    try {    
    const response = await BackEndCalls.addMemberToDirectMessage(directMessageMemberObject);          
    this.currentDirectMessageMembers.push(response.data.newDirectMessageMember);

    // now update the specific direct message header with new participant String 
    const dmHeaderIndex = this.directMessageHeaders.findIndex(header => header.directMessageId === response.data.updatedDirectMessage.id);
    this.directMessageHeaders[dmHeaderIndex].participantString = response.data.updatedDirectMessage.participantString;
    this.selectedDirectMessageName = this.directMessageHeaders[dmHeaderIndex].participantString;

    // add system message alert to comment arrays
    this.currentDirectMessageComments.unshift(response.data.comment)
    
    // add the new comment to the formatted array for display
    let arrayOfOne = []
    arrayOfOne.push(response.data.comment);
    let newConstructedComment = this.buildConstructedComments(arrayOfOne);  
    this.currentDirectMessageConstructedComments = this.currentDirectMessageConstructedComments.concat(newConstructedComment);

    return true;
  } catch (error) {
    return false;        
  }
},

  async updateMemberWithCurrentDirectMessageId(directMessageId) {
    const useAuth = useAuthStore();
    try {    
    const response = await BackEndCalls.updateMemberWithCurrentDirectMessageId(directMessageId);

    // update member
    useAuth.member = response.data.member;

    // store user details and jwt in local storage to keep user logged in between page refreshes
    localStorage.setItem('member', JSON.stringify(useAuth.member));

    return true;
  } catch (error) {
    return false;        
  }
},
},
});
