import { createApp } from 'vue'
import App from './App.vue'
import pinia from './stores/index'
import router from './router/index'
import '@/utils/vant-ui'
import '@/assets/css/static.css'

const app = createApp(App)

app.use(pinia)
app.use(router)
app.mount('#app')
