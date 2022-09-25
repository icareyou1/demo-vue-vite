import requests from "@/api/requests";

//查询tag列表用tree进行展示
export const tagShowByTree=()=>{
    return requests({
        url:"/iotDevice/tagShowByTree",
        method:"get"
    })
}
//获取搜索区域的设备类型
export const deviceCategoryForSearch=()=>{
    return requests({
        url:"/iotDevice/deviceCategoryForSearch",
        method:"get"
    })
}
//获取搜索区域的IP下拉框
export const deviceIpForSearch=()=>{
    return requests({
        url:"/iotDevice/deviceIpForSearch",
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

//更改设备状态
export const updateDeviceStatusByDeviceId=(data:any)=>{
    return requests({
        url:"/iotDevice/updateDeviceStatusByDeviceId",
        data,
        method:"put"
    })
}

//新增设备
export const addDevice=(data:any)=>{
    return requests({
        url:"/iotDevice/addDevice",
        data,
        method:"post"
    })
}

//获取修改设备时的回显数据
export const getDeviceByDeviceId=(params:any)=>{
    return requests({
        url:"/iotDevice/getDeviceByDeviceId",
        params,
        method:"get"
    })
}

//修改设备
export const updateDevice=(data:any)=>{
    return requests({
        url:"/iotDevice/updateDevice",
        data,
        method:"put"
    })
}

//删除设备
export const  delDevice=(params:any)=>{
    return requests({
        url:"/iotDevice/delDevice",
        params,
        method:"delete"
    })
}