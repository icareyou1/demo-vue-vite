//对API进行统一管理
import requests from "@/api/requests";

//1.获取验证码,axios发送请求返回Promise对象
export const getCaptchaImage=()=>{
    return requests({
        url:"/captchaImage",
        method:"get",
        headers: {
            isToken: false
        },
    })
}
//2.登录,发送userName,password,code,uuid
export const login=(params:any)=>{
    return requests({
        url:"/sysUser/login",
        data:params,
        method:"post",
        headers: {
            isToken: false
        },
    })
}
//3.注销用户
export const logout=()=>{
    return requests({
        url:"/sysUser/logout",
        method:"get"
    })
}
//4.登录后默认获取用户信息接口
export const getUserInfo=()=>{
    return requests({
        url:"/sysUser/getUserInfo",
        method:"get",
    })
}
//5.获取路由信息
export const getRouters=()=>{
    return requests({
        url:"/sysUser/getRouters",
        method:"get",
    })
}
//6.获取树形菜单
export const treeSelect=()=>{
    return requests({
        url:"/sysMenu/treeSelect",
        method:"get"
    })
}
//7.获取修改角色时,回显选中的菜单
export const updateRoleShowTreeSelect=(params:any)=>{
    return requests({
        url:"/sysMenu/updateRoleShowTreeSelect",
        params:params,
        method:"get"
    })
}