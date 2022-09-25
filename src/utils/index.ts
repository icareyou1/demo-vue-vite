/**
 * 构造树型结构数据
 * @param {*} data 数据源
 * @param {*} id id字段 默认 'id'
 * @param {*} parentId 父节点字段 默认 'parentId'
 * @param {*} children 孩子节点字段 默认 'children'
 */
import {json} from "stream/consumers";


export const handleTree=(data:any, id:any, parentId?:any, children?:any)=>{
    let config = {
        id: id || 'id',
        parentId: parentId || 'parentId',
        childrenList: children || 'children'
    };

    var childrenListMap:any = [];
    var nodeIds = [];
    var tree = [];

    for (let d of data) {
        let parentId = d[config.parentId];
        if (childrenListMap[parentId] == null) {
            childrenListMap[parentId] = [];
        }
        nodeIds[d[config.id]] = d;
        childrenListMap[parentId].push(d);
    }

    for (let d of data) {
        let parentId = d[config.parentId];
        if (nodeIds[parentId] == null) {
            tree.push(d);
        }
    }

    for (let t of tree) {
        adaptToChildrenList(t);
    }

    function adaptToChildrenList(o:any) {
        if (childrenListMap[o[config.id]] !== null) {
            o[config.childrenList] = childrenListMap[o[config.id]];
        }
        if (o[config.childrenList]) {
            for (let c of o[config.childrenList]) {
                adaptToChildrenList(c);
            }
        }
    }
    return tree;
}

// 日期格式化
export const parseTime=(time:any, pattern?:any)=>{
    if (!time) {
        return null
    }
    const format = pattern || '{y}-{m}-{d} {h}:{i}:{s}'
    let date
    if (typeof time === 'object') {
        date = time
    } else {
        if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
            time = parseInt(time)
        } else if (typeof time === 'string') {
            time = time.replace(new RegExp(/-/gm), '/').replace('T', ' ').replace(new RegExp(/\.[\d]{3}/gm), '');
        }
        if ((typeof time === 'number') && (time.toString().length === 10)) {
            time = time * 1000
        }
        date = new Date(time)
    }
    const formatObj = {
        y: date.getFullYear(),
        m: date.getMonth() + 1,
        d: date.getDate(),
        h: date.getHours(),
        i: date.getMinutes(),
        s: date.getSeconds(),
        a: date.getDay()
    } as any
    const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result:any, key:any) => {
        let value = formatObj[key]
        // Note: getDay() returns 0 on Sunday
        if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value] }
        if (result.length > 0 && value < 10) {
            value = '0' + value
        }
        return value || 0
    })
    return time_str
}
// 添加日期范围
export const addDateRange=(params:any, dateRange:any, propName?:any)=>{
    let search = params;
    //params初始化一般是没有的
    search.params = typeof (search.params) === 'object' && search.params !== null && !Array.isArray(search.params) ? search.params : {};
    dateRange = Array.isArray(dateRange) ? dateRange : [];
    if (typeof (propName) === 'undefined') {
        search.params['beginTime'] = dateRange[0];
        search.params['endTime'] = dateRange[1];
    } else {
        search.params['begin' + propName] = dateRange[0];
        search.params['end' + propName] = dateRange[1];
    }
    return search;
}
//添加日期范围
export const addDateRangePlus=(params:any,dateRange:any,propName?:any)=>{
    let search=params;
    search.beginTime=typeof (search.params) === 'object' && search.params !== null && !Array.isArray(search.params) ? search.params : {};
    search.endTime=typeof (search.params) === 'object' && search.params !== null && !Array.isArray(search.params) ? search.params : {};
    dateRange = Array.isArray(dateRange) ? dateRange : [];
    if (typeof (propName)==='undefined'){
        search.beginTime=dateRange[0];
        search.endTime=dateRange[1];
    }else {
        search['begin'+propName]=dateRange[0]
        search['end'+propName]=dateRange[1]
    }
    return search;
}

//done 根据categoryId解析categoryName
export const parseCategory=(categoryId:number,categoryList:[])=>{
    if (!categoryList||!categoryId) return undefined;
    let temp:any=undefined;
    categoryList.forEach((item:any)=>{
        if (item.categoryId===categoryId) temp=item.categoryName;
    })
    return temp;
}
//done 根据标签id解析标签
export const parseTag=(tagIds:string,tagList:any)=>{
    //为了后端简化,tagList可能会比tagIds少,因为tagList是对应设备取的

    //row拥有的数据
    let tagArr = JSON.parse(tagIds);
    //如果存在tagArr
    if (tagArr){
        return tagArr.map((itemA:any)=>{
            let find = tagList.find((itemB:any)=>{
                return itemB.tagId==itemA
            });
            //会找到undefined的数据,不给前端返回
            if (find==undefined) return undefined;
            return find.tagName;
        }).filter((item:any)=>item!=undefined)
    }

}

//done 构建设备id树形select(包含禁用选项)
export const handleDeviceTreeSelect = (data:any) => {
    //筛选出网关设备数组
    let gateWayIds = data.map((item:any)=>{
        if (item.deviceId.length==18&&item.deviceId.substring(15)=='000'){
            return item.deviceId
        }
        return null;
    }).filter((item:any)=>item);
    //筛选出子设备
    let subDeviceIds=data.map((item:any)=>{
        if (item.deviceId.length==18&&item.deviceId.substring(15)!='000'){
            return item.deviceId
        }
        return null;
    }).filter((item:any)=>item);
    //根据网关构建树形数组
    return gateWayIds.map((item:any)=>{
        //数组
        let arr=[]
        //构建子类
        for (let i = 1; i <= 32; i++) {
            let temp:any={}
            let str=""
            if (i<=9){
                str=item.substring(0,17)+i;

            } else {
                str=item.substring(0,16)+i;
            }
            temp={deviceId:str,disabled:false}
            if (subDeviceIds.indexOf(str)!==-1){
                temp.disabled=true;
            }
            arr.push(temp)
        }
        return {deviceId:item,disabled:true,children:arr}
    });
}
const required_number={type:'number',message:"请输入数字",trigger:"blur"};
const number1_32={pattern:/^([1-9]|[1-2]\d|3[0-2])$/, message:"请输入1-32之间的整数",trigger: 'blur'};
const number0_65_535={pattern:/^([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/,
    message:"请输入0-65.535数字(三位小数有效)",trigger: 'blur'};
const number1_1000={pattern:/^([1-9]|[1-9]\d|[1-9]\d{2}|1000)$/, message:"请输入1-1000之间的数字",trigger: 'blur'};
const number0_6553_5={pattern:/^([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/,
    message:"请输入0-6553.5数字(一位小数有效)",trigger: 'blur'};
const number1_65535={pattern:/^([1-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/,
    message:"请输入1-65535之间的数字",trigger: 'blur'};
const number0_65535={pattern:/^([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/,
    message:"请输入0-65535之间的数字",trigger: 'blur'};
const number0_655350={pattern:/^([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-9]\d{4}|[1-5]\d{5}|6[1-4]\d{4}|65[0-4]\d{3}|655[0-2]\d{2}|6553[0-4]\d|655350)$/,
    message:"请输入0-655350之间的数字",trigger:'blur'};
const select0_1={pattern:/^[0-1]$/,message:"选择有误",trigger:'blur'};
const select0_1_2={pattern:/^[0-2]$/,message:"选择有误",trigger:'blur'};
const select0_1_2_3={pattern:/^[0-3]$/,message:"选择有误",trigger:'blur'};
const select0_1_2_3_4={pattern:/^[0-4]$/,message:"选择有误",trigger:'blur'};

const string1_32="请输入1-32的值";
const string0_65_535="请输入0-65.535(至多三位小数)";
const string1_1000="请输入1-1000的值";
const string0_6553_5="请输入0-6553.5(至多一位小数)";
const string1_65535="请输入1-65535的值";
const string0_65535="请输入0-65535的值";
const string0_655350="请输入0-655350的值";

/**
 * formItem  [{label:"类别名称",value:"categoryName",placeholder:"请输入类别名称"}]
 * rules   {category:[{required:true,message:"类型",trigger:"blue"}],d2000:[{}]}
 * title   "新增类别"
 * @param data
 */
//生成类别新增组件
export const createAddCategory=(data:any)=>{
    let subComponent=data;
    subComponent.title="新增类别";
    //生成formItem(同时具有初始化功能)
    subComponent.formItem=[
        {label:"类别名称",value:"categoryName",placeholder:"请输入类别名称"},
        {label: "状态",value: "status",placeholder: ""},
        {label: "备注",value: "comment",placeholder: "请输入类别备注"}];
    subComponent.rules.categoryName=[{required:true,message:"类型名不能为空",trigger:"blur"}]

    for (let i=2000;i<=2032;i++){
        let temp='d'+i;
        //处理formItem
        subComponent.formItem.push({label:temp,value:temp,placeholder:"请输入0-65535之间的数字"})
        //处理规则
        subComponent.rules['d'+i]=[required_number,number0_65535]
    }
}

//生成SPD类别组件
export const createUpdateSPD=(data:any)=>{
    //准备labels
    let labels=[
        "类别名称","状态","备注",
        "从站地址","波特率","当前设备工作模式","电网标准", "输入电压采样系数",
        "雷击电流CT变比","漏电流CT变比","ZCT变比","温度传感器类型", "电压告警模式",
        "频率告警模式","电流告警模式","功率告警模式","温度告警模式", "雷电流告警模式",
        "外部告警使能","防雷器监控使能","断路器监控使能","电压告警过压点(Vac)", "电压告警欠压点(Vac)",
        "电压告警延时(s)","电流告警过流点(mA)","电流告警欠流点(mA)","电流告警延时(s)", "功率告警过功率点(mW)",
        "功率告警欠功率点(mW)", "功率告警延时(s)", "温度告警过温点(℃)", "温度告警欠温点(℃)", "温度告警延时(s)",
        "雷流高告警点(A)", "雷流高告警延时(us)", "雷电流次数超限(cnt)",
    ]
    //准备values
    let values=["categoryName","status","comment"]
    for (let i=2000;i<=2032;i++){
        values.push('d'+i);
    }
    //准备placeholders
    let placeholders=[
        "请输入类别名称","请选择状态","请输入备注",
        string1_32,"请选择波特率","请选择设备工作模式","请选择电网标准",string1_65535,
        string1_1000,string1_1000,string1_1000,"请选择传感器类型","请选择电压告警模式",
        "请选择频率告警模式", "请选择电流告警模式", "请选择功率告警模式", "请选择温度告警模式", "请选择雷电流告警模式",
        string0_65535,"请选择防雷器监控使能","请选择断路器监控使能",string0_65535, string0_65535,
        string0_6553_5,string0_65_535,string0_65_535,string0_6553_5, string0_6553_5,
        string0_6553_5, string0_6553_5, string0_65535, string0_65535, string0_6553_5,
        string0_655350, string0_65535, string0_65535,
    ]

    //1.标题
    data.title="SPD模块";
    //2.生成formItem
    data.formItem=[];
    //2.1处理lables
    labels.forEach(item=>{
        data.formItem.push({label:item,value:"",placeholder:""})
    })
    //2.2处理values
    for (let i=0;i<values.length;i++){
        data.formItem[i].value=values[i];
    }
    //2.3处理placeholders
    for (let i=0;i<placeholders.length;i++){
        data.formItem[i].placeholder=placeholders[i]
    }
    //3.处理rules
    data.rules={
        categoryName:{required:true,message:"类型名不能为空",trigger:"blur"},
        d2000:[required_number,number1_32], d2001:[required_number,select0_1_2],
        d2002:[required_number,select0_1], d2003:[required_number,select0_1_2],
        d2004:[required_number,number1_65535], d2005:[required_number,number1_1000],
        d2006:[required_number,number1_1000], d2007:[required_number,number1_1000],
        d2008:[required_number,select0_1_2_3_4], d2009:[required_number,select0_1_2_3],
        d2010:[required_number,select0_1_2_3], d2011:[required_number,select0_1_2_3],
        d2012:[required_number,select0_1_2_3], d2013:[required_number,select0_1_2_3],
        d2014:[required_number,select0_1_2], d2015:[required_number,number0_65535],
        d2016:[required_number,select0_1], d2017:[required_number,select0_1],
        d2018:[required_number,number0_65535], d2019:[required_number,number0_65535],
        d2020:[number0_6553_5], d2021:[number0_65_535],
        d2022:[number0_65_535], d2023:[number0_6553_5],
        d2024:[number0_6553_5], d2025:[number0_6553_5],
        d2026:[number0_6553_5], d2027:[required_number,number0_65535],
        d2028:[required_number,number0_65535], d2029:[number0_6553_5],
        d2030:[required_number,number0_655350], d2031:[required_number,number0_65535],
        d2032:[required_number,number0_65535],
    }
}


//生成接地电阻组件
export const createUpdateResistance=(data:any)=>{
    //准备labels
    let labels=[
        "类别名称","状态","备注",
        "从站地址","波特率","当前设备工作模式","电网标准", "输入电压采样系数",
        "雷击电流CT变比","接地电阻测量时长(s)","接地电阻定时测试间隔时间(h)","", "",
        "","","","", "",
        "","","","", "",
        "接地电阻告警点(Ω)","接地电阻告警延时(s)","过压点(Vac)","过压告警延时(s)", "过温点(℃)",
        "过温告警延时(s)", "雷流高告警点(A)", "雷流高告警延时(us)", "雷电流次数超限(cnt)", "",
        "", "", "",
    ]
    //准备values
    let values=["categoryName","status","comment"]
    for (let i=2000;i<=2032;i++){
        values.push('d'+i);
    }
    //准备placeholders
    let placeholders=[
        "请输入类别名称","请选择状态","请输入备注",
        string1_32,"请选择波特率","请选择设备工作模式","请选择电网标准",string1_65535,
        string1_1000,string0_6553_5,string0_6553_5,"","",
        "", "", "", "", "",
        "","","","", "",
        string0_6553_5,string0_65_535,string0_65_535,string0_6553_5, string0_6553_5,
        string0_6553_5, string0_6553_5, string0_65535, string0_65535, string0_65535,
        string0_655350, string0_65535, string0_65535,
    ]

    //1.标题
    data.title="接地电阻模块";
    //2.生成formItem
    data.formItem=[];
    //2.1处理lables
    labels.forEach(item=>{
        data.formItem.push({label:item,value:"",placeholder:""})
    })
    //2.2处理values
    for (let i=0;i<values.length;i++){
        data.formItem[i].value=values[i];
    }
    //2.3处理placeholders
    for (let i=0;i<placeholders.length;i++){
        data.formItem[i].placeholder=placeholders[i]
    }
    //3.处理rules
    data.rules={
        categoryName:{required:true,message:"类型名不能为空",trigger:"blur"},
        d2000:[required_number,number1_32], d2001:[required_number,select0_1_2],
        d2002:[required_number,select0_1], d2003:[required_number,select0_1_2],
        d2004:[required_number,number1_65535], d2005:[required_number,number1_1000],
        d2006:[required_number,number1_1000], d2007:[required_number,number1_1000],
        d2008:[required_number,select0_1_2_3_4], d2009:[required_number,select0_1_2_3],
        d2010:[required_number,select0_1_2_3], d2011:[required_number,select0_1_2_3],
        d2012:[required_number,select0_1_2_3], d2013:[required_number,select0_1_2_3],
        d2014:[required_number,select0_1_2], d2015:[required_number,number0_65535],
        d2016:[required_number,select0_1], d2017:[required_number,select0_1],
        d2018:[required_number,number0_65535], d2019:[required_number,number0_65535],
        d2020:[number0_6553_5], d2021:[number0_65_535],
        d2022:[number0_65_535], d2023:[number0_6553_5],
        d2024:[number0_6553_5], d2025:[number0_6553_5],
        d2026:[number0_6553_5], d2027:[required_number,number0_65535],
        d2028:[required_number,number0_65535], d2029:[number0_6553_5],
        d2030:[required_number,number0_655350], d2031:[required_number,number0_65535],
        d2032:[required_number,number0_65535],
    }
}


























