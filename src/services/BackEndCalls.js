import axios from "axios";

// the apiClient below is created once for each session
// exports or interceptors are used to change requests dynamically
const apiClient = axios.create({
  // baseURL: `https://api.vue-social-space-church.org/api/v1`,
  baseURL: `http://localhost:5000/api/v1`,
  withCredentials: true, // 'true' will atuomatically include httponly cookie and 'false' will not
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: "Bearer " + localStorage.getItem("token"),
  },
  timeout: 10000,
});

// add the current token from local storage
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    config.headers["Authorization"] = "Bearer " + token;
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

export default {

  // Authentication calls

  postLogin(email, password) {
    return apiClient.post("/auth/login", {email: email, password: password});
  },

  postRegistration(username, email, password, role) {
    return apiClient.post("/auth/register", {username: username, email: email, password: password, role: role});
  },

  resendEmail() {
    return apiClient.get("/auth/resend");
  },

  changePassword(password) {
    return apiClient.put("/auth/changepassword", {newPassword: password});
  },
 
  validateToken(token) {
    return apiClient.get("/auth/confirmemail/?token=" + token
    );
  },

  getCurrentMemberRecord() {
    return apiClient.get("/auth/getcurrentmember");
  },

  requestResetLink(email) {
    return apiClient.post("/auth/forgotpassword", {email: email})
  },

  sendResetAndToken(token, password) {
    return apiClient.post("/auth/resetpassword", {
      password: password,
      token: token
    })
  },

  // Member calls

  postMemberPhoto(base64StringImage) {
    const myurl = "/member/profilepic"
    return apiClient.post(myurl, {profilePic: base64StringImage});
  },

  updateIntroduction(introduction){
    return apiClient.put(("/member/introduction"), {
      introduction: introduction
    });
  },

  updateAccount(accountObject){
    return apiClient.put(("/member/account"), {
      userName: accountObject.userName,
      email: accountObject.email
    });
  },

  getMemberFacts(){
    return apiClient.get("/member/fact/");
  },

  editMemberFact(factObject){
    return apiClient.put(("/member/fact"), factObject);
  },

  deleteMemberFact(factId){
    return apiClient.delete(("/member/fact/" + factId));
  },

  createMemberFact(factObject){
    return apiClient.post(("/member/fact"), factObject);
  },

  // church calls

  updateChurchForMember(inviteCode){
    return apiClient.put(("/member/church"), {
      inviteCode: inviteCode
    });
  },

  updateChurch(churchObject){
    return apiClient.put(("/church/update"), churchObject); 
  },

  generateNewInvitationCode() {
    return apiClient.get("/church/generatenewinvitecode"); 
  },

  updateModerationPolicy(moderationPolicyObject){
    return apiClient.put(("/church/updatemoderationpolicy"), moderationPolicyObject); 
  },

  getChurch(){
    return apiClient.get("/church/member");
  },

  getChurchMembers(limit, offset){
    return apiClient.get("/church/members/" + limit + "/" + offset);
  },

  getChurchMember(memberId){
    return apiClient.get("/church/member/" + memberId);
  },

  getChurchMemberByName(userName){
    return apiClient.get("/church/member/name/" + userName);
  },

  getChurchNameByInviteCode(inviteCode){
    return apiClient.get("/church/invitecode/" + inviteCode);
  },

  getChurchLinks(){
    return apiClient.get("/church/link");
  },

  editChurchLink(linkObject){
    return apiClient.put(("/church/link/update"), linkObject);
  },

  deleteChurchLink(linkId){
    return apiClient.delete(("/church/link/" + linkId));
  },

  createChurchLink(linkObject){
    return apiClient.post(("/church/link"), linkObject);
  },

  getEvent(eventId){
    return apiClient.get("/church/event/" + eventId);
  },

  getEvents(searchRangeObject){
    return apiClient.get("/church/events/" + searchRangeObject.beginMonth + "/" + searchRangeObject.beginDay + "/" + searchRangeObject.beginYear + "/" + searchRangeObject.endMonth + "/" + searchRangeObject.endDay + "/" + searchRangeObject.endYear);
  },

  editEvent(eventObject){
    return apiClient.put(("/church/event/update"), eventObject);
  },

  deleteEvent(eventId){
    return apiClient.delete(("/church/event/" + eventId));
  },

  createEvent(eventObject){
    return apiClient.post(("/church/event"), eventObject);
  },

  getChurchFacts(churchId){
    return apiClient.get("/church/fact/" + churchId);
  },

  createChurchFact(factObject){
    return apiClient.post(("/church/fact"), factObject);
  },

  editChurchFact(factObject){
    return apiClient.put(("/church/fact"), factObject);
  },

  deleteChurchFact(factId){
    return apiClient.delete(("/church/fact/" + factId));
  },

  // stream calls

  updateMemberStream(streamId){
    return apiClient.put(("/member/stream"), {
      streamId: streamId 
    });
  },

  joinStream(streamId){
    return apiClient.post(("/member/joinstream"), {
      streamId: streamId 
    });
  },

  requestToJoinStream(requestObject){
    return apiClient.post(("/stream/request"), requestObject);
  },

  getExistingStreamRequests(streamId) {
    return apiClient.get(("/stream/requests/" + streamId));
  },
  
  replaceComments(streamId){
    return apiClient.get("/stream/" + streamId + "/replace");
  },
  
  updateOrReplaceComments(streamId, latestCommentId){
    return apiClient.get("/stream/" + streamId + "/updateorreplace/" + latestCommentId);
  },

  getOlderComments(streamId, oldestCommentId){
    return apiClient.get("/stream/" + streamId + "/" +oldestCommentId + "/older");
  },

  getStreamMembers(streamId){
    return apiClient.get("/stream/" + streamId + "/members");
  },

  getStreamInformation(streamId) {
    return apiClient.get("/stream/information/" + streamId);
  },

  getMemberStreamList(userName) {
    return apiClient.get("/stream/streams/member/" + userName);
  },

  postComment(commentObject){
    return apiClient.post("/stream/comment", commentObject);
  },

  editComment(commentObject){
    return apiClient.put("/stream/comment", commentObject);
  },

  deleteComment(commentId){
    return apiClient.delete("/stream/comment/" + commentId);
  },

  updateReaction(reactionObject){
    return apiClient.put("/stream/comment/reaction", reactionObject);
  },

  reportComment(reportObject){
    return apiClient.post("/moderator/reportcomment", reportObject);
  },

  postNewStream(streamObject){
    return apiClient.post("/stream/create", streamObject);
  },

  updateStream(streamObject) {
    return apiClient.put("/stream/update", streamObject);
  },
  
  getStreamHeaders() {
    return apiClient.get("/stream/headers");
  }, 

  getStreamMembers(currentStreamId) {
    return apiClient.get("/stream/" + currentStreamId + "/members");
  },

  // moderator calls

  getPendingAccessRequests(){
    return apiClient.get("/moderator/getpendingrequests");
  },

  getReports(){    
    return apiClient.get("/moderator/reports");
  },

  complete(completeObject) {
    return apiClient.put("/moderator/complete", completeObject);
  },

  deleteMemberComment(commentId) {
    return apiClient.delete("/moderator/deletecomment/" + commentId);
  },

  restrictOne(restrictObject) {
    return apiClient.put("/moderator/restrictone", restrictObject);
  },

  restrictAll(restrictObject) {
    return apiClient.put("/moderator/restrictall", restrictObject);
  },

  removeFromChurch(removeObject) {
    return apiClient.put("/moderator/removefromchurch", removeObject);
  },

  undoChurchRestriction(undoObject) {
    return apiClient.put("/moderator/unrestrictchurchjoin", undoObject);
  },

  unrestrict(unrestrictObject) {
    return apiClient.put("/moderator/unrestrict", unrestrictObject);
  },

  updateAccessRequest(updatedRequestObject){
    return apiClient.put("/moderator/updaterequest", updatedRequestObject);
  },

  getMemberRestrictions(userName){
    return apiClient.get("/moderator/getallrestrictions/" + userName);
  },

  promoteModerator(promotionObject){
    return apiClient.put("/moderator/promote", promotionObject);
  },

  addToStream(streamObject){
    return apiClient.put(("/moderator/addtostream"), streamObject);
  },

  // direct messages calls
  
  createDirectMessage(directMessageObject){
    return apiClient.post("/directmessage/createdirectmessage", directMessageObject);
  },

  createDirectMessageComment(directMessageCommentObject){
    return apiClient.post("/directmessage/createdmcomment", directMessageCommentObject);
  },

  addMemberToDirectMessage(directMessageMemberObject){
    return apiClient.post("/directmessage/addmember", directMessageMemberObject);
  },

  getDirectMessageHeaders() {
    return apiClient.get("/directmessage/getdirectmessageheaders");
  }, 

  getDirectMessageComments(directMessageId) {
    return apiClient.get("/directmessage/getdirectmessagecomments/" + directMessageId);
  },

  getOlderDirectMessageComments(directMessageId, oldestCommentId) {
    return apiClient.get("/directmessage/" + directMessageId + "/" + oldestCommentId + "/older");
  },

  updateMemberWithCurrentDirectMessageId(directMessageId) {
    return apiClient.put("/directmessage/updatemember/" + directMessageId);
  },
};
