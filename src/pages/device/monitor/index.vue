<template>
  <div style="padding: 10px">
    <!--顶部标签数据-->
    <el-row :gutter="20" v-show="data.showTag">
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
    </el-row>
    <!--下部分-->
    <el-row :gutter="20">
      <!--设备列表-->
      <el-col :span="8">
        <div shadow="never" style="border: 1px solid #e4e7ed;height: 600px;border-radius: 5px 5px 0 0">
          <el-table
              :data="data.tableShow.deviceList"
              v-loading="data.tableShow.loading"
              highlight-current-row
              ref="deviceRef"
              @current-change="handleRowCurrentChange">
            <!--<el-table-column label="设备编号" align="center" prop="deviceId"/>-->
            <el-table-column label="设备名称" align="center" prop="deviceName"/>
            <el-table-column label="设备标签" prop="tagIds" align="center">
              <template #default="scope">
                <el-tag v-for="item in parseTag(scope.row.tagIds,data.tagOptions)" size="small" style="margin: 2px">
                  {{item}}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div shadow="never" style="border: 1px solid #e4e7ed;border-radius: 0 0 5px 5px">
          <!--分页部分-->
          <div v-show="data.paginationShow.total>0" class="pagination-container" style="margin: 0px">
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
        </div>

      </el-col>
      <!--设备详细信息-->
      <el-col :span="16">
        <div shadow="never" style="border: 1px solid #e4e7ed;border-radius: 5px;height: 658px;">
          <el-tabs tab-position="left" style="height: 100%">
            <el-tab-pane label="基本信息">基本信息</el-tab-pane>
            <el-tab-pane label="运行状态">运行状态</el-tab-pane>
            <el-tab-pane label="告警记录">告警记录</el-tab-pane>
            <el-tab-pane label="异常事件">异常事件</el-tab-pane>
            <el-tab-pane label="操作记录">操作记录</el-tab-pane>
            <el-tab-pane label="在线情况">在线情况</el-tab-pane>
            <el-tab-pane label="参数设置">参数设置</el-tab-pane>
          </el-tabs>
        </div>
      </el-col>
    </el-row>
    <el-button @click="toggleTagShow">展开或折叠标签栏</el-button>
  </div>
</template>

<script setup lang="ts">
import {computed, nextTick, onBeforeMount, onMounted, reactive, ref, watch} from "vue";
import {tagShowByTree} from "@/api/manage";
import {listMonitorDevice} from "@/api/monitor";
import {parseTag} from "@/utils";
import zhCn from "element-plus/lib/locale/lang/zh-cn"


const data=reactive({
  tagName:""as any,
  tagOptions:[],
  showTag:true,
  //查询的参数
  queryParams:{
    pageNum:1,
    pageSize:10,
    tagIds:undefined as any
  },
  //顶部搜索栏
  searchShow:{
  },
  //按钮栏
  buttonShow:{

  },
  //列表栏
  tableShow:{
    loading:true,
    //设备表
    deviceList:[],
  },
  //分页
  paginationShow:{
    total:0,
    //分页布局
    layout:"total,sizes,prev,pager,next",
    //选择每页展示的数量
    pageSizes:[1,5,10,20,50,100],
    //展示每页多少页码按钮,移动端默认五个
    // pageCount:document.body.clientWidth<992?5:7
  },

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
//done 获取所有设备(id,name,标签)
const getList=()=>{
  listMonitorDevice(data.queryParams).then(res=>{
    data.tableShow.deviceList=res.data.rows;
    data.paginationShow.total=res.data.total;
    data.tableShow.loading=false;
    //默认选中第一个
    selectTableFirst()
  })
}


const deviceRef:any=ref(null)
//todo 执行默认选中(要在获取数据后执行)
const selectTableFirst=()=>{
  nextTick(()=>{
    if (deviceRef.value.data) {
      deviceRef.value.setCurrentRow(deviceRef.value.data[0])
    }
  })
}
//todo  (current,pre) 此处根据当前的选中从后端获取数据
const handleRowCurrentChange = (curentRow:any) => {
  //会出现null的情况,例如进行下一页
  if (curentRow){
    console.log("!!",curentRow)
  }
}
//todo 折叠标签筛选栏目
const toggleTagShow = () => {
  console.log("@@@")
  data.showTag=!data.showTag;
}
//获取所有标签键值对
getTagShowByTree();
//获取所有设备(期间会选中第一个)
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
  justify-content: space-evenly;
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