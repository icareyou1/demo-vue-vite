<template>
  <div style="padding: 20px">
    <el-row :gutter="20">
      <!--左侧标签数据-->
      <el-col :span="3" :xs="24">
        <!--搜索部分-->
        <div></div>
        <!--展示部分，同时展示搜索部分-->
        <div>
          <el-input
              v-model="data.tagName"
              placeholder="请输入标签名称"
              clearable
              prefix-icon="Search"
              style="margin-bottom: 20px"
          ></el-input>
        </div>
        <div>
          <el-tree
              :data="data.tagOptions"
              :props="{label:'tagName',children:'children'}"
              show-checkbox
              ref="tagRef"
              node-key="tagId"
              :filter-node-method="filterNode"
              @node-click="handleNodeClick"
              @check-change="handleCheckChange"
          />
        </div>
      </el-col>

      <!--设备数据-->
      <el-col :span="21" :xs="24">
        <!--顶部搜索栏-->
        <!--中间按钮栏-->
        <!--列表栏目-->
        <el-table v-loading="data.tableShow.loading" :data="data.tableShow.deviceList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="50" align="center"/>
          <el-table-column label="设备编号" align="center" prop="deviceId"/>
          <el-table-column label="设备名称" align="center" prop="deviceName"/>
          <el-table-column label="设备类别" align="center" prop="categoryId"/>
          <el-table-column label="部署地址" align="center" prop="deviceAddress"/>
          <el-table-column label="部署ip" align="center" prop="deviceIp"/>
          <el-table-column label="状态" align="center" prop="status">
            <template #default="scope">
              <el-switch
                  v-model="scope.row.status"
                  active-value="0"
                  inactive-value="1"
                  @change="handleStatusChange(scope.row)"
                  v-if="scope.row.userId!==10010"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="设备备注" prop="comment" :show-overflow-tooltip="true"/>
          <el-table-column label="激活时间" align="center" prop="deviceActiveTime" width="170">
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
                ></el-button>
              </el-tooltip>
              <el-tooltip content="删除" placement="top" v-if="scope.row.userId !== 10010">
                <el-button
                    type="primary"
                    link
                    icon="Delete"
                    @click="handleDelete(scope.row)"
                    v-hasPerm="['device:manage:delete']"
                ></el-button>
              </el-tooltip>
              <el-tooltip content="重置密码" placement="top" v-if="scope.row.userId !== 10010">
                <el-button
                    type="primary"
                    link
                    icon="Key"
                    @click="handleResetPassword(scope.row)"
                    v-hasPerm="['system:user:update']"
                ></el-button>
              </el-tooltip>
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
          <el-form ref="tagRef" :model="data.form" :rules="data.rules" label-width="100px">
            <el-form-item label="标签名称" prop="tagName">
              <el-input v-model="data.form.tagName" placeholder="请输入标签名称"/>
            </el-form-item>

            <el-form-item label="状态">
              <!--radio选中后,v-model绑定的值将会变成,:label的值-->
              <el-radio-group v-model="data.form.status">
                <el-radio
                    v-for="dict in data.searchShow.selectOption"
                    :key="dict.value"
                    :label="dict.value"
                >{{dict.label}}</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="标签备注">
              <el-input v-model="data.form.comment" type="textarea" placeholder="请输入标签备注内容"></el-input>
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
import {listDevice, tagShowByTree} from "@/api/manage";
import {listTag} from "@/api/tag";
import {addDateRangePlus} from "@/utils";

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
    tagIds:[]
  },
  rules:{
    deviceName:[{required:true,message:"标签名称不能为空",trigger:"blue"}],
  },
  //顶部搜索栏
  searchShow:{
    //日期范围
    dateRange:[],
    showSearch:true,
    //搜索部分的下拉框
    selectOption:[
      {label:"正常",value:"0"},{label:"禁用",value: "1"}
    ],
  },
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
    //设备列表
    deviceOptions:[]
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
//todo 重置表单
const reset = () => {
  //设备展开情况
  data.dialogShow.deviceExpand=false;
  data.dialogShow.deviceNodeAll=false;
  data.form={
    tagId:undefined,
    tagName:undefined,
    status:"0",
    deviceIds:[],
    //父子联动
    deviceCheckStrictly:true,
    comment:undefined
  }
  //第一次弹窗
  if (deviceRef.value!=null){
    deviceRef.value.resetFields();
  }
}
//done 获取标签列表数据
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
//done 节点点击事件，选中复选，查询标签数据
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
  console.log("开始查询数据")
}
//todo 复选框发生变化
const handleSelectionChange = (selection:any) => {

}

getTagShowByTree()
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