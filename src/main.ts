import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { ElIcon } from 'element-plus'

import './assets/styles.css'
import './assets/icon/iconfont.css'
import './assets/base.scss'

import VueCookies from 'vue-cookies'

import Request from '@/utils/Request'
import Message from '@/utils/Message'
import Confirm from '@/utils/Confirm'
import Verify from '@/utils/verify'
import Utils from '@/utils/Utils'

import '@fortawesome/fontawesome-free/css/all.min.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(ElementPlus)
app.component(ElIcon.name!, ElIcon) // ← 这里加上非空断言

// 挂载全局属性
app.config.globalProperties.Request = Request
app.config.globalProperties.Message = Message
app.config.globalProperties.Confirm = Confirm
app.config.globalProperties.Verify = Verify
app.config.globalProperties.Utils = Utils
app.config.globalProperties.VueCookies = VueCookies

app.mount('#app')
