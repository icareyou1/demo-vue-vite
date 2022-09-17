//对API进行统一管理
import requests from "@/api/requests";

//查询组织表
export const listOrg=(params?:any)=>{
    return requests({
        url:"/sysOrg/listOrg",
        //get请求用这个
        params:params,
        method:"get"
    })
}
//根据组织id查询组织
export const getOrgByOrgId=(orgId:any)=>{
    return requests({
        url:"sysOrg/getOrgByOrgId",
        params:orgId,
        method:"get"
    })
}
//修改组织表
export const updateOrg=(params:any)=>{
    return requests({
        url:"/sysOrg/updateOrg",
        data:params,
        method:"put"

    })
}
//添加组织
export const addOrg=(params:any)=>{
    return requests({
        url:"/sysOrg/addOrg",
        data:params,
        method:"post"
    })
}
//删除部门表
export const deleteOrgByOrgId=(orgId:any)=>{
    return requests({
        url:"/sysOrg/deleteOrgByOrgId",
        params:orgId,
        method:"delete"
    })
}
//根据id查询父组织
export const listOrgExcludeChild=(orgId:any)=>{
    return requests({
        url:"sysOrg/listOrgExcludeChild",
        params:orgId,
        method:"get",
    })
}