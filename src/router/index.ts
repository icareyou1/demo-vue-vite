import {createRouter,createWebHashHistory} from "vue-router";
import useStore from "@/store";
//暴露路由常量
export const constanRoute=[
   {
        name:"Main",
        path:"/",
        hidden:true,
        component:()=>import("@/pages/Main.vue"),
        children:[
            {
                name:"Page1",
                path:"page1",
                component:()=>import("@/pages/Page1.vue"),
            },
            {
                name:"Page2",
                path:"page2",
                component:()=>import("@/pages/Page2.vue"),
            },
            {
                name:"Page3",
                path:"page3/:id/:name",
                component:()=>import("@/pages/Page3.vue"),
            }
        ]
    },
    {
        name:"Login",
        path:"/login",
        hidden:true,
        component:()=>import("@/pages/Login.vue"),
    },
    {
        name: "Home",
        path: "/home",
        hidden: false,
        component:"",
        meta:{
            name:"首页1",
            icon:"user"
        }
    }
]

//配置路由
const router=createRouter({
    history:createWebHashHistory(),
    routes:constanRoute
})
//配置路由守卫
router.beforeEach((to,from,next)=>{
    const {userStore,permissionStore}=useStore()
    const token=userStore.getToken()
    //如果有token,还要去login就默认去首页
    //不是去login页面,判断权限
    if (token){
        /*有token还去登录页,就跳转至首页*/
        if (to.name==="Login"){
            //跳转首页
            next('/')
        }else{
            //如果有角色
            if (userStore.getRoleName){
                next()
            }else {
                //401结果有跳转操作,500没有需要在这里处理
                userStore.getUserInfo().then(()=>{
                    //生成路由
                    permissionStore.generateRoutes().then(accessRoutes=>{
                        //此处得到的和后端接口一样的格式,慢于pinia
                        console.log("----",accessRoutes)
                        next()
                    })

                }).catch(err=>{//后端获取信息失败,提示信息,并注销当前登录
                    //logout()请求后端接口虽然会存在错误,但是经过userStore的接口,只会返回正确结果
                    userStore.logout().then(()=>{
                        //@ts-ignore (会执行无效的会话...)
                        ElMessage.error(err)
                        //401会失效,会被requests的messagebox卡住  但是500错误不会失效
                        next('/#/login')
                    }).catch(()=>{ //如果500接口就不做操作

                    })
                })
                next()
            }
        }
    }else {//如果没有token,就直接去登录页
        console.log("token:",token,"---去往地址为",to.name,"---router中本地存储token,",localStorage.getItem("token"))
        console.log()
        //不加下面会爆栈
        if (to.name==="Login"){
            next()
        }
        // console.log("Router----router:",to.fullPath)
        // `/login?redirect=${to.fullPath}`
        //使用query参数是为了进行重定向区分,当然也可以使用meta进行隐藏不推荐
        next({
            path:'/login',
            query:{
                redirect:to.fullPath
            }
        })
    }
})
export default router;