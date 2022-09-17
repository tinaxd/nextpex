import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";

import "./assets/main.css";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:3601";

const app = createApp(App);

app.use(router);
app.use(ElementPlus);

app.mount("#app");
