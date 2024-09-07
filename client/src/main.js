import { createApp } from 'vue'
import './style.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import './styles/dark/css-vars.css'
import router from './router'
import App from './App.vue'
import message from "./components/Message/index";
import pinia from './store'
import VueLazyload from 'vue-lazyload'
import './permisstion'
import { Loading } from '@element-plus/icons-vue'
const app=createApp(App)
app.use(pinia)
app.use(message)
app.use(ElementPlus)
app.use(router)
// app.use(VueLazyload,{
//     lazyComponent:true,
//     observer:true,
//     loading:'./assets/wall.png'
// })
app.mount('#app')
