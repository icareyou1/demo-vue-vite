//对API进行统一管理
import requests from "@/api/requests";

//查询角色列表
export const listRole=(params:any)=>{
    return requests({
        url:"/sysRole/listRole",
        //get请求用这个
        params:params,
        method:"get"
    })
}
//修改角色状态
export const updateRoleStatusByRoleId=(params:any)=>{
    return requests({
        url:"/sysRole/updateRoleStatusByRoleId",
        method:"put",
        data:params
    })
}

//新增角色
export const addRole=(data:any)=>{
    return requests({
        url:"/sysRole/addRole",
        data:data,
        method:"post"
    })
}
//修改角色
export const updateRole=(data:any)=>{
    return requests({
        url:"/sysRole/updateRole",
        data:data,
        method:"put"
    })
}
//删除角色
export const delRole=(params:any)=>{
    return requests({
        url:"/sysRole/delRole",
        params:params,
        method:"delete"
    })
}
//根据角色id查询角色
export const getRoleByRoleId=(params:any)=>{
    return requests({
        url:"/sysRole/getRoleByRoleId",
        params:params,
        method:"get"
    })
}