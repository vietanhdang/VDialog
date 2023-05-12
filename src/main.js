import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import messageBox from './mesageBox.js'


// dùng $msgBox để gọi
const app = createApp(App)
app.config.globalProperties.$msgBox = messageBox
app.mount('#app')
