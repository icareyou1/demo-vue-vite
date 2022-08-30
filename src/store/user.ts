import {defineStore} from "pinia";
//1.定义并导出容器
//参数1:容器id必须唯一,会被pinia挂载到根容器
//参数2:选项对象
//返回值:一个函数,调用得到容器实例对象
export default defineStore("user",{
    //a.必须是函数,为了服务端渲染的时候便面交叉请求导致的数据状态污染
    //b.必须是箭头函数,为了更好的ts类型推导
    state:()=>{
        return {
        token:""
        }
    },
    //修改业务逻辑,修改state
    //注意:不能使用箭头函数定义,箭头函数绑定外部this.不然获取不到state
    actions:{
        setToken(val:any){
            this.token=val
            localStorage.setItem("token",val)
        },
        clearToken(){
            this.token=""
            localStorage.removeItem("token")
        },
        getToken(){
            //如果token为null,才从本地存取
            // @ts-ignore
            return this.token=this.token||localStorage.getItem("token")
        },
    },
    //类似组件的computed,用来封装计算属性,有缓存功能
    getters:{

    }
})
//2.使用容器中的state
//3.修改state
//4.容器中action的使用