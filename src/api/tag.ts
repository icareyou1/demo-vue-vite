import requests from "@/api/requests";

//查询标签列表
export const listTag=(params:any)=>{
    return requests({
        url:"/iotTag/listTag",
        params:params,
        method:"get"
    })
}
//修改标签状态
export const updateTagStatusByTagId=(data:any)=>{
    return requests({
        url:"/iotTag/updateTagStatusByTagId",
        data:data,
        method:"put"
    })
}
//通过标签id获取标签
export const getTagByTagId=(params:any)=>{
    return requests({
        url:"/iotTag/getTagByTagId",
        params:params,
        method:"get"
    })
}
//修改标签
export const updateTag=(data:any)=>{
    return requests({
        url:"/iotTag/updateTag",
        data:data,
        method:"put"
    })
}
//新增标签
export const addTag=(data:any)=>{
    return requests({
        url:"/iotTag/addTag",
        data:data,
        method:"post"
    })
}
//删除标签
export const delTag=(params:any)=>{
    return requests({
        url:"/iotTag/delTag",
        params,
        method:"delete"
    })
}