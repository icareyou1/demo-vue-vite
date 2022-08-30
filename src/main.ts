import { createApp } from 'vue'
import App from './App.vue'
import {createPinia} from "pinia";
import router from "@/router";
// import './style.css'
//引入element plus 图标
import * as ElIcons from '@element-plus/icons-vue'

export const app=createApp(App);
//创建pinia实例
const pinia=createPinia();
//挂载到根实例
app.use(pinia);
app.use(router)
//挂载element plus 所有图标
for (const [key, component] of Object.entries(ElIcons)) {
    app.component(key, component)
}

app.mount('#app');

