import requests from "@/api/requests";

//获取所有设备列表
export const listMonitorDevice=(params:any)=>{
    return requests({
        url:"/iotMonitor/listMonitorDevice",
        params,
        method:"get"
    })
}