import { defineStore } from "pinia";
import router from "@/router";

export const useErrorStore = defineStore({
  id: "error",
  state: () => ({
    customError: "front end error", // replace the default value
    customErrors: []
  }),
  getters: {

  },
  actions: {
  
  logError (errorString) {
    this.customError = errorString;
    this.customErrors.push(errorString); 
    router.push('errorpage')
    },
  },
});
