//对API进行统一管理
import requests from "@/api/requests";

export const getDeviceStatistic=()=>{
    return requests({
        url:"/iotDevice/getDeviceStatistic",
        method:"get"
    })
}