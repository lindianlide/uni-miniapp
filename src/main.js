import { createApp } from 'vue'
import { setupStore } from '@/stores'
import App from './App.vue'
import '@/styles/index.scss'
import '@/styles/main.css'

const app = createApp(App)
// 配置存储
setupStore(app)

app.mount('#app')
