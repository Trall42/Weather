import { createApp } from 'vue'
import App from './App.vue'
import apiPlugin from './plugins/api/api_config.js'
import '../src/assets/styles/global.scss'

const app = createApp(App)

app.use(apiPlugin)
app.mount('#app')