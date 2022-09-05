import {defineStore} from "pinia";
import {getRouters} from "@/api";
import {constanRoute} from "@/router";

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
                    let concat = constanRoute.concat(res.data);
                    this.menuRoutes=concat
                    resolve(res)
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