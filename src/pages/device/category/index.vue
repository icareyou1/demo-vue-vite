<template>
  <div style="margin: 20px">
    <!--顶部搜索栏-->
    <el-form :model="data.queryParams" ref="queryRef" v-show="data.searchShow.showSearch" :inline="true">
      <el-form-item label="分类名称" prop="categoryName">
        <el-input
            v-model="data.queryParams.categoryName"
            placeholder="请输入分类名称"
            clearable
            style="width: 240px"
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select
            v-model="data.queryParams.status"
            placeholder="分类状态"
            clearable
            style="width: 240px"
        >
          <el-option
              v-for="dict in data.searchShow.selectionOption"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" style="margin-bottom: 8px">
      <el-col :span="data.buttonShow.tableSpan">
        <el-row>
          <!--按钮栏目-->
          <el-col :span="2">
            <el-button
                type="primary"
                plain
                icon="Plus"
                @click="handleAdd"
                v-hasPerm="['device:category:add']"
            >新增</el-button>
          </el-col>
          <el-col :span="2">
            <el-button
                type="success"
                plain
                icon="Edit"
                :disabled="data.buttonShow.updateDisabled"
                @click="handleUpdate"
                v-hasPerm="['device:category:update']"
            >修改</el-button>
          </el-col>
          <el-col :span="2">
            <el-button
                type="danger"
                plain
                icon="Delete"
                :disabled="data.buttonShow.deleteDisabled"
                @click="handleDelete"
                v-hasPerm="['device:category:delete']"
            >删除</el-button>
          </el-col>
          <el-col :span="2">
            <el-button
                type="info"
                plain
                icon="Sort"
                @click="toggleCategory"
            >折叠/展开类别</el-button>
          </el-col>
          <!--右侧图标-->
          <el-col :offset="14" :span="2">
            <el-tooltip effect="dark" :content="data.searchShow.showSearch?'隐藏搜索':'显示搜索'" placement="top">
              <el-button circle icon="Search" @click="toggleSearch"/>
            </el-tooltip>
            <el-tooltip effect="dark" content="刷新" placement="top">
              <el-button circle icon="Refresh" @click="getList"/>
            </el-tooltip>
          </el-col>
        </el-row>
        <!--左边为table,右边可以隐藏的设备信息-->
        <el-row :gutter="20" style="margin-bottom: 8px">
          <el-col :span="24" :xs="24">
            <!--列表栏目-->
            <el-table v-loading="data.tableShow.loading" :data="data.tableShow.categoryList" @selection-change="handleSelectionChange">
              <el-table-column type="selection" width="50" align="center"/>
              <el-table-column label="分类编号" align="center" prop="categoryId"/>
              <el-table-column label="分类名称" align="center" prop="categoryName"/>
              <el-table-column label="状态" align="center" prop="status">
                <template #default="scope">
                  <el-tag :disable-transitions="true" :type="scope.row.status==0?'':'danger'">
                    {{scope.row.status==0?'正常':'禁用'}}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="分类备注" prop="comment" :show-overflow-tooltip="true"/>
              <el-table-column label="创建时间" align="center" prop="createTime" width="170">
                <template #default="scope">
                  <span>{{parseTime(scope.row.createTime)}}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center" width="300" class-name="small-padding fixed-width">
                <template #default="scope">
                  <el-tooltip content="修改" placement="top" v-if="scope.row.userId !== 10010">
                    <el-button
                        type="primary"
                        link
                        icon="Edit"
                        @click="handleUpdate(scope.row)"
                        v-hasPerm="['system:user:update']"
                    >修改</el-button>
                  </el-tooltip>
                  <el-tooltip content="删除" placement="top" v-if="scope.row.userId !== 10010">
                    <el-button
                        type="primary"
                        link
                        icon="Delete"
                        @click="handleDelete(scope.row)"
                        v-hasPerm="['system:user:delete']"
                    >删除</el-button>
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
          </el-col>
        </el-row>
      </el-col>

      <!--右边栏目-->
      <!--可折叠分类详情-->
      <el-col :span="14" :xs="24" v-show="data.categoryShow.showCategory">
        <!--如果没有传入就是默认增加,-->
        <CategoryDetail
            :data="data.form"
            :subComponent="data.subComponent"
            @handleForm="submitForm"
            @handleCancel="cancel"
            v-if="data.subComponent.title=='新增类别'"/>
      <!--如果是标题为'SPD模块'则展示spd模块-->
        <SPD
            :data="data.form"
            :subComponent="data.subComponent"
            @handleForm="submitForm"
            @handleCancel="cancel"
            v-if="data.subComponent.title=='SPD模块'"
        />
      <!--如果标题是接地电阻模块,则展示接地电阻-->
        <Resistance
            :data="data.form"
            :subComponent="data.subComponent"
            @handleForm="submitForm"
            @handleCancel="cancel"
            v-if="data.subComponent.title=='接地电阻模块'"
        ></Resistance>
      </el-col>
    </el-row>

  </div>
</template>

<script setup lang="ts">
import {computed, reactive, ref} from "vue";
import {createAddCategory, createUpdateResistance, createUpdateSPD, parseTime} from "@/utils";
import zhCn from "element-plus/lib/locale/lang/zh-cn"
import { listCategory} from "@/api/category";
import CategoryDetail from "@/pages/device/category/CategoryDetail.vue";
import AddCategory from "@/pages/device/category/AddCategory.vue";
import {ElMessage} from "element-plus";
import SPD from "@/pages/device/category/SPD.vue";
import Resistance from "@/pages/device/category/Resistance.vue";

const checkNumber=(rule:any,value:any,callback:any)=>{
  if (value < 0||value>65535) {
    callback(new Error('输入数字不合法'))
  }else {
    callback()
  }
}
const data=reactive({
  form:{}as any,
  //搜索参数
  queryParams:{
    pageNum:1,
    pageSize:10,
    categoryName:undefined,
    status:undefined,
  },
  //搜索栏
  searchShow:{
    showSearch:true,
    //搜索部分下拉框的选择
    selectionOption:[{label:"正常",value:"0"},{label: "禁用",value: "1"}]
  },
  //按钮栏目
  buttonShow:{
    updateDisabled:true,
    deleteDisabled:true,
    tableSpan:24
  },
  //列表
  tableShow:{
    loading:true,
    categoryList:[],
    checkedCategoryIds:[]
  },
  paginationShow:{
    total:0,
    //分页布局
    layout:"total,sizes,prev,pager,next,jumper",
    //选择每页展示的数量
    pageSizes:[1,5,10,20,50,100],
    //展示多少页码,移动端默认五个
    pageCount:document.body.clientWidth<992?5:7
  },
  //设备详情
  categoryShow:{
    showCategory:false,
  },
  //subComponent
  subComponent:{
    title:"",
    formItem:[],
    rules:{}
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

//done 处理搜索栏目的查询
const handleQuery = () => {
  data.queryParams.pageNum=1;
  getList()
}

//done 搜索栏---重置按钮
const queryRef:any=ref(null);
const resetQuery = () => {
  //清除搜索栏
  queryRef.value.resetFields()
  handleQuery()
}
//done 按钮栏---隐藏/显示搜索栏el-tooltip
const toggleSearch = () => {
  data.searchShow.showSearch=!data.searchShow.showSearch
}
//todo 折叠/展开设备详情
const toggleCategory = () => {
  data.categoryShow.showCategory=!data.categoryShow.showCategory;
  //如果展示分类就改变表格占比
  if (data.categoryShow.showCategory){
    handleAdd();
  }else {
    hiddenDetailCategory()
  }
}
//todo 重置表单
const reset=()=>{
  data.form={
    categoryId:undefined,
    categoryName:undefined,
    status:"0",
    comment:undefined,
    d2000:undefined,d2001:undefined,d2002:undefined,d2003:undefined,d2004:undefined,
    d2005:undefined,d2006:undefined,d2007:undefined,d2008:undefined,d2009:undefined,
    d2010:undefined,d2011:undefined,d2012:undefined,d2013:undefined,d2014:undefined,
    d2015:undefined,d2016:undefined,d2017:undefined,d2018:undefined,d2019:undefined,
    d2020:undefined,d2021:undefined,d2022:undefined,d2023:undefined,d2024:undefined,
    d2025:undefined,d2026:undefined,d2027:undefined,d2028:undefined,d2029:undefined,
    d2030:undefined,d2031:undefined,d2032:undefined
  }
}


//todo 按钮栏----新增按钮
const handleAdd=()=>{
  reset();
  //生成组件信息
  createAddCategory(data.subComponent);
  showDetatilCategory();


}
//todo 按钮栏---修改按钮
const handleUpdate = (row:any) => {
  reset()
  if (row.categoryId==1){
    //categoryId=1说明为SPD
    createUpdateSPD(data.subComponent)
  }else if (row.categoryId==2){
    //categoryId=2说明为接地电阻
    createUpdateResistance(data.subComponent)
  }else if(row.categoryId==3){
    //categoryId=3说明为有线网关

  }else {

  }
  //处理修改按钮
  // createUpdateSPD(data.subComponent);
  showDetatilCategory();
}
//todo 按钮栏---删除按钮
const handleDelete = () => {
  console.log("删除按钮")
}
//todo 查询列表
const getList=()=>{
  //加载
  data.tableShow.loading=true;
  listCategory(data.queryParams).then(res=>{
    data.tableShow.loading=false;
    data.tableShow.categoryList=res.data.rows;
    data.paginationShow.total=res.data.total;
  })
}

//done table--选中问题
const handleSelectionChange=(selection:any)=>{
  data.tableShow.checkedCategoryIds=selection.map((item:any)=>item.categoryId);
  data.buttonShow.updateDisabled=selection.length!=1
  data.buttonShow.deleteDisabled=!selection.length
}

//todo 处理子组件handleForm事件
const submitForm=(form:any,refForm:any)=>{
  //接受子组件数据
  data.form=form
  //修改类别
  if (data.form.categoryId!=undefined){
    //数据写入成功再重置组件
    updateCategory(data.form).then(res=>{
      ElMessage.success("修改成功");
      //隐藏子栏目
      hiddenDetailCategory();
      getList();
    })
  }else{
    //新增类别
    addCategory(data.form).then(res=>{
      ElMessage.success("新增成功");
      //隐藏子栏目
      hiddenDetailCategory();
      getList();
    })
  }
}

//done 处理子组件handleCancel事件
const cancel = () => {
  //隐藏子栏目
  hiddenDetailCategory();
}
//显示子栏目
const showDetatilCategory=()=>{
  data.categoryShow.showCategory=true;
  //如果展示分类就改变表格占比
  data.buttonShow.tableSpan=10
}
//隐藏子栏目
const hiddenDetailCategory=()=>{
  data.categoryShow.showCategory=false;
  //如果展示分类就改变表格占比
  data.buttonShow.tableSpan=24;
  //销毁组件
  data.subComponent.title="";
  data.subComponent.formItem=[];
  data.subComponent.rules={};
}


getList()
</script>

<style scoped lang="less">

</style>