import {defineStore} from "pinia";
import {login, getUserInfo, logout} from "@/api";
//@ts-ignore
import Cookies from 'js-cookie'
//导入头像
import defAva from '@/assets/logo.png'
//1.定义并导出容器
//参数1:容器id必须唯一,会被pinia挂载到根容器
//参数2:选项对象
//返回值:一个函数,调用得到容器实例对象
export default defineStore("user",{
    //a.必须是函数,为了服务端渲染的时候便面交叉请求导致的数据状态污染
    //b.必须是箭头函数,为了更好的ts类型推导
    state:()=>{
        return {
            token:"",
            userName:"",
            roleName:"",
            avatar:"",
            permissions: []
        }
    },
    //修改业务逻辑,修改state
    //注意:不能使用箭头函数定义,箭头函数绑定外部this.不然获取不到state
    actions:{
        setToken(val:any){
            this.token=val
            // localStorage.setItem("token",val)
            Cookies.set("token",val)
        },
        clearToken(){
            this.token=""
            // localStorage.removeItem("token")
            Cookies.remove("token")
        },
        getToken(){
            //如果token为null,才从本地存取
            // @ts-ignore
            return this.token=this.token||Cookies.get("token")
        },
        //将请求后端方法放在路由中,代码利用率比较高
        login(dataUser:any){
            return new Promise((resolve, reject) => {
                login(dataUser).then(res => {
                    //保存数据(保存至pinia和本地)
                    this.setToken(res.data.token)
                    resolve(res)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        //注销用户
        logout(){
            return new Promise((resolve,reject)=>{

                //done 清除数据和 若依逻辑有所不同
                logout().then(res=>{
                    //这里不能放在外面,不然发送请求就会被拦截到没有token
                    this.clearToken()
                    this.roleName=""
                    this.permissions=[]
                    console.log(res)
                    resolve(res)
                }).catch(error=>{  //500接口拦截不到
                    //提前拦截只会返回正确结果
                    reject(error)
                })
            })
        },
        //获取用户信息
        getUserInfo(){
            return new Promise((resolve,reject)=>{
                getUserInfo().then(res=>{
                    const user=res.data.pageUser
                    const avatar=(user.avatar==""||user.avatar==null)?defAva:user.avatar
                    console.log("avatar",avatar)
                    //如果有角色信息,存入角色和权限
                    // console.log(res.data.roleName,"======")
                    if (res.data.roleName){
                        this.roleName=res.data.roleName
                        this.permissions=res.data.permissions
                    }else {
                        this.roleName='ROLE_DEFAULT'
                    }
                    this.userName=user.userName
                    this.avatar=avatar
                    resolve(res)
                }).catch(err=>{
                    reject(err)
                })
            })
        }

    },
    //类似组件的computed,用来封装计算属性,有缓存功能
    getters:{
        getRoleName(state){
            return state.roleName
        }
    }
})
//2.使用容器中的state
//3.修改state
//4.容器中action的使用