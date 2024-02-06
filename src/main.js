import { createApp } from 'vue'
import App from './App.vue'
import apiPlugin from './plugins/api/api_config.js'
import '../src/assets/styles/font-face.scss'
import '../src/assets/styles/global.scss'
import '../src/assets/styles/reset.scss'

const app = createApp(App)

app.use(apiPlugin)

app.mount('#app')