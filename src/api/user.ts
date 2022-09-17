import requests from "@/api/requests";

//查询左侧边栏的组织栏目  (id,label,children)
export const orgTreeSelect=()=>{
    return requests({
        url:"/sysOrg/orgTreeSelect",
        method:"get"
    })
}

//查询用户列表
export const listUser=(params:any)=>{
    return requests({
        url:"/sysUser/listUser",
        params:params,
        method:"get"
    })
}
//修改角色状态
export const updateUserStatusByUserId=(data:any)=>{
    return requests({
        url:"/sysUser/updateUserStatusByUserId",
        data:data,
        method:"put"
    })
}
//给添加用户的弹窗部分获取角色
export const getRolesForAddUser=()=>{
    return requests({
        url:"/sysUser/getRolesForAddUser",
        method:"get"
    })
}
//添加用户或修改用户时,获取弹出框信息
export const getUserByUserId=(params:any)=>{
    return requests({
        url:"/sysUser/getUserByUserId",
        params:params,
        method:"get"
    })
}
//修改用户
export const updateUser=(data:any)=>{
    return requests({
        url:"/sysUser/updateUser",
        data:data,
        method:"put"
    })
}
//新增用户
export const addUser=(data:any)=>{
    return requests({
        url:"/sysUser/addUser",
        data:data,
        method:"post"
    })
}
//删除用户
export const delUser=(params:any)=>{
    return requests({
        url:"/sysUser/delUser",
        params:params,
        method:"delete"
    })
}
//修改密码
export const resetUserPassword=(data:any)=>{
    return requests({
        url:"sysUser/resetUserPassword",
        data:data,
        method:"put"
    })
}