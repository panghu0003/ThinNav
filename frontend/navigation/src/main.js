import { createApp } from "vue";
import App from "./App.vue";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "@/assets/css/tokens.css";
import "@/assets/css/main.css";
import "@/assets/css/animations.css";
import "@/assets/css/typography.css";

// 创建 Vue 应用
const app = createApp(App);
app.mount("#app");
