//对axios进行二次封装,主要是使用它的请求和响应拦截器
import axios from "axios";
//操作token
import useStore from "@/store/index";
//路由跳转
// import {useRouter} from "vue-router";
// const $router=useRouter()
//1.利用axios的create,创建一个axios实例
const requests=axios.create({
    //基础路径
    baseURL:"/api",
    //响应超时时间5s
    timeout:5000,
})
//2.配置请求拦截器,在发出请求前,对请求进行一些操作
requests.interceptors.request.use((config)=>{
    //todo 配置对象,里面有一个很重要的header请求头
    return config;
})
//3.配置响应拦截器
requests.interceptors.response.use((res:any)=>{
    //获取状态码,未设置状态码则默认成功
    const code=res.data.code||200;
    //获取返回消息
    const msg=res.data.msg
    // 二进制数据则直接返回
    if(res.request.responseType ===  'blob' || res.request.responseType ===  'arraybuffer'){
        return res.data
    }
    if (code === 401) {
        // @ts-ignore
        ElMessageBox.confirm('登录状态已过期，您可以继续留在该页面，或者重新登录', '系统提示', {
                confirmButtonText: '重新登录',
                cancelButtonText: '取消',
                type: 'warning'
            }
        ).then(() => {
            //退出登录:清楚token,然后跳转登录页面
            const {userStore}=useStore()
            userStore.clearToken()
            location.href="/#/login"
            /*store.dispatch('LogOut').then(() => {
                location.href = '/index';
            })*/
        }).catch(() => {});
        return Promise.reject('无效的会话，或者会话已过期，请重新登录。')
    } else if (code === 500) {
        // @ts-ignore
        ElMessage({
            message: msg,
            type: 'error'
        })
        return Promise.reject(new Error(msg))
    } else if (code === 502) {
        return Promise.reject('error')
    } else if (code !== 200) {
        // @ts-ignore
        ElNotification .error({
            title: msg
        })
        return Promise.reject('error')
    } else {
        return res.data
    }
},(error)=>{
    console.log('err' + error)
    let { message } = error;
    if (message == "Network Error") {
        message = "后端接口连接异常";
    }
    else if (message.includes("timeout")) {
        message = "系统接口请求超时";
    }
    else if (message.includes("Request failed with status code")) {
        message = "系统接口" + message.substr(message.length - 3) + "异常";
    }
    // @ts-ignore
    ElMessage({
        message: message,
        type: 'error',
        duration: 5 * 1000
    })
    //响应失败的回调函数
    return Promise.reject(new Error("faile"));
})
//对外暴露
export default requests;