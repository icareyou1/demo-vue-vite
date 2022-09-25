<template>
  <div style="padding: 10px">
    <el-row :gutter="20">
      <!--左侧标签数据-->
      <el-col :span="24" :xs="24">
        <el-card shadow="never" style="margin-bottom: 20px;height: 162px" >
          <!--搜索部分-->
          <div>
            <el-input
                v-model="data.tagName"
                placeholder="请输入标签名称"
                clearable
                prefix-icon="Search"
                style="margin-bottom: 20px"
            ></el-input>
          </div>
          <!--展示部分，同时展示搜索部分-->
          <div style="margin-bottom: 10px">
            <el-tree
                :data="data.tagOptions"
                :props="{label:'tagName',children:'children'}"
                show-checkbox
                ref="tagRef"
                node-key="tagId"
                :filter-node-method="filterNode"
                @node-click="handleNodeClick"
                @check-change="handleCheckChange"
                style="display: flex;flex-direction: row"
            />
          </div>
        </el-card>

      </el-col>
      <!--设备数据-->
      <el-col :span="24" :xs="24">
        <!--顶部搜索栏-->
        <el-form :model="data.queryParams" ref="queryRef" v-show="data.searchShow.showSearch" :inline="true">
          <!--设备名称-->
          <el-form-item label="设备名称" prop="deviceName">
            <el-input
                v-model="data.queryParams.deviceName"
                placeholder="请输入设备名称"
                clearable
                style="width: 200px"
                @keyup.enter="handleQuery"
            />
          </el-form-item>
          <!--设备类别-->
          <el-form-item label="设备类别" prop="categoryId">
            <el-select
                v-model="data.queryParams.categoryId"
                placeholder="请选择设备类别"
                style="width: 170px"
                clearable
            >
              <el-option
                  v-for="dict in data.searchShow.categorySelectionOption"
                  :key="dict.categoryId"
                  :label="dict.categoryName"
                  :value="dict.categoryId"
              />
            </el-select>
          </el-form-item>
          <!--设备地址-->
          <el-form-item label="设备地址" prop="deviceAddress">
            <el-input
                v-model="data.queryParams.deviceAddress"
                placeholder="请输入设备地址"
                style="width: 180px"
                clearable
            />
          </el-form-item>
          <!--回显IP地址-->
          <el-form-item label="设备IP" prop="deviceIp">
            <el-select
                v-model="data.queryParams.deviceIp"
                placeholder="请选择设备IP"
                style="width: 170px"
                clearable
            >
              <el-option
                  v-for="dict in data.searchShow.ipSelectionOpton"
                  :key="dict"
                  :label="dict"
                  :value="dict"
              />
            </el-select>
          </el-form-item>
          <!--状态-->
          <el-form-item label="状态" prop="status">
            <el-select
                v-model="data.queryParams.status"
                placeholder="设备状态"
                style="width: 120px"
                clearable
            >
              <el-option
                  v-for="dict in data.searchShow.statusSelectOption"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
              />
            </el-select>
          </el-form-item>
          <!--创建时间-->
          <el-form-item label="创建时间" style="width: 300px">
            <el-date-picker
                v-model="data.searchShow.dateRange"
                value-format="YYYY-MM-DD"
                type="daterange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
            <el-button icon="Refresh" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
        <!--中间按钮栏-->
        <el-row :gutter="10" style="margin-bottom: 8px">
          <el-col :span="1">
            <el-button
                type="primary"
                plain
                icon="Plus"
                @click="handleAdd"
                v-hasPerm="['device:manage:add']"
            >新增</el-button>
          </el-col>
          <el-col :span="1">
            <el-button
                type="success"
                plain
                icon="Edit"
                :disabled="data.buttonShow.updateDisabled"
                @click="handleUpdate"
                v-hasPerm="['device:manage:update']"
            >修改</el-button>
          </el-col>
          <el-col :span="1">
            <el-button
                type="danger"
                plain
                icon="Delete"
                :disabled="data.buttonShow.deleteDisabled"
                @click="handleDelete"
                v-hasPerm="['device:manage:delete']"
            >删除</el-button>
          </el-col>
          <!--右侧图标-->
          <el-col :offset="20" :span="1">
            <el-tooltip effect="dark" :content="data.searchShow.showSearch?'隐藏搜索':'显示搜索'" placement="top">
              <el-button circle icon="Search" @click="toggleSearch()"/>
            </el-tooltip>
            <el-tooltip effect="dark" content="刷新" placement="top">
              <el-button circle icon="Refresh" @click="getList()"/>
            </el-tooltip>
          </el-col>
        </el-row>
        <!--列表栏目-->
        <el-table v-loading="data.tableShow.loading" :data="data.tableShow.deviceList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="50" align="center"/>
          <el-table-column label="设备编号" align="center" prop="deviceId" width="175"/>
          <el-table-column label="设备名称" align="center" prop="deviceName"/>
          <el-table-column label="设备类别" align="center">
            <template #default="scope">
              {{parseCategory(scope.row.categoryId,data.searchShow.categorySelectionOption)}}
            </template>
          </el-table-column>
          <!--设备标签-->
          <el-table-column label="设备标签" prop="tagIds" align="center" width="500">
            <template #default="scope">
              <el-tag v-for="item in parseTag(scope.row.tagIds,data.tagOptions)" size="small" style="margin: 2px">
                {{item}}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="部署地址" align="center" prop="deviceAddress"/>
          <el-table-column label="部署ip" align="center" prop="deviceIp"/>
          <el-table-column label="状态" align="center" prop="status">
            <template #default="scope">
              <el-switch
                  v-model="scope.row.status"
                  active-value="0"
                  inactive-value="1"
                  @change="handleStatusChange(scope.row)"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="设备备注" prop="comment" :show-overflow-tooltip="true" width="300"/>
          <el-table-column label="创建时间" align="center" prop="createTime" width="170">
            <template #default="scope">
              <span>{{ parseTime(scope.row.createTime) }}</span>
            </template>
          </el-table-column>
          <!--操作-->
          <el-table-column label="操作" align="center" width="300" class-name="small-padding fixed-width">
            <template #default="scope">
              <el-tooltip content="修改" placement="top">
                <el-button
                    type="primary"
                    link
                    icon="Edit"
                    @click="handleUpdate(scope.row)"
                    v-hasPerm="['device:manage:update']"
                >修改</el-button>
              </el-tooltip>
              <el-tooltip content="删除" placement="top">
                <el-button
                    type="primary"
                    link
                    icon="Delete"
                    @click="handleDelete(scope.row)"
                    v-hasPerm="['device:manage:delete']"
                >删除</el-button>
              </el-tooltip>
              <!--可以加一个配置设备-->
            </template>
          </el-table-column>
        </el-table>
        <!--分页部分-->
        <div v-show="data.paginationShow.total>0" class="pagination-container">
          <el-config-provider :locale="zhCn">
            <el-pagination
                :background="true"
                :layout="data.paginationShow.layout"
                :total="data.paginationShow.total"
                :page-sizes="data.paginationShow.pageSizes"
                v-model:current-page="currentPage"
                v-model:page-size="pageSize"
            ></el-pagination>
          </el-config-provider>
        </div>

        <!--添加或修改标签弹出框-->
        <el-dialog :title="data.dialogShow.title" v-model="data.dialogShow.open" width="500px">
          <el-form ref="deviceRef" :model="data.form" :rules="data.rules" label-width="100px">
            <!--需要是树形结构
               此处prop是必须的因为要进行表单校验
            -->
            <el-form-item label="设备编号" v-if="data.dialogShow.title=='新增设备'" prop="deviceId">
              <el-tree-select
                  v-model="data.form.deviceId"
                  :data="data.dialogShow.deviceIdOptions"
                  :props="{ value: 'deviceId', label: 'deviceId', children: 'children',disabled:'disabled'}"
                  placeholder="选择设备id或输入网关id"
                  allow-create
                  filterable
                  clearable
              ></el-tree-select>
            </el-form-item>
            <el-form-item label="设备名称" prop="deviceName">
              <el-input v-model="data.form.deviceName" placeholder="请输入设备名称"/>
            </el-form-item>
            <el-form-item label="设备地址" prop="deviceAddress">
              <el-input v-model="data.form.deviceAddress" placeholder="请输入设备地址"/>
            </el-form-item>
            <!--todo 最好能选择也能输入-->
            <el-form-item label="设备IP" prop="deviceIp">
              <!--allow-create和filterable同时使用添加新项目
              -->
              <el-select
                  v-model="data.form.deviceIp"
                  placeholder="请选择或输入设备IP"
                  style="width: 170px"
                  clearable
                  allow-create
                  filterable
              >
                <el-option
                    v-for="dict in data.searchShow.ipSelectionOpton"
                    :key="dict"
                    :label="dict"
                    :value="dict"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="状态">
              <!--radio选中后,v-model绑定的值将会变成,:label的值-->
              <el-radio-group v-model="data.form.status">
                <el-radio
                    v-for="dict in data.searchShow.statusSelectOption"
                    :key="dict.value"
                    :label="dict.value"
                >{{dict.label}}</el-radio>
              </el-radio-group>
            </el-form-item>
            <!--设备类别-->
            <el-form-item label="设备类别" prop="categoryId">
              <el-select
                  v-model="data.form.categoryId"
                  placeholder="请选择设备类别"
                  style="width: 170px"
                  clearable
              >
                <el-option
                    v-for="dict in data.searchShow.categorySelectionOption"
                    :key="dict.categoryId"
                    :label="dict.categoryName"
                    :value="dict.categoryId"
                />
              </el-select>
            </el-form-item>
            <!--设备标签-->
            <el-form-item label="设备标签">
              <el-select
                  v-model="data.form.tagIds"
                  placeholder="请选择设备标签"
                  style="width: 170px"
                  clearable
                  multiple
              >
                <el-option
                    v-for="dict in data.tagOptions"
                    :key="dict.tagId"
                    :label="dict.tagName"
                    :value="dict.tagId"
                />
              </el-select>
            </el-form-item>
            <!--设备备注-->
            <el-form-item label="设备备注">
              <el-input v-model="data.form.comment" type="textarea" placeholder="请输入设备备注内容"></el-input>
            </el-form-item>

          </el-form>
          <template #footer>
            <div>
              <el-button type="primary" @click="submitForm">确 定</el-button>
              <el-button @click="cancel">取 消</el-button>
            </div>
          </template>
        </el-dialog>

      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import {computed, reactive, ref, watch} from "vue";
import {
  addDevice, delDevice,
  deviceCategoryForSearch,
  deviceIpForSearch, getDeviceByDeviceId,
  listDevice,
  tagShowByTree, updateDevice,
  updateDeviceStatusByDeviceId
} from "@/api/manage";
import {addDateRangePlus, parseTime,parseCategory,parseTag,handleDeviceTreeSelect} from "@/utils";
import zhCn from "element-plus/lib/locale/lang/zh-cn"
import {ElMessageBox} from "element-plus";
import {delUser} from "@/api/user";

//done 校验设备id    value输入的值,callback是回调 (一定要有callback())
const validateDeviceId = (rule: any, value: any, callback: any) => {
  if (!value) callback(new Error("设备ID不能为空"))
  //长度为18,输入不能重复
  if (value!=null&&value.length!==18){
    callback(new Error("设备ID长度必须为18"))
  }
  //some和find区别 (正常情况下不会有这个情况)
  let isExists = data.tableShow.deviceList.map((item:any)=>{
    return item.deviceId;
  }).some(item=>item==value);
  if (isExists) callback(new Error("设备id重复"));
  callback()
}
//done 校验设备ip合法性 (一定要有callback())
const validateDevicIp=(rule: any, value: any, callback: any) => {
  var reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
  if (!reg.test(value)){
    callback(new Error("IP地址不合法"))
  }
  callback()
}
const data=reactive({
  tagName:""as any,
  tagOptions:[],
  //提交的表单
  form:{}as any,
  //查询的参数
  queryParams:{
    pageNum:1,
    pageSize:10,
    deviceName:undefined,
    deviceAddress:undefined,
    deviceIp:undefined,
    status:undefined,
    categoryId:undefined,
    tagIds:undefined as any
  },
  rules:{
    deviceId:[{validator:validateDeviceId,trigger:"blue"}],
    deviceName:[{required:true,message:"设备名称不能为空",trigger:"blue"}],
    deviceIp:[{validator:validateDevicIp,trigger:"blue"}],
    categoryId:[{required:true,message:"设备类别不能为空",trigger:"blue"}],
  },
  //顶部搜索栏
  searchShow:{
    //日期范围
    dateRange:[],
    showSearch:true,
    //设备分类下拉框
    categorySelectionOption:[],
    //搜索部分的下拉框
    statusSelectOption:[
      {label:"正常",value:"0"},{label:"禁用",value: "1"}
    ],
    //设备ip下拉框
    ipSelectionOpton:[]
  },
  //按钮栏
  buttonShow:{
    //修改按钮选中一个才启用
    updateDisabled:true,
    //删除按钮有选中才启用
    deleteDisabled:true
  },
  //列表栏
  tableShow:{
    loading:true,
    //设备表
    deviceList:[],
    //选中的设备id
    checkedDeviceIds:[]
  },
  //分页
  paginationShow:{
    total:0,
    //分页布局
    layout:"total,sizes,prev,pager,next,jumper",
    //选择每页展示的数量
    pageSizes:[1,5,10,20,50,100],
    //展示每页多少页码按钮,移动端默认五个
    // pageCount:document.body.clientWidth<992?5:7
  },
  //弹出框
  dialogShow:{
    open:false,
    title:"",
    //设备的展开或折叠
    deviceExpand:false,
    //全选或全不选
    deviceNodeAll:false,
    //设备ID树形(不包括已使用的设备id)
    deviceIdOptions:[]
  }
})


//done 处理当前页码变化情况
const currentPage=computed({
  get(){
    return data.queryParams.pageNum
  },
  set(val){
    data.queryParams.pageNum=val
    getList()
  }
})
//done 处理每页展示数量变化操作
const pageSize=computed({
  get(){
    return data.queryParams.pageSize
  },
  set(val){
    data.queryParams.pageSize=val
    if (currentPage.value*val>data.paginationShow.total){
      currentPage.value=1
    }
    getList()
  }
})
//done 搜索按钮
const handleQuery=()=>{
  //设置页
  data.queryParams.pageNum=1;
  getList()
}
const queryRef:any=ref(null)
//done 重置按钮
const resetQuery=()=>{
  //清除日期
  data.searchShow.dateRange=[]
  //清除搜索区域
  queryRef.value.resetFields()
  handleQuery()
}
const deviceRef:any=ref(null)
//done 重置表单
const reset = () => {
  //排除devcie_image,device_active_time,deleted,两个时间
  //共14个,排除上面五个
  data.form={
    deviceId:undefined,
    deviceName:undefined,
    deviceAddress:undefined,
    deviceIp:undefined,
    status:"0",
    comment:undefined,
    categoryId:undefined,
    tagIds:undefined as any
  }
  //第一次弹窗
  if (deviceRef.value!=null){
    deviceRef.value.resetFields();
  }
}
//done 获取设备列表数据
const getList=()=>{
  data.tableShow.loading=true;
  //组装dataRange进入queryParams
  listDevice(addDateRangePlus(data.queryParams,data.searchShow.dateRange)).then(res=>{
    data.tableShow.deviceList=res.data.rows;
    data.paginationShow.total=res.data.total;
    data.tableShow.loading=false;
  })
}


const tagRef:any=ref(null)
//done 监视左侧输入框的变化
watch(()=>data.tagName,value => {
  //会将value传递给:filter-node-method作为第一个参数
  tagRef.value.filter(value)
})
//done 获取标签数据，运行了树形组件，实际返回不是树
const getTagShowByTree=()=>{
  tagShowByTree().then(res=>{
    data.tagOptions=res.data
  })
}
//done 过滤左侧
const filterNode = (value:any,row:any) => {
  //当输入框为空的时候，展示所有
  if (!value) return true;
  let checkedKeys=tagRef.value.getCheckedKeys();
  //进行字符匹配,包含返回true---或者是选中的数据也返回true
  return row.tagName.indexOf(value)!==-1||checkedKeys.indexOf(row.tagId)!==-1;
}
//done 节点点击事件，(选中复选)，查询标签数据
const handleNodeClick = (row:any) => {
  //获取所有被选中的数据
  let checkedKeys=tagRef.value.getCheckedKeys();
  let isChecked=checkedKeys.indexOf(row.tagId)===-1?false:true;
  //true设置取消选中
  if (isChecked){
    tagRef.value.setChecked(row.tagId,false,false);
  }else {
    tagRef.value.setChecked(row.tagId,true,false);
  }
}
//done 当前选中发生变化
const handleCheckChange=(a:any,b:any,c:any)=>{
  //执行一次watch变化操作
  tagRef.value.filter(data.tagName)
  //获取所有选中的key,不弄后面发送请求很难看
  data.queryParams.tagIds=tagRef.value.getCheckedKeys().length>0?tagRef.value.getCheckedKeys()+'':undefined;
  //done 点击一次后就开始查询数据
  getList();
}
//done 获取设备类型下拉菜单([{label:xxx,value:xxx},])
const getDeviceCategoryForSearch=()=>{
  deviceCategoryForSearch().then(res=>{
    data.searchShow.categorySelectionOption=res.data
  })
}
//done 获取ip地址下拉菜单
const getDeviceIpForSearch=()=>{
  deviceIpForSearch().then(res=>{
    data.searchShow.ipSelectionOpton=res.data;
  })
}
//done 复选框发生变化(el-table)
const handleSelectionChange = (selection:any) => {
  //筛选出选中按钮的id
  data.tableShow.checkedDeviceIds=selection.map((item:any)=>item.deviceId)
  //处理更新按钮
  data.buttonShow.updateDisabled=selection.length!=1
  //处理禁用按钮
  data.buttonShow.deleteDisabled=!selection.length
}

//done 增加按钮
const handleAdd = () => {
  reset();
  data.dialogShow.deviceIdOptions=handleDeviceTreeSelect(data.tableShow.deviceList)
  data.dialogShow.open=true;
  data.dialogShow.title="新增设备";
}
//done 修改按钮
const handleUpdate =(row:any) => {
  reset();
  const deviceId=row.deviceId||data.tableShow.checkedDeviceIds[0]
  getDeviceByDeviceId({deviceId:deviceId}).then(res=>{
    data.form=res.data;
    //要进行数据的转换
    data.form.tagIds=JSON.parse(data.form.tagIds)
    data.dialogShow.open=true;
    data.dialogShow.title="修改设备"
  })
}
//done 删除按钮
const handleDelete = (row:any) => {
  const deviceIds=row.deviceId||data.tableShow.checkedDeviceIds+'';
  ElMessageBox.confirm('是否删除设备编号为"'+deviceIds+'"的设备?','系统提示',{
    confirmButtonText:"确定",
    cancelButtonText:"取消",
    type:"warning"
  }).then(()=>{
    //调用删除接口
    delDevice({deviceIds:deviceIds}).then(()=>{
      getList();
      ElMessage.success("删除成功");
    })
  }).catch(()=>{})
}
const toggleSearch=()=>{
  data.searchShow.showSearch=!data.searchShow.showSearch;
}
//done 处理状态变化
const handleStatusChange=(row:any)=>{
  let text=row.status==="0"?"启用":"停用";
  ElMessageBox.confirm('确定要'+text+'"'+row.deviceName+'"设备s吗?','系统提示',{
    confirmButtonText:"确定",
    cancelButtonText:'取消',
    type:'warning'
  }).then(()=>{
    //调用后端接口,修改状态
    updateDeviceStatusByDeviceId({deviceId:row.deviceId,status:row.status}).then(()=>{
      ElMessage.success("成功")
    })
  }).catch(()=>{
    //修改回状态
    row.status=row.status==="0"?"1":"0";
  })
}
//todo 表单提交按钮
const submitForm=()=>{
  deviceRef.value.validate((valid:any)=>{
    //如果校验通过
    if (valid){
      let tempTagIds = data.form.tagIds;
      //先处理tagIds,给后端应该是字符串
      data.form.tagIds=JSON.stringify(data.form.tagIds);
      //新增设备
      if (data.dialogShow.title=="新增设备"){
        addDevice(data.form).then(res=>{
          ElMessage.success("新增成功");
          data.dialogShow.open=false;
          getList();
        }).catch(()=>{
          //如果失败的话,将参数复原
          data.form.tagIds=tempTagIds;
        })
      }else {
        //修改设备
        updateDevice(data.form).then(res=>{
          ElMessage.success("修改成功");
          data.dialogShow.open=false;
          getList();
        }).catch(()=>{
          //如果失败的话,将参数复原
          data.form.tagIds=tempTagIds;
        })
      }
    }
  })
}
//done 取消表单
const cancel=()=>{
  data.dialogShow.open=false;
  reset();
}

//获取所有标签键值对
getTagShowByTree();
//获取设备类别键值对
getDeviceCategoryForSearch()
//获取所有设备ip
getDeviceIpForSearch()
getList();
</script>

<style scoped lang="less">
//分页部分样式
.pagination-container{
  height: 36px;
  margin-bottom: 10px;
  margin-top: 15px;
  padding: 10px 20px;
  display: flex;
  justify-content: flex-end
}
/* tree border */
.tree-border {
  margin-top: 5px;
  border: 1px solid #e5e6e7;
  background: #FFFFFF none;
  border-radius:4px;
  width: 100%;
}
</style>