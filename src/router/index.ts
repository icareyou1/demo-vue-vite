import {createRouter,createWebHashHistory} from "vue-router";
import useStore from "@/store";
//引入路由组件
import Main from "@/pages/Main.vue"
import Login from "@/pages/Login.vue"
import Page1 from "@/pages/Page1.vue"
import Page2 from "@/pages/Page2.vue"
import Page3 from "@/pages/Page3.vue"
//配置路由
const router=createRouter({
    history:createWebHashHistory(),
    routes:[
        {
            name:"Main",
            path:"/",
            component:Main,
            children:[
                {
                    name:"Page1",
                    path:"page1",
                    component:Page1,
                },
                {
                    name:"Page2",
                    path:"page2",
                    component:Page2,
                },
                {
                    name:"Page3",
                    path:"page3/:id/:name",
                    component:Page3,
                }
            ]
        },
        {
            name:"Login",
            path:"/login",
            component:Login
        }
    ]
})
//配置路由守卫
router.beforeEach((to,from,next)=>{
    const {userStore}=useStore()
    const token=userStore.getToken()
    //如果没有token,且不是去登录页面的就强制跳转
    if (!token&&to.name!="Login"){
        console.log("token:",token,"---去往地址为",to.name)
        console.log("router中本地存储token,",localStorage.getItem("token"))
        next('/login')
    }else {
        //如果有token
        next()
    }
})
export default router;