import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router/router';
import axios from 'axios';
import "./style.css";


axios.get('https://realword-api.nouwillcode.com/api') 
  .then(response => {
    console.log("API Test response:", response.data); 
  })
  .catch(error => {
    console.error("API Test error:", error);
  });

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount('#app');
