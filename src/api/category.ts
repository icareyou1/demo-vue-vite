import requests from "@/api/requests";

//获取分类列表
export const listCategory=(params:any)=>{
    return requests({
        url:"/iotCategory/listCategory",
        params,
        method:"get"
    })
}
