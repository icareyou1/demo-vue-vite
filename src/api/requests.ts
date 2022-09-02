//对axios进行二次封装,主要是使用它的请求和响应拦截器
import axios from "axios";
//操作token
import useStore from "@/store/index";
//多个请求401只显示一个,是否正在重新登录
let isRelogin={show:false}

//1.利用axios的create,创建一个axios实例
const requests=axios.create({
    //基础路径
    baseURL:"/api",
    //响应超时时间5s
    timeout:5000,
})
//2.配置请求拦截器,在发出请求前,对请求进行一些操作
requests.interceptors.request.use((config)=>{
    //done 配置对象,里面有一个很重要的header请求头

    // (如果请求头里面没有headers没有定义isToken=false,   false===false则为true)  且默认为false
    const isToken = (config.headers || {}).isToken === false
    //获取token
    const {userStore}=useStore()
    const token=userStore.getToken()
    if (token&& !isToken) {
        // console.log("token值为:"+token)

        // @ts-ignore
        config.headers['token'] = token // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    return config;
},error => {
    console.log(error)
    Promise.reject(error)
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
    //无权限
    if (code === 401) {
        //经过logout的接口一律返回正确
        if (msg==="用户未认证,访问资源为:/sysUser/logout"){
            let temp={"code":200,"msg":"注销成功"}
            return Promise.resolve(temp)
        }
        //当show=false时进入,如果不进行这样处理,需要点击多次才能关闭弹窗
        if (!isRelogin.show){
            isRelogin.show=true;
            // @ts-ignore
            ElMessageBox.confirm('登录状态已过期，您可以继续留在该页面，或者重新登录', '系统提示', {
                    confirmButtonText: '重新登录',
                    cancelButtonText: '取消',
                    type: 'warning'
                }
            ).then(() => {
                isRelogin.show=false;
                //退出登录:清楚token,然后跳转登录页面
                const {userStore}=useStore()
                //logout()请求后端接口虽然会存在错误,但是经过userStore的接口,只会返回正确结果
                userStore.logout().then(()=>{
                    location.href="/#/login"
                    //失败只是说明,后端不一定清除(因为token可能是篡改了之类)
                })
            }).catch(() => {
                isRelogin.show=false;
            });
        }
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
        //@ts-ignore
        ElNotification({
            type: 'success',
            message:msg
        })
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