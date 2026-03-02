import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'

import notifications from './plugins/notifications'

const app = createApp(App)
app.use(notifications)
app.mount('#app')