import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import VueObserveVisibility from 'vue-observe-visibility';

const app = createApp(App);

app.component('Datepicker', Datepicker);

import "bootswatch/dist/cerulean/bootstrap.min.css";
import "bootstrap"

app.use(createPinia());
app.use(router);
app.use(VueObserveVisibility);  

app.mount("#app");
