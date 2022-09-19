<template>
  <div style="padding: 20px">
    <!--顶部搜索栏-->
    <el-form :model="data.queryParams" ref="queryRef" v-show="data.searchShow.showSearch" :inline="true">
      <el-form-item label="标签名称" prop="tagName">
        <el-input
            v-model="data.queryParams.tagName"
            placeholder="请输入标签名称"
            clearable
            style="width: 240px"
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select
            v-model="data.queryParams.status"
            placeholder="标签状态"
            clearable
            style="width: 240px"
        >
          <el-option
              v-for="dict in data.searchShow.selectOption"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间" style="width: 308px">
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

    <!--按钮栏-->
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

    <!--表格数据-->
    <el-table v-loading="data.tableShow.loading" :data="data.tableShow.tagList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="标签编号" prop="tagId" width="120"/>
      <el-table-column label="标签名称" prop="tagName" :show-overflow-tooltip="true" width="150"/>
      <el-table-column label="状态" align="center" width="100">
        <template #default="scope">
          <el-switch
              v-model="scope.row.status"
              active-value="0"
              inactive-value="1"
              @change="handleStatusChange(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="标签备注" prop="comment" :show-overflow-tooltip="true" width="250"/>
      <el-table-column label="创建时间" align="center">
        <template #default="scope">
          <span>{{parseTime(scope.row.createTime)}}</span>
        </template>
      </el-table-column>
      <!--固定样式-->
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
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

          <el-tooltip content="标记设备" placement="top">
            <el-button
                type="primary"
                link
                icon="User"
                @click="handleTagDevice(scope.row)"
                v-hasPerm="['device:manage:update']"
            >标记设备</el-button>
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
    <!--标签分配弹出框-->
  </div>
</template>

<script setup lang="ts">
import {computed, reactive, ref} from "vue";
import {addDateRangePlus, parseTime} from "@/utils";
import zhCn from "element-plus/lib/locale/lang/zh-cn"
import {addTag, delTag, getTagByTagId, listTag, updateTag, updateTagStatusByTagId} from "@/api/tag";
import {ElMessageBox} from "element-plus";

const data=reactive({
  //提交的表单
  form:{}as any,
  //查询的参数
  queryParams:{
    pageNum:1,
    pageSize:10,
    tagName:undefined,
    status:undefined
  },
  rules:{
    tagName:[{required:true,message:"标签名称不能为空",trigger:"blue"}],
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
  //按钮栏部分
  buttonShow:{
    //修改按钮选中一个才启用
    updateDisabled:true,
    //删除按钮有选中才启用
    deleteDisabled:true
  },
  //列表部分
  tableShow:{
    //表格是否在加载
    loading:false,
    //标签表
    tagList:[],
    //选中的id值
    checkedTagIds:[]
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
const tagRef:any=ref(null)
const deviceRef:any=ref(null)
//todo 重置表单
const reset = () => {
  if (deviceRef.value!=undefined){
    //所有选中的设备
    deviceRef.value.setCheckedKeys([]);
  }
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
  if (tagRef.value!=null){
    tagRef.value.resetFields();
  }
}
//done 获取标签列表数据
const getList=()=>{
  data.tableShow.loading=true;
  //组装dataRange进入queryParams
  listTag(addDateRangePlus(data.queryParams,data.searchShow.dateRange)).then(res=>{
    data.tableShow.tagList=res.data.rows;
    data.paginationShow.total=res.data.total;
    data.tableShow.loading=false;
  })
}
//done 新增按钮
const handleAdd=(row:any)=>{
  reset();
  data.dialogShow.open=true;
  data.dialogShow.title="添加标签";
}
//done 修改按钮
const handleUpdate=(row:any)=>{
  reset()
  const tagId=row.tagId||data.tableShow.checkedTagIds[0];
  //根据tagId获取回显数据
  getTagByTagId({tagId:tagId}).then(res=>{
    //返回改造后的数据
    data.form=res.data;
    data.dialogShow.open=true;
    data.dialogShow.title="修改标签";
  })
}
//done 删除按钮
const handleDelete=(row:any)=>{
  const tagIds=row.tagId||data.tableShow.checkedTagIds+'';
  ElMessageBox.confirm('是否确认删除标签编号为"'+tagIds+'"的数据?','系统提示',{
    confirmButtonText:"确定",
    cancelButtonText:"取消",
    type:"warning"
  }).then(()=>{
    //调用删除接口
    delTag({tagIds:tagIds}).then(()=>{
      getList();
      ElMessage.success("删除成功");
    })
  }).catch(()=>{})
}
//done 隐藏/展示搜索栏
const toggleSearch=()=>{
  data.searchShow.showSearch=!data.searchShow.showSearch
}
//done 处理复选框
const handleSelectionChange=(selection:any)=>{
  //筛选出选中按钮的id
  data.tableShow.checkedTagIds=selection.map((item:any)=>item.tagId)
  //处理更新按钮
  data.buttonShow.updateDisabled=selection.length!=1
  //处理禁用按钮
  data.buttonShow.deleteDisabled=!selection.length
}
//done 更改标签状态
const handleStatusChange=(row:any)=>{
  let text=row.status==="0"?"启用":"停用";
  ElMessageBox.confirm('确定要'+text+'"'+row.tagName+'"标签吗?','系统提示',{
    confirmButtonText:"确定",
    cancelButtonText:'取消',
    type:'warning'
  }).then(()=>{
    //调用后端接口,修改状态
    updateTagStatusByTagId({tagId:row.tagId,status:row.status}).then(()=>{
      ElMessage.success("成功")
    })
  }).catch(()=>{
    //修改回状态
    row.status=row.status==="0"?"1":"0";
  })
}
//todo 标记设备
const handleTagDevice=(row:any)=>{
  console.log("标记设备")
}
//todo 提交表单
const submitForm=()=>{
  tagRef.value.validate((valid:any)=>{
    if (valid){
      //有id说明是修改
      if (data.form.tagId!=undefined){
        //修改标签
        updateTag(data.form).then(res=>{
          ElMessage.success("修改成功");
          data.dialogShow.open=false;
          getList();
        })
      }else {
        addTag(data.form).then(res=>{
          ElMessage.success("新增成功");
          data.dialogShow.open=false;
          getList()
        })
      }
    }
  })
}
//done 弹出框取消按钮
const cancel = () => {
  data.dialogShow.open=false;
  reset();
}

getList()
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