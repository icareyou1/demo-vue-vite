import {defineStore} from "pinia";
import {getRouters} from "@/api";
import {constanRoute} from "@/router";
import main from "@/pages/Main.vue";
export default defineStore("permission",{
    state:()=>{
        return{
            menuRoutes:[]
        }
    },
    actions:{
        //获取路由
        generateRoutes(){
            return new Promise((resolve,reject)=>{
                //res不是最原始的,就是后端返回的res
                getRouters().then(res=>{
                    //相当于拷贝
                    const asideData =JSON.parse(JSON.stringify(res.data));
                    const rewriteData = JSON.parse(JSON.stringify(res.data));
                    const asideRoutes=filterAsyncRouter(asideData);
                    const rewriteRoutes=filterAsyncRouter(rewriteData);
                    // @ts-ignore
                    this.menuRoutes=constanRoute.concat(asideRoutes) //[Main,login,monitor,device,system]

                    //返回的会放在main路由成为子路由
                    resolve(rewriteRoutes)
                })
            })
        }
    },
    getters:{
        getMenuRoutes(state){
            return state.menuRoutes;
        }
    }
})
//处理异步得到的路由
function filterAsyncRouter(asyncRouter:any){
    return asyncRouter.filter((route:any)=>{
        //组件存在才处理
        if (route.component){
            //如果后端定义了main组件,则使用前端main组件
            if (route.component==="Main"){
                route.component=main
            }else {
                route.component=loadView(route.component)
            }
        }
        if (route.children!==null&&route.children&&route.children.length){
            route.children=filterAsyncRouter(route.children)
        }
        return true
    })
}

// 从文件系统中导入多个模块,相当于一个个import
/**
 * const modules = {
 *   '../pages/Login.vue': () => import('/src/pages/Login.vue'),
 *   '../pages/Main.vue': () => import('/src/pages/Main.vue')
 *   ...
 * }
 */
const modules = import.meta.glob("./../pages/**/*.vue")
//view:  直接为后端字符串   system/user/index
export const loadView = (view:any) => {
    let res;
    //path为  ../pages/system/user/index.vue  写好的页面
    for (const path in modules) {
        //dir 为  system/user/index
        const dir = path.split('pages/')[1].split('.vue')[0];
        if (dir === view) {
            res = () => modules[path]();
        }
    }
    return res;
}
/**
 * 1.import不能导入动态变量
 * 2.vite构建中不能使用require因为这个是webpack提供
 */