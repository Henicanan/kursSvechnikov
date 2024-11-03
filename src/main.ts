import { createApp } from "vue";
import App from "./App.vue";
import { router } from "./router";
import { createPinia } from "pinia";
import { setupAuthStateListener } from "./store/authStateListener";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
setupAuthStateListener();
app.use(router);
app.mount("#app");
