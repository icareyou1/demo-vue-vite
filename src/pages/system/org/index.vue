<template>
<div style="margin: 20px">
  <!--顶部搜索栏
    inline:为行内表单样式
    这个表单没有使用rule,所有表单项的prop不生效
  -->
  <el-form :model="data.queryParams" ref="queryRef" :inline="true" v-show="data.showSearch">
    <el-form-item label="组织名称" prop="orgName">
      <el-input
          v-model="data.queryParams.orgName"
          placeholder="请输入组织名称"
          clearable
          @keyup.enter="handleQuery"
      />
    </el-form-item>
    <el-form-item label="状态" prop="status">
      <el-select v-model="data.queryParams.status" placeholder="组织状态" clearable>
        <el-option
            v-for="dict in data.selectOption"
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

  <!--表单上的新增折叠等按钮-->
  <el-row :gutter="10" style="margin-bottom: 8px">
    <el-col :span="1">
      <!--plain是否为简单按钮-->
      <el-button
          type="primary"
          plain
          icon="Plus"
          @click="handleAdd"
          v-hasPerm="['system:org:add']"
      >新增</el-button>
    </el-col>
    <el-col :span="1">
      <el-button
          type="info"
          plain
          icon="Sort"
          @click="toggleExpandAll"
      >展开/折叠</el-button>
    </el-col>
    <!--右侧的图标-->
    <el-col :offset="21" :span="1">
      <!--
          placement: 提示出现的地方
      -->
      <el-tooltip class="item" effect="dark" :content="data.showSearch ? '隐藏搜索' : '显示搜索'" placement="top">
        <el-button circle icon="Search" @click="toggleSearch()" />
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="刷新" placement="top">
        <el-button circle icon="Refresh" @click="getList()" />
      </el-tooltip>
    </el-col>

  </el-row>

  <!--表单展示-->
  <!--
  row-key :行数据的 Key，用来优化 Table 的渲染
  default-expand-all	是否默认展开所有行，当 Table 包含展开行存在或者为树形表格时有效
  tree-props	渲染嵌套数据的配置选项
  -->
  <el-table
      v-if="data.tableShow.refreshTable"
      v-loading="data.tableShow.loading"
      :data="data.tableShow.orgList"
      row-key="orgId"
      :default-expand-all="data.tableShow.isExpandAll"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
  >
    <el-table-column prop="orgName" label="组织名称"></el-table-column>
    <el-table-column prop="leader" label="负责人"></el-table-column>
    <el-table-column prop="phoneNumber" label="联系电话"></el-table-column>
    <el-table-column prop="email" label="邮箱"></el-table-column>

    <el-table-column prop="status" label="状态" width="100">
      <template #default="scope">
        <!--
              disable-transitions   禁用渐变动画
              type  类型
        -->
        <el-tag :disable-transitions="true" :type="scope.row.status==0 ? '':'danger' ">{{scope.row.status==0?'正常':'禁用'}}</el-tag>
      </template>
    </el-table-column>
    <el-table-column label="组织备注" prop="comment" width="500" :show-overflow-tooltip="true"/>
    <el-table-column label="创建时间" align="center" prop="createTime" width="200">
      <template #default="scope">
        <span>{{ parseTime(scope.row.createTime) }}</span>
      </template>
    </el-table-column>
    <!-- class-name列的 className-->
    <el-table-column label="操作" width="300" align="center">
      <template #default="scope">
        <el-button
            type="primary"
            link
            icon="Edit"
            @click="handleUpdate(scope.row)"
            v-hasPerm="['system:org:update']"
        >修改</el-button>
        <el-button
            type="primary"
            link
            icon="Plus"
            @click="handleAdd(scope.row)"
            v-hasPerm="['system:org:add']"
        >新增</el-button>
        <el-button
            v-if="scope.row.parentId != 0"
            type="primary"
            link
            icon="Delete"
            @click="handleDelete(scope.row)"
            v-hasPerm="['system:org:delete']"
        >删除</el-button>
      </template>
    </el-table-column>
  </el-table>

  <!-- 添加或修改组织对话框 -->
  <!--
      title:对话框的名字
      v-model:是否显示dialog
      append-to-body        Dialog 自身是否插入至 body 元素上
  -->
  <el-dialog :title="data.dialogShow.title" v-model="data.dialogShow.open" width="600px">
    <el-form ref="orgRef" :model="data.form" :rules="data.rules" label-width="80px">
      <el-row>
        <!--当parent不为0时,展示上级组织这个选项-->
        <el-col :span="24" v-if="data.form.parentId !== 0">
          <el-form-item label="上级组织" prop="parentId">
            <!--todo el-tree-select-->
            <!--
                data 展示数据,类型为数组
                props 配置  value:真实的值    label:展示出来的值   children:指定子树为节点对象的某个属性   disabled:禁用
            -->
            <el-tree-select
                v-model="data.form.parentId"
                :data="data.dialogShow.orgOptions"
                :props="{ value: 'orgId', label: 'orgName', children: 'children'}"
                value-key="orgId"
                placeholder="选择上级组织"
                check-strictly
            />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="组织名称" prop="orgName">
            <el-input v-model="data.form.orgName" placeholder="请输入组织名称" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="负责人" prop="leader">
            <el-input v-model="data.form.leader" placeholder="请输入负责人" maxlength="20" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="联系电话" prop="phoneNumber">
            <el-input v-model="data.form.phoneNumber" placeholder="请输入联系电话" maxlength="11" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="data.form.email" placeholder="请输入邮箱" maxlength="50" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="组织状态">
            <el-radio-group v-model="data.form.status">
              <el-radio
                  v-for="dict in data.selectOption"
                  :key="dict.value"
                  :label="dict.value"
              >{{ dict.label }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="组织备注">
            <el-input v-model="data.form.comment" type="textarea" placeholder="请输入组织备注内容"></el-input>
          </el-form-item>
        </el-col>

      </el-row>
    </el-form>
    <template #footer>
      <!--el-dialog默认样式-->
      <div class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </template>
  </el-dialog>

</div>
</template>

<script setup lang="ts">
import {nextTick, reactive, ref} from "vue";
import {listOrg, updateOrg, addOrg, listOrgExcludeChild, getOrgByOrgId,deleteOrgByOrgId} from "@/api/org";
import {handleTree,parseTime} from "@/utils/index"
import {ElMessage} from "element-plus";
const data = reactive({
  form: {} as any,
  queryParams: {
    orgName: undefined,
    status: undefined
  },
  rules: {
    parentId: [{ required: true, message: "上级组织不能为空", trigger: "blur" }],
    orgName: [{ required: true, message: "组织名称不能为空", trigger: "blur" }],
    // orderNum: [{ required: true, message: "显示排序不能为空", trigger: "blur" }],
    email: [{ type: "email", message: "请输入正确的邮箱地址", trigger: ["blur", "change"] }],
    phoneNumber: [{ pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/, message: "请输入正确的手机号码", trigger: "blur" }]
  },
  //搜索部分下拉框的选项
  selectOption:[
    {label:"正常",value:"0"},{label:"禁用",value: "1"}
  ],
  //顶部搜索框是否展示
  showSearch:true,
  //中间的表单部分
  tableShow:{
    //展开或折叠 操作表格
    refreshTable:true,
    //表格是否在加载
    loading:true,
    //是否展开全部
    isExpandAll:true,
    //组织表数据
    orgList:[]
  },
  //弹出框部分
  dialogShow:{
    open:false,
    title:"",
    orgOptions:[]
  }
});

/** 查询组织列表 */
const getList=()=>{
  data.tableShow.loading = true;
  listOrg(data.queryParams).then(res => {
    data.tableShow.orgList=handleTree(res.data,"orgId") as any;
    data.tableShow.loading = false;
  });
}
const orgRef:any=ref(null)
/** 表单重置 */
const reset=()=>{
  data.form = {
    orgId: undefined,
    parentId: undefined,
    orgName: undefined,
    leader: undefined,
    phoneNumber: undefined,
    email: undefined,
    status: "0"
  };
  //todo 重置弹出框中的表单
  if (orgRef.value!==null){
    orgRef.value.resetFields()
  }
}

/** 搜索按钮操作 */
const handleQuery=()=>{
  getList();
}
const queryRef:any=ref(null)
/** 重置按钮操作 */
const resetQuery=()=>{
  //调用表单的方法
  queryRef.value.resetFields();
  handleQuery();
}
/** 修改按钮操作 */
const handleUpdate=(row:any)=>{
  reset();
  //查询出父组织
  listOrgExcludeChild({orgId:row.orgId}).then(res => {
    data.dialogShow.orgOptions = handleTree(res.data, "orgtId") as any;
  });
  getOrgByOrgId({orgId:row.orgId}).then(res=>{
    data.form=res.data;
    data.dialogShow.open=true;
    data.dialogShow.title="修改部门"
  })
}
/** 新增按钮操作 */
const handleAdd=(row:any)=>{
  reset();
  listOrg().then(res => {
    data.dialogShow.orgOptions = handleTree(res.data, "orgId") as any;
    console.log("@@",data.dialogShow.orgOptions)
  });
  // 在当前行下添加子组织,所有得将orgId付给,新创得父id
  if (row != undefined) {
    data.form.parentId= row.orgId;
  }
  data.dialogShow.open = true;
  data.dialogShow.title = "添加组织";
}
/** 删除按钮操作 */
const handleDelete=(row:any)=>{
  ElMessageBox.confirm('是否确认删除名称为"' + row.deptName + '"的数据项?', '系统提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
  ).then(()=>{
    return deleteOrgByOrgId({orgId:row.orgId})
    }).then(()=>{
      getList();
      ElMessage.success("删除成功")
  }).catch(()=>{
  })
}

/** 展开/折叠操作 */
const toggleExpandAll=()=>{
  data.tableShow.refreshTable = false;
  data.tableShow.isExpandAll= !data.tableShow.isExpandAll;
  //todo 什么时nextTick
  nextTick(()=>{
    data.tableShow.refreshTable=true
  })
}
/**
 * 隐藏/显示搜索栏
 */
const toggleSearch=()=>{
  data.showSearch=!data.showSearch
}

/** 弹出框 提交按钮 */
const submitForm=()=>{
  orgRef.value.validate((valid:any)=>{
    //如果校验通过
    if(valid){
      //如果表单中有orgId,在已有基础上修改
      if (data.form.orgId!=undefined){
        updateOrg(data.form).then(res=>{
          ElMessage.success("修改成功")
          data.dialogShow.open=false;
          getList()
        })
      }else {
        addOrg(data.form).then(res=>{
          ElMessage.success("新增成功")
          data.dialogShow.open=false;
          getList()
        })
      }
    }
  });
}
/** 弹出框   取消按钮 */
const cancel=()=>{
  data.dialogShow.open = false;
  reset();
}

//初始化查询
getList()

</script>

<style scoped lang="less">

</style>