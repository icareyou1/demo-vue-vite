//对API进行统一管理
import requests from "@/api/requests";

//1.获取验证码,axios发送请求返回Promise对象
export const getCaptchaImage=()=>{
    return requests({
        url:"/captchaImage",
        method:"get"
    })
}
//2.登录,发送userName,password,code,uuid
export const login=(params:any)=>{
    return requests({
        url:"/sysUser/login",
        data:params,
        method:"post"
    })
}