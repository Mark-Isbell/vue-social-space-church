import { defineStore } from "pinia";
import BackEndCalls from "../services/BackEndCalls";
import { useAuthStore } from "@/stores/auth";

export const useChurchStore = defineStore({
  id: "church",
  state: () => ({
    // initialize state from local storage
    // redundant load placed in App.vue.
    church: JSON.parse(localStorage.getItem('church')), 

    // member church linking
    newChurchInviteCode: "",
    newChurchName: "",
    // church information for member
    allChurchMembers: [],
    // church member profile to view
    // stored locally to survive browser refresh
    profileOfChurchMember: JSON.parse(localStorage.getItem('profileofchurchmember')), // try to grab it from localstoreage
    profileOfChurchMemberFacts: [],
    // update church fields - moderator only
    updateName: "",
    updateCountry: "",
    updateStreet1: "",
    updateStreet2: "",
    updateCity: "",
    updateState: "",
    updateZip: "",
    updateIntStateProvinceRegion: "",
    updateIntZipPostal: "",
    updateIsInternational: false,
    // updating moderation policy
    updateModerationPolicy: "",
    updateModerationValidationMessages: [],
    // church links
    churchLinks: [],
    // new church link
    newLinkDescription: "",
    newLinkValue: "",
    // church facts
    churchFacts: [],
    // new church fact
    newFactDescription: "",
    newFactValue: "",
    // member search by name result for Direct Messages
    memberSearchUserName: "",
    memberSearchReturnedId: "",
    memberSearchReturnedName: "",
    // church calendar scroll control
    scrollMonth: 0,
    scrollYear: 0,
    // church calendar 
    year: 0,
    monthNumber: 0,
    monthName: "",
    week: 0,
    dayNumberOfMonth: 0,
    calendarTiles: [], // each array member is an object:
    /*
    {
      tileNumber: integer,   // position 1-42 in the table: 6 rows of 7 possible days. 
      blankOrUsed: String,   // "blank" or "used" there WILL be blank tiles in first and last rows.
      dayNumber: integer,    // Can be any integer 1-31 
      dayName: String,       // "Monday", "Tuesday", etc...
      rawDate: Date,         // date time stamp assigned to the tile
      events: []             // collection of events that overlap or exist on this date/tile
                             // NOTE: one event could repeat in multiple tiles depending on begin - end range
    }
    */
    firstUsedTileIndex: 0,  // used to simplify looping
    lastUsedTileIndex: 0,   // used to simplifiy looping
    events: [], // contains all events for month 
    event: {},
    // looping variables for initilizing calendar tiles
    incrementedDayOfMonth: null,
    incrementedDate: null,
    lastDayNumberOfMonth: 0
  }),
  getters: {

  },
  actions: {

  async getChurchFacts(churchId) {
    try {
    const response = await BackEndCalls.getChurchFacts(churchId);

    // assign church facts
    this.churchFacts = response.data.facts;
    return true;
  } catch (error) {
    return false;         
  }
},
    
  async editChurchFact(factObject) {
    try {
    const response = await BackEndCalls.editChurchFact(factObject);

    // update church fact
    // first find index
    const factIndex = this.churchFacts.findIndex(fact => fact.id === response.data.updatedFact.id);
    this.churchFacts[factIndex].description = response.data.updatedFact.description;
    this.churchFacts[factIndex].fact = response.data.updatedFact.fact;
    return true;
  } catch (error) {
    return false;         
  }
},
    
  async deleteChurchFact(factId) {
    try {
    const response = await BackEndCalls.deleteChurchFact(factId);
    if(response.data.deleteResult !== 1){
      return false;
    } else {
    // update church facts
    // first find index
    const factIndex = this.churchFacts.findIndex(fact => fact.id === factId)
    this.churchFacts.splice(factIndex, 1); // remove fact from array
    return true;
    }
  } catch (error) {
    return false; 
  }
},
    
  async createChurchFact(factObject) {
    try {
    const response = await BackEndCalls.createChurchFact(factObject);
    // update church facts array
    this.churchFacts.push(response.data.fact); 
    return true;
  } catch (error) {
        return false;
  }
},

async generateNewInvitationCode(){
  try {
  const response = await BackEndCalls.generateNewInvitationCode();

  // assign church
  this.church = response.data.church;

  // set local storage
  localStorage.setItem('church', JSON.stringify(this.church));

  return true;
} catch (error) {
  return false; 
}
},

  async updateChurchModerationPolicy(policyObject){
    try {
    const response = await BackEndCalls.updateModerationPolicy(policyObject);

    // assign church
    this.church = response.data.church;

    // set local storage
    localStorage.setItem('church', JSON.stringify(this.church));

    return true;
  } catch (error) {
    return false; 
  }
},

  async getEvent(eventId){
    try {
    const response = await BackEndCalls.getEvent(eventId);
    this.event = response.data.event;
    return true;
  } catch (error) {
    return false; 
  }
},

  async getEvents(searchRangeObject){
    try {
    const response = await BackEndCalls.getEvents(searchRangeObject);
    this.events = response.data.events;
    return true;
  } catch (error) {
    return false; 
  }
},

  async editEvent(eventObject){
    try {
    const response = await BackEndCalls.editEvent(eventObject);
    this.event = response.data.updatedEvent;
    return true;
  } catch (error) {
    return false; 
  }
},

  async deleteEvent(eventId){
    try {
    const response = await BackEndCalls.deleteEvent(eventId);
    // interrogate response
    if(response.data.deleteResult !== 1){
      return false;
    } else {
    // reset local event since it contained the event being deleted
    this.event = {}; 
    return true;
    }
  } catch (error) {
        return false; 
  }
},

  async createEvent(eventObject){
    try {
    const response = await BackEndCalls.createEvent(eventObject);
    // place in event variable
    this.event = response.data.event;
    return true;
  } catch (error) {
      return false; 
  }
},

  async getChurchMemberByName(userName) {
    try {
    let trimmed = this.memberSearchUserName.trimLeft().trimRight();
    const response = await BackEndCalls.getChurchMemberByName(trimmed);

    if(response.data.churchMember === null) {
      this.memberSearchReturnedName = "No results"
      return false;
    }
    else {
      this.memberSearchReturnedName = response.data.churchMember.userName;
      this.memberSearchReturnedId = response.data.churchMember.id;
    }
    return true;
  } catch (error) {
    return false;          
  }
},

  async getChurchMember(memberId) {
    try {
    const response = await BackEndCalls.getChurchMember(memberId);
    this.profileOfChurchMember = response.data.churchMember;
    this.profileOfChurchMemberFacts = response.data.churchMemberFacts;

    // set local storage
    localStorage.setItem('profileofchurchmember', JSON.stringify(response.data.churchMember));
    return true;
  } catch (error) {
    return false;          
  }
},

  async getChurch() {
    try {
    const response = await BackEndCalls.getChurch();

    // assign church
    this.church = response.data.church;

    // set local storage
    localStorage.setItem('church', JSON.stringify(this.church));
    return true; 
  } catch (error) {
    return false;
  }
},

  async getChurchMembers(limit, offset) {
    try {
    const response = await BackEndCalls.getChurchMembers(limit, offset);
    if (offset > 0) {
    let combinedMemberList = this.allChurchMembers.concat(response.data.churchMembers) ; 
    this.allChurchMembers = combinedMemberList; 
  } else {
    this.allChurchMembers = response.data.churchMembers;
  }
    return true; 
    } catch (error) {
      return false;           
    }
},

  async getChurchNameByInviteCode(inviteCode) {
    try {
    const response = await BackEndCalls.getChurchNameByInviteCode(inviteCode);

    // assign church
    this.newChurchName = response.data.churchName.name;
    
  } catch (error) {
    // error in call to get church name by invite code            
    }
    if (this.newChurchName) {
    return true;
    } else {return false;}
},

  async updateChurch(churchObject) {
    try {
    const response = await BackEndCalls.updateChurch(churchObject);

    // assign church
    this.church = response.data.church;

    // set local storage
    localStorage.setItem('church', JSON.stringify(this.church));
    return true;
  } catch (error) {
    return false;         
  }
},

  async getChurchLinks() {
    try {
    const response = await BackEndCalls.getChurchLinks();

    // assign church links
    this.churchLinks = response.data.links;

    return true;
            
  } catch (error) {
    return false;         
  }
},

  async editChurchLink(linkObject) {
    try {
    const response = await BackEndCalls.editChurchLink(linkObject);

    // update church link
    // first find index
    const linkIndex = this.churchLinks.findIndex(link => link.id === response.data.updatedLink.id)
    this.churchLinks[linkIndex].description = response.data.updatedLink.description;
    this.churchLinks[linkIndex].link = response.data.updatedLink.link;      
    return true;
  } catch (error) {
    return false;         
  }
},

  async deleteChurchLink(linkId) {
    try {
    const response = await BackEndCalls.deleteChurchLink(linkId);

    // interrotage response
    if(response.data.deleteResult !== 1){
      return false;
    } else {
    // update church links
    // first find index
    const linkIndex = this.churchLinks.findIndex(link => link.id === linkId);
    this.churchLinks.splice(linkIndex, 1); // remove link from array
    return true;
  }
  
  } catch (error) {
        return false;         
  }
},

  async createChurchLink(linkObject) {
    try {
    const response = await BackEndCalls.createChurchLink(linkObject);
  
    // update church links array
    this.churchLinks.push(response.data.link); 
    return true;
    
  } catch (error) {
        return false;         
  }
},
},
});