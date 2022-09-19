import requests from "@/api/requests";

//查询tag列表用tree进行展示
export const tagShowByTree=()=>{
    return requests({
        url:"/iotDevice/tagShowByTree",
        method:"get"
    })
}

//获取device列表数据
export const listDevice=(params:any)=>{
    return requests({
        url:"/iotDevice/listDevice",
        params,
        method:"get"
    })
}