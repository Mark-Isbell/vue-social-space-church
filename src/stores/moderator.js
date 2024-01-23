import { defineStore } from "pinia";
import BackEndCalls from "../services/BackEndCalls";

export const useModeratorStore = defineStore({
  id: "moderator",
  state: () => ({
    // moderation
    reports: [],
    reportForReview: {},
    reportStream: {}, // the stream related to the report 
    reportActionChoice: "",
    reportActionOptions: ["Ignore report", "Delete post and ..."],
    reportActionReason: "",
    restrictionChoice: "",
    restrictionOptions: ["No Restriction on Member","Restrict Member From Posting In Stream", "Restrict Member From Posting In All Their Streams", "Remove Memeber From Church"],
    // Review Member Restriction
    restrictionSearchName: "", // member userName to search for all restrictions
    allMemberRestrictions: {},
    restrictionSearchStatus: "",
    restrictionMemberId: 0,
    restrictionUserName: "",
    restrictionRole: "",
    restrictionGlobal: "",
    restrictionChurchLevel: "",
    showOptionToRemoveChurchLevelRestriction: false,
    restrictionNumberOfStreamRestrictions: 0,
    restrictionStreamLevel: [],
    // access requests to streams
    accessRequests: [],
    accessRequestSort: ["recent","oldest","stream"],
    currentAccessRequestSort: "oldest",
    accessDecisionOptions: ["approved","denied"],
    // stream update
    updatableStreamNames: [], 
    updateStatusChoices: ["active","inactive"],
    updateStreamName: "",
    updateStreamId: "",
    updateStreamStatus: "",
    updateStreamDescription: "",
    // moderator promotion
    newModeratorSearchUserName: "",
    newModeratorSearchReturnedId: "",
    newModeratorSearchReturnedRole: "",
    newModeratorSearchReturnedName: "",
    newModerator: {},
    // add member to stream state
    addToStreamNames: [], 
    addToStatus: "",
    addToStreamName: "",
    addToStreamId: "",
    addToStreamStatus: "",
    addToStreamDescription: "",
    // manual add member to stream
    addMemberSearchUserName: "",
    addMemberStreamList: [],
    addMemberSearchReturnedId: "",
    addMemberSearchReturnedRole: "",
    addMemberSearchReturnedName: "",
    addMember: {}, 
    // church calendar 
    year: 0,
    monthNumber: 0,
    monthName: "",
    week: 0,
    dayNumberOfMonth: 0,
    calendarTiles: [] // each array member is an object:
    /*
    {
      tileNumber: integer,
      blankOrUsed: String, 
      dayNumber: integer,
      dayName: String,
      rawDate: Date,
      events: []
    }
    */
  }),
  getters: {

  },
  actions: {

  async getStreamInformation(streamId) {
    try {
    const response = await BackEndCalls.getStreamInformation(streamId);
    this.reportStream = response.data.streamInformation;

    return true;
  } catch (error) {
      return false;          
  }
},
    
  async undoChurchRestriction(undoObject) {
    // used to allow a member to join a church once again after being removed
      
    try {
    const response = await BackEndCalls.undoChurchRestriction(undoObject);

    // Interrogate response
    if(response.data.deleteResult !== 1){
      return false;
    } else {
      return true;
    }
  }   catch (error) {
      return false;          
  }
},

  async  unrestrict(unrestrictObject) { 
    try {
    const response = await BackEndCalls.unrestrict(unrestrictObject);

    return true;
  } catch (error) {
    return false;          
  }
},

  async  getMemberRestrictions(userName){
    try {
    const response = await BackEndCalls.getMemberRestrictions(userName);      
    this.allMemberRestrictions = response.data.restrictionObject;

    // assign result to variables:
    this.restrictionSearchStatus = response.data.restrictionObject.searchStatus;
    this.restrictionMemberId = response.data.restrictionObject.memberSearchResult.id;
    this.restrictionUserName = response.data.restrictionObject.memberSearchResult.userName;
    this.restrictionRole = response.data.restrictionObject.memberSearchResult.role;
    this.restrictionChurchLevel = response.data.restrictionObject.churchLevelRestriction;
    
    if (this.restrictionChurchLevel !== "None") {
    this.showOptionToRemoveChurchLevelRestriction = true;
    } else {
    this.showOptionToRemoveChurchLevelRestriction = false;
    }
    this.restrictionNumberOfStreamRestrictions = response.data.restrictionObject.numberOfStreamRestrictions;
    this.restrictionStreamLevel = response.data.restrictionObject.streamRestrictions;
    
    return true;
  } catch (error) {
    return false;          
  }
},

  async deleteMemberComment(commentId) {
    try {
    const response = await BackEndCalls.deleteMemberComment(commentId);

    if(response.data.deleteResult === 1) {return true;}
    else return false;
  } catch (error) {
    return false;          
  }
},

  async complete(completeObject) {
    try {
    const response = await BackEndCalls.complete(completeObject);
    this.reportForReview = response.data.moderatorMessage; 

    return true;
  } catch (error) {
    return false;          
  }
}, 

  async restrictOne(restrictObject) {
    try {
    const response = await BackEndCalls.restrictOne(restrictObject);
    return true;
  } catch (error) {
    return false;          
  }
},

  async restrictAll(restrictObject) {
    try {
    const response = await BackEndCalls.restrictAll(restrictObject);

    return true;
  } catch (error) {
    return false;          
  }
},

  async removeFromChurch(removeObject) {
    try {
    const response = await BackEndCalls.removeFromChurch(removeObject);
    return true;
  } catch (error) {
    return false;          
  }
},

  async addToStream(streamObject) {
    try {
    const response = await BackEndCalls.addToStream(streamObject);
  
    return true;
  } catch (error) {     
    return false;          
  }
},

  async getNewStreamMemberByName() {
    // this method used by AddToStream.vue when moderators add member to a stream manually
      
    try {
    let trimmed = this.addMemberSearchUserName.trimLeft().trimRight();  
    const response = await BackEndCalls.getMemberStreamList(trimmed);
    
    if(response.data.streamMemberRecords === null) {
    this.addMemberSearchReturnedName = "No results"
    return false;
    }
    else {
    this.addMemberStreamList = response.data.streamMemberRecords;
    this.addMemberSearchReturnedName = response.data.streamMemberRecords[0].member.userName;
    this.addMemberSearchReturnedRole = response.data.streamMemberRecords[0].member.role;
    this.addMemberSearchReturnedId = response.data.streamMemberRecords[0].member.memberId;
    }
    return true;
  } catch (error) {        
    return false;          
  }
},

  async getChurchMemberByName() {
    // This method is used solely for promoting users to moderators

    try {
    let trimmed = this.newModeratorSearchUserName.trimLeft().trimRight();      
    const response = await BackEndCalls.getChurchMemberByName(trimmed);

    if(response.data.churchMember === null) {
    this.newModeratorSearchReturnedName = "No results"
      
    return false;
    }
    else {
    this.newModeratorSearchReturnedName = response.data.churchMember.userName;
    this.newModeratorSearchReturnedRole = response.data.churchMember.role;
    this.newModeratorSearchReturnedId = response.data.churchMember.id;
    }

    return true;
  } catch (error) {
    return false;          
  }
},

  async promoteModerator(promotionObject) {
    try {
    const result = await BackEndCalls.promoteModerator(promotionObject);
    this.newModerator =  result.data.member;

    return true;
  } catch (error) {
    return false;        
  }
},
  
  async getPendingAccessRequests() {
    try {
    const pendingAccessRequests = await BackEndCalls.getPendingAccessRequests();
    this.accessRequests = pendingAccessRequests.data.requests;

    return true;
  } catch (error) {

    return false;        
  }
},
        
  async getReports() {      
    try {
    const pendingReports = await BackEndCalls.getReports();
    this.reports = pendingReports.data.reports;

    return true;
  } catch (error) {
    return false;        
  }
},

  async updateRequest(updatedRequestObject) {
    try {
    const updatedRequest = await BackEndCalls.updateAccessRequest(updatedRequestObject);

    // once you know it's updated then remove it from the pending list in store
    const currentIndexOfUpdatedRequest = this.accessRequests.findIndex(request => request.moderatorMessageId === updatedRequestObject.moderatorMessageId);
    this.accessRequests.splice(currentIndexOfUpdatedRequest, 1); // remove the updated request from array

    return true;
  } catch (error) {  
    return false;        
  }
},

  async updateStream(streamObject) {
    try {
    const stream = await BackEndCalls.updateStream(streamObject);
    return true;
  } catch (err) {
    return false;
  }
},

},
});
