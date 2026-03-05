import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index';

import notifications from './plugins/notifications'

const app = createApp(App)
app.use(notifications)
app.use(router)
app.mount('#app')