import {createRouter,createWebHashHistory} from "vue-router";
import useStore from "@/store";
//暴露路由常量
export const constanRoute=[
   {
        //处理只展示子组件
        name:"Main",
        path:"",
        hidden:false,
        component:()=>import("@/pages/Main.vue"),
        meta:{
            /*name:"main",
            icon: "user",*/
            //main组件标志
            mainFlag:true
        },
        children:[
            {
                name:"Index",
                path: "index",
                hidden: false,
                component:()=>import("@/pages/index.vue"),
                meta: {
                    name: "首页",
                    icon: "user"
                }
            },
            {
                name:"UserProfile",
                path: "user/profile",
                hidden: false,
                component:()=>import("@/pages/user/profile/index.vue"),
                meta: {
                    name: "个人中心",
                    icon: "user"
                }
            }

        ]
    },
    {
        name:"Login",
        path:"/login",
        hidden:true,
        component:()=>import("@/pages/Login.vue"),
    },

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
            next('/index')
        }else{
            //如果有角色
            if (userStore.getRoleName){
                next()
            }else {
                //401结果有跳转操作,500没有需要在这里处理
                userStore.getUserInfo().then(()=>{
                    //生成路由
                    permissionStore.generateRoutes().then((accessRoutes:any)=>{
                        //在pinia处先处理,返回json数据
                        accessRoutes.forEach((route:any)=>{
                            //route为三个大路由,就会和main平级
                            router.addRoute("Main",route)
                        })
                        //如果生成动态路由后,不能直接放行,应该重新来一遍
                        next({...to})
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