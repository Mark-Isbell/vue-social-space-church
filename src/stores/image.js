import { defineStore } from "pinia";

export const useImageStore = defineStore({
  id: "auth",
  state: () => ({
    actualImageFile: null,
    previewImageBase64: null, // set by MyCustomInput
    imageSize: null
  }),
});

