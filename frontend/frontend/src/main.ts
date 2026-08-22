import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { createPinia } from 'pinia'
import zhCn from 'element-plus/es/locale/lang/zh-cn'

createApp(App)
.use(router)
.use(ElementPlus,{locale: zhCn})
.use(createPinia())
.mount('#app')
