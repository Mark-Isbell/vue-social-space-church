import { defineStore } from "pinia";
import BackEndCalls from "../services/BackEndCalls";
import { useAuthStore } from "@/stores/auth";

export const useStreamStore = defineStore({
  id: "stream",
  state: () => ({
    streamComments: [], 
    streamHeaders: [],
    streamHeaderKeys: [],
    // control display of comment editor depending on streammember status
    displayEditor: false,
    // to create a new comment
    currentStreamComment: ``, // store the current comment NOT YET SUBMITTED by the member for each stream
    currentStreamName: "",
    currentStreamMembers: [],
    indexOfCurrentStream: 0,  // used for HEADERS 
    indexOfCurrentStreamComments: 0, // used for COMMENTS 
    // new stream creation by moderators
    newStreamType: "",
    newStreamName: "",
    newStreamDescription: "",
    priorStreamId: ""
  }),
  getters: {

  },
  actions: {

  async inflateCurrentStream(streamId) {
    // If stream exists in array, it is safe to assume it has comments and then use the first one's ID
    // then send to replace or update, because it is equally as efficient as replace

    let responseComments = null;
    if (this.streamComments.length == 0)
    {
    responseComments = await BackEndCalls.replaceComments(streamId);
    }
    else  { 
    // get index for 1) Stream Comments  and 2) Stream Headers
    const streamCommentsIndex = this.streamComments.findIndex(stream => stream.streamHeaderInfo.streamId === streamId)
    const streamHeaderIndex = this.streamHeaders.findIndex(stream => stream.streamId === streamId)

    // assign to store variables
    this.indexOfCurrentStream = streamHeaderIndex; // for components to use for headers
    this.indexOfCurrentStreamComments = streamCommentsIndex; // for components to use for comments index

    if(streamCommentsIndex > -1){
      if(this.streamComments[streamCommentsIndex].streamComments.length !== 0){
    
        const latestCommentId = this.streamComments[streamCommentsIndex].streamComments[0].commentId
        responseComments = await BackEndCalls.updateOrReplaceComments(streamId, latestCommentId)
      }
      else {
        // no comments due to a new empty stream, so call replace only
        responseComments = await BackEndCalls.replaceComments(streamId);
      }
    } 
      else {
        // no comments, so call replace only
        responseComments = await BackEndCalls.replaceComments(streamId);
      }
    }

    if(responseComments.data.updateOrReplace === "update")
    {
      // splice in results
      if(responseComments.data.comments.commentsReturnedCount > 0) {
        newArray = (responseComments.data.comments.streamComments).concat(this.streamComments[this.indexOfCurrentStream].streamComments)
        this.streamComments[this.indexOfCurrentStream].streamComments = newArray;
      }
      else {
        // do nothing because no new comments added to existing ones
      }
    }
    else {
      // "replace" the old comments with recent comments
      
      if(this.indexOfCurrentStreamComments === -1) {
        // triggered every time stream is switched by user
        this.indexOfCurrentStreamComments = this.streamComments.length; // place at end of array 
      }
      this.streamComments[this.indexOfCurrentStreamComments] = responseComments.data.comments;            
    }
},

  async getOlderComments(streamId, oldestCommentId) {
    // get next set of older comments for infinite scroll
    try {
    const response = await BackEndCalls.getOlderComments(streamId, oldestCommentId); 
     
    // find the existing streamcomments in the array of streamcomments
    const streamCommentsIndex = this.streamComments.findIndex(stream => stream.streamHeaderInfo.streamId === streamId)
    let combinedComments = this.streamComments[streamCommentsIndex].streamComments.concat(response.data.comments.streamComments)
    // replace comments with new larger array
    this.streamComments[streamCommentsIndex].streamComments = combinedComments; 
       
    return true;
  } catch(err) {
    return false;
  }
},

  async getStreamHeaders() {
    const response = await BackEndCalls.getStreamHeaders();
    this.streamHeaders = response.data.streamHeaders;
    this.streamHeaderKeys = response.data.streamHeaderKeys;
},

  storePriorStream() {
    const useAuth = useAuthStore();
    // store stream ID before main.vue attempts to update it to a new one
    this.priorStreamId = useAuth.member.currentStreamId
},

  async postComment(commentObject) {
    try{
    // post a comment via commentObject
    const comment = await BackEndCalls.postComment(commentObject);
      
    // push it onto the comment array
    this.streamComments[this.indexOfCurrentStreamComments].streamComments.unshift(comment.data.comments);
    return true;
  } catch(err) {
    return false;
  }
},

  async editComment(commentObject) {
    try {
    // edit a comment via commentObject
    const response = await BackEndCalls.editComment(commentObject);
    const updatedComment = response.data.comment;
    // precisely replace the comment contents
    // first find the comment index
    
    const commentIndex = this.findIndexOfCommentByCommentId(updatedComment.id)
    // now replace the comment content and status
    this.streamComments[this.indexOfCurrentStream].streamComments[commentIndex].comment = updatedComment.comment;
    this.streamComments[this.indexOfCurrentStream].streamComments[commentIndex].status = updatedComment.status;
    
    return true;
  } catch(err) {
    return false;
  }
},

  findIndexOfCommentByCommentId (commentId) {
    this.indexOfCurrentStreamComments = this.streamComments.findIndex(commentCollection => commentCollection.streamHeaderInfo.streamName === this.currentStreamName);

    const commentIndex = this.streamComments[this.indexOfCurrentStreamComments].streamComments.findIndex(comment => comment.commentId === commentId);
    return commentIndex;
},

  async deleteComment(commentId) {
    try {
    // delete a comment via commentId
    const response = await BackEndCalls.deleteComment(commentId);
    
    // interrogate response
    if(response.data.deleteResult !== 1){
    return false;
    } else {

    // delete the comment from the array
    // first find the comment index
    const commentIndex = this.findIndexOfCommentByCommentId(commentId)
    // now splice it out of the comments array
    this.streamComments[this.indexOfCurrentStream].streamComments.splice(commentIndex,1);
    
    return true;
    }
  } catch(err) {
    return false;
  }
},

  async updateReaction(reactionObject) {
    try {
    const result = await BackEndCalls.updateReaction(reactionObject);
    const updatedComment = result.data.comment; 
    // precisely update the comment in the comment array  
    // first find the comment index  
    
    const commentIndex = this.findIndexOfCommentByCommentId(updatedComment.id);  
    // now replace the comment content and status  
    this.streamComments[this.indexOfCurrentStream].streamComments[commentIndex].likesNumber = updatedComment.likesNumber;
    this.streamComments[this.indexOfCurrentStream].streamComments[commentIndex].praisesNumber = updatedComment.praisesNumber;
    this.streamComments[this.indexOfCurrentStream].streamComments[commentIndex].likes = updatedComment.likes;
    this.streamComments[this.indexOfCurrentStream].streamComments[commentIndex].praises = updatedComment.praises;
    
    return true;
  } catch(err) {
    return false;
  }
},

  async reportComment(reportObject) {
    try {
    const result = await BackEndCalls.reportComment(reportObject);
    return true;
  } catch(err) {
    return false;
  }
},

  async postNewStream(streamObject) {
    try {
    const stream = await BackEndCalls.postNewStream(streamObject);
    return true;
  } catch (err) {
    return false;
  }
},

  setCurrentStreamName(streamId) {
    // assume headers exist but check first
    if(this.streamHeaders.length === 0)
    { 
    currentStreamName = ""}
    else {
    const currentStreamIndex = this.streamHeaders.findIndex(header => header.streamId === streamId)
    this.currentStreamName = this.streamHeaders[currentStreamIndex].streamName;
    }
},

  async getStreamMembers(streamName) {
    // we need the stream id so get it
    const currentStreamIndex = this.streamHeaders.findIndex(header => header.streamName === streamName);  
    const currentStreamId = this.streamHeaders[currentStreamIndex].streamId;  
    // send to back end to get all stream members
    const membersResponse = await BackEndCalls.getStreamMembers(currentStreamId); 
    // alpha sort
    let resultsArray = membersResponse.data.streamMembers;
    resultsArray.sort(function(a, b) {
      return a.member.userName.localeCompare(b.member.userName);
   });
    this.currentStreamMembers = resultsArray; 
},

  getStreamId() {
    const streamIndex = this.streamHeaders.findIndex(header => header.streamName === this.currentStreamName);
    const streamId = this.streamHeaders[streamIndex].streamId;
    return streamId;
},

  getStreamIdByName(streamName) {
    const streamIndex = this.streamHeaders.findIndex(header => header.streamName === streamName);
    const streamId = this.streamHeaders[streamIndex].streamId;
    return streamId;
},

  getStreamIndexByName(streamName) {
    const streamIndex = this.streamHeaders.findIndex(header => header.streamName === streamName);
    return streamIndex;
},

  getStreamCommentsIndexByName(streamName) {
    const streamIndex = this.streamComments.findIndex(commentsCollection => commentsCollection.streamHeaderInfo.streamName === streamName);
    return streamIndex;
},
  
  getStreamName() {
    const streamIndex = this.streamHeaders.findIndex(header => header.streamId === this.priorStreamId);
    const streamName = this.streamHeaders[streamIndex].streamName;
    return streamName;
}
},
});
