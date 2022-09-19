<template>
  <div style="padding: 20px">
    <!--顶部搜索栏-->
    <el-form :model="data.queryParams" ref="queryRef" v-show="data.searchShow.showSearch" :inline="true">
      <el-form-item label="角色名称" prop="roleName">
        <el-input
            v-model="data.queryParams.roleName"
            placeholder="请输入角色名称"
            clearable
            style="width: 240px"
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select
            v-model="data.queryParams.status"
            placeholder="角色状态"
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

    <!--按钮栏目-->
    <el-row :gutter="10" style="margin-bottom: 8px">
      <el-col :span="1">
        <el-button
            type="primary"
            plain
            icon="Plus"
            @click="handleAdd"
            v-hasPerm="['system:role:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1">
        <!--如果是单个选中,按钮就能使用-->
        <el-button
            type="success"
            plain
            icon="Edit"
            :disabled="data.buttonShow.updateDisabled"
            @click="handleUpdate"
            v-hasPerm="['system:role:update']"
        >修改</el-button>
      </el-col>
      <el-col :span="1">
        <!--如果有选中就能进行删除-->
        <el-button
            type="danger"
            plain
            icon="Delete"
            :disabled="data.buttonShow.deleteDisabled"
            @click="handleDelete"
            v-hasPerm="['system:role:delete']"
        >删除</el-button>
      </el-col>

      <!--右侧的图标-->
      <el-col :offset="20" :span="1">
        <!--placement: 提示出现的地方
            item:原有样式
        -->
        <el-tooltip class="item" effect="dark" :content="data.searchShow.showSearch ? '隐藏搜索' : '显示搜索'" placement="top">
          <el-button circle icon="Search" @click="toggleSearch()" />
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="刷新" placement="top">
          <el-button circle icon="Refresh" @click="getList()" />
        </el-tooltip>
      </el-col>
    </el-row>

    <!-- 表格数据 -->
    <!--selectionChange事件,当选择项发生变化时会触发该事件-->
    <el-table v-loading="data.tableShow.loading" :data="data.tableShow.roleList" @selection-change="handleSelectionChange">
      <!--设置了type=selection 则表示设置了多选框-->
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="角色编号" prop="roleId" width="120" />
      <!--show-overflow-tooltip	     当内容过长被隐藏时显示tooltip-->
      <el-table-column label="角色名称" prop="roleName" :show-overflow-tooltip="true" width="150" />
      <!--done 需要增加prop吗?
          当不显示状态时,应该不显示
      -->
      <el-table-column label="状态" align="center" width="100">
        <template #default="scope">
          <!--active-value   激活时的值
              inactive-value   失活的值
          -->
          <el-switch
              v-model="scope.row.status"
              active-value="0"
              inactive-value="1"
              @change="handleStatusChange(scope.row)"
              v-if="scope.row.roleId!=1"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="角色备注" prop="comment" :show-overflow-tooltip="true" width="250" />
      <el-table-column label="创建时间" align="center" prop="createTime">
        <template #default="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <!--此处是固定样式-->
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <!--placement 为提示出现的地方-->
          <el-tooltip content="修改" placement="top" v-if="scope.row.roleId !== 1">
            <el-button
                type="primary"
                link
                icon="Edit"
                @click="handleUpdate(scope.row)"
                v-hasPerm="['system:role:update']"
            >修改</el-button>
          </el-tooltip>

          <el-tooltip content="删除" placement="top" v-if="scope.row.roleId !== 1">
            <el-button
                type="primary"
                link
                icon="Delete"
                @click="handleDelete(scope.row)"
                v-hasPerm="['system:role:delete']"
            >删除</el-button>
          </el-tooltip>
<!--          <el-tooltip content="数据权限" placement="top" v-if="scope.row.roleId !== 1">
            <el-button
                type="primary"
                link
                icon="CircleCheck"
                @click="handleDataScope(scope.row)"
                v-hasPerm="['system:role:update']"
            >数据权限</el-button>
          </el-tooltip>-->
          <el-tooltip content="分配用户" placement="top" v-if="scope.row.roleId !== 1">
            <el-button
                type="primary"
                link
                icon="User"
                @click="handleAuthUser(scope.row)"
                v-hasPerm="['system:role:update']"
            >分配用户</el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <!--分页部分-->
    <div v-show="data.paginationShow.total>0" class="pagination-container">
      <!--
          background    是否有背景
          layout      布局
          total     总记录数
          page-sizes    选择每页展示的数量
          page-count    展示多少个页码按钮
          v-model:current-page  当前页码改变时绑定  todo  勾选复选框的时候会导致,当前页码发生变化
          v-model:page-size     当前展示页码大小绑定
          @size-change     page-size改变时触发   (过时)
          @current-change   current-page改变时触发 (过时)
      -->
      <el-config-provider :locale="zhCn">
        <el-pagination
            :background="true"
            :layout="data.paginationShow.layout"
            :total="data.paginationShow.total"
            :page-sizes="data.paginationShow.pageSizes"
             v-model:current-page="currentPage"
             v-model:page-size="pageSize"
        />
      </el-config-provider>
    </div>

    <!-- 添加或修改角色配置对话框 -->
    <el-dialog :title="data.dialogShow.title" v-model="data.dialogShow.open" width="500px">
      <el-form ref="roleRef" :model="data.form" :rules="data.rules" label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="data.form.roleName" placeholder="请输入角色名称" />
        </el-form-item>

        <el-form-item label="状态">
          <el-radio-group v-model="data.form.status">
            <el-radio
                v-for="dict in data.searchShow.selectOption"
                :key="dict.value"
                :label="dict.value"
            >{{ dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="菜单权限">
          <!--$event 将事件传递过去-->
          <el-checkbox v-model="data.dialogShow.menuExpand" @change="handleCheckedTreeExpand($event, 'menu')">展开/折叠</el-checkbox>
          <el-checkbox v-model="data.dialogShow.menuNodeAll" @change="handleCheckedTreeNodeAll($event, 'menu')">全选/全不选</el-checkbox>
          <el-checkbox v-model="data.form.menuCheckStrictly" @change="handleCheckedTreeConnect($event, 'menu')">父子联动</el-checkbox>
          <!--class 样式在下面,不添加的话会样式错误
              check-strictly  在显示复选框的情况下，是否严格的遵循父子不互相关联的做法，默认为 false
          -->
          <el-tree
              class="tree-border"
              :data="data.dialogShow.menuOptions"
              show-checkbox
              ref="menuRef"
              node-key="id"
              :check-strictly="!data.form.menuCheckStrictly"
              empty-text="加载中，请稍候"
              :props="{ label: 'label', children: 'children' }"
          ></el-tree>
        </el-form-item>

        <el-form-item label="角色备注">
          <el-input v-model="data.form.comment" type="textarea" placeholder="请输入角色备注内容"></el-input>
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 分配角色数据权限对话框 -->
<!--    <el-dialog :title="title" v-model="openDataScope" width="500px" append-to-body>
      <el-form :model="form" label-width="80px">
        <el-form-item label="角色名称">
          <el-input v-model="form.roleName" :disabled="true" />
        </el-form-item>
        <el-form-item label="权限字符">
          <el-input v-model="form.roleKey" :disabled="true" />
        </el-form-item>
        <el-form-item label="权限范围">
          <el-select v-model="form.dataScope" @change="dataScopeSelectChange">
            <el-option
                v-for="item in dataScopeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="数据权限" v-show="form.dataScope == 2">
          <el-checkbox v-model="deptExpand" @change="handleCheckedTreeExpand($event, 'dept')">展开/折叠</el-checkbox>
          <el-checkbox v-model="deptNodeAll" @change="handleCheckedTreeNodeAll($event, 'dept')">全选/全不选</el-checkbox>
          <el-checkbox v-model="form.deptCheckStrictly" @change="handleCheckedTreeConnect($event, 'dept')">父子联动</el-checkbox>
          <el-tree
              class="tree-border"
              :data="deptOptions"
              show-checkbox
              default-expand-all
              ref="deptRef"
              node-key="id"
              :check-strictly="!form.deptCheckStrictly"
              empty-text="加载中，请稍候"
              :props="{ label: 'label', children: 'children' }"
          ></el-tree>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitDataScope">确 定</el-button>
          <el-button @click="cancelDataScope">取 消</el-button>
        </div>
      </template>
    </el-dialog>-->
  </div>

</template>

<script setup lang="ts">
import {computed, nextTick, reactive, ref} from "vue";
import {parseTime,addDateRange} from "@/utils/index"
import {addRole, delRole, getRoleByRoleId, listRole, updateRole, updateRoleStatusByRoleId} from "@/api/role";
//引入vue方法,组件默认使用的是英文
import {ElConfigProvider, ElMessageBox,ElMessage} from 'element-plus'
import zhCn from "element-plus/lib/locale/lang/zh-cn"
import {treeSelect, updateRoleShowTreeSelect} from "@/api";

const data=reactive({
  form:{}as any,
  queryParams:{
    pageNum:1,
    //这个影响默认页码大小
    pageSize:10,
    roleName: undefined,
    status: undefined,
  },
  rules: {
    roleName: [{ required: true, message: "角色名称不能为空", trigger: "blur" }],
  },
  //顶部搜索部分
  searchShow:{
    //日期范围
    dateRange:[],
    showSearch:true,
    //搜索部分下拉框的选项
    selectOption:[
      {label:"正常",value:"0"},{label:"禁用",value: "1"}
    ],
  },
  //按钮栏部分
  buttonShow:{
    //选中一个的时候才启用
    updateDisabled:true,
    //有选中就启用
    deleteDisabled:true,
  },
  //列表部分
  tableShow:{
    //表格是否在加载
    loading:true,
    //角色表
    roleList:[],
    //选中的id值
    ids:[]
  },
  //分页
  paginationShow:{
    total:0,
    //分页布局
    layout:"total,sizes,prev,pager,next,jumper",
    //选择每页展示的数量
    pageSizes:[1,5,10,20,50,100],
    //展示多少页码按钮,移动端默认5个
    // pageCount:document.body.clientWidth<992?5:7
  },
  //弹出框
  dialogShow:{
    open:false,
    title:"",
    //展开或折叠
    menuExpand:false,
    //全选或全不选
    menuNodeAll:false,
    //菜单权限列表
    menuOptions:[],
    //组织展开或折叠
    orgExpand:true,
    //组织节点选中
    orgNodeAll:false,
    //组织表
    orgOptions:[]
  }
})
//done 同时会处理当前页码变化的情况
const currentPage=computed({
  get(){
    return data.queryParams.pageNum
  },
  set(val){
    data.queryParams.pageNum=val
    getList()
  }
})
//done 同时会处理 展示数量 的变化的事件
const pageSize =computed({
  get(){
    return data.queryParams.pageSize
  },
  set(val){
    data.queryParams.pageSize=val
    //如果切换后超过总数就定位当前页码为1
    if (currentPage.value*val>data.paginationShow.total){
      currentPage.value=1
    }
    getList()
  }
})

//done 查询角色列表
const getList = () => {
  data.tableShow.loading=true;
  //组装dataRange进入queryParams
  listRole(addDateRange(data.queryParams,data.searchShow.dateRange)).then(res=>{
    data.tableShow.roleList=res.data.rows;
    data.paginationShow.total=res.data.total;
    data.tableShow.loading=false;
  })
}

const menuRef:any=ref(null);
const roleRef:any=ref(null);
//done 重置新增的表单
const reset = () => {
  if (menuRef.value!=undefined){
    //设置目前选中的节点
    menuRef.value.setCheckedKeys([]);
  }
  //菜单是否展开
  data.dialogShow.menuExpand=false;
  //所有节点是否选中
  data.dialogShow.menuNodeAll=false;
  data.dialogShow.orgExpand=true;
  data.dialogShow.orgNodeAll=false;
  data.form={
    roleId:undefined,
    roleName:undefined,
    status:"0",
    menuIds:[],
    orgIds:[],
    //父子联动,数据库没有设计,就不用处理了
    menuCheckStrictly:true,
    //父子联动,同上
    orgCheckStrickly:true,
    comment:undefined
  }
  //第一个弹窗还没加载出来
  if (roleRef.value!==null){
    roleRef.value.resetFields();
  }
}

//done 顶部搜索栏 搜索按钮
const handleQuery=()=>{
  //此处是有必要的,如果在某一页查询,就会出现问题
  data.queryParams.pageNum=1;
  getList()
}

const queryRef:any=ref(null);
//done 顶部搜索框   重置按钮
const resetQuery = () => {
  //清除日期,否则清除不掉
  data.searchShow.dateRange=[]
  //清除的是el-form-item
  queryRef.value.resetFields()
  handleQuery()
}
//done 多选框选中数据(下一页的时候多选框选中改变了,所以每次翻页都会重置ids)
const handleSelectionChange = (selection:any) => {
  //map函数将返回值组成新的数组
  //修改ids会导致读取currentPage
  data.tableShow.ids=selection.map((item:any)=>item.roleId)
  // 选中数量为1才启用,其他就禁用   true为禁用
  data.buttonShow.updateDisabled=selection.length!=1
  // 有选中就启用,其他就禁用   true为禁用
  data.buttonShow.deleteDisabled=!selection.length
}
//done 处理角色状态修改
const handleStatusChange = (row:any) => {
  let text=row.status==="0"?"启用":"停用";
  ElMessageBox.confirm("确定要"+text+'"'+row.roleName+'"'+"角色吗?",'系统提示',{
    confirmButtonText:'确定',
    cancelButtonText:'取消',
    type:'warning'
  }).then(()=>{
    //调用后端接口
    updateRoleStatusByRoleId({roleId:row.roleId,status:row.status}).then(()=>{
      ElMessage.success(text+"成功");
    })
  }).catch(()=>{
    //返回原样
    row.status=row.status==="0"?"1":"0";
  })
}
//done 增加角色
const handleAdd = (row:any) => {
  reset();
  //查询菜单树结构
  treeSelect().then(res=>{
    data.dialogShow.menuOptions=res.data;
  })
  data.dialogShow.open=true;
  data.dialogShow.title="添加角色";
}
//done 修改角色
const handleUpdate = (row:any) => {
  reset()
  //data.table.ids 虽然定义为数组,但是只有一个值的时候按钮才有效
  const roleId=row.roleId||data.tableShow.ids[0];
  const roleMenu=getUpdateRoleShowTreeSelect({roleId:roleId});
  //根据角色id获取角色
  getRoleByRoleId({roleId:roleId}).then(res=>{
    //reset后的表单被覆盖,后端没有传递父子联动
    let temp=res.data;
    //手动传递父子联动默认为true
    temp.menuCheckStrictly=true;
    //返回改造后的数据
    data.form=temp;
    data.dialogShow.open=true;
    nextTick(()=>{
      roleMenu.then((res)=>{
        let checkedKeys=res.data.checkedKeys;
        checkedKeys.forEach((v:any)=>{
          nextTick(()=>{
            //todo  1. 要选中的节点的 key 或者数据 2. 一个布尔类型参数表明是否选中. 3. 一个布尔类型参数表明是否递归选中子节点
            menuRef.value.setChecked(v,true,false);
          })
        })
      })
    })
    data.dialogShow.title="修改角色"
  })
}
//done 根据roleId查询菜单,其实就是进行回显
const getUpdateRoleShowTreeSelect=(roleId:any)=>{
  return updateRoleShowTreeSelect(roleId).then(res=>{
    //返回的就是菜单
    data.dialogShow.menuOptions=res.data.roleMenus;
    return res;
  })
}

//done 删除角色
const handleDelete = (row:any) => {
  //axios不能传递数组,所有要有点小手脚, roleIds=1,2,3 相当于 roleIds=1&roleIds=2
  const roleIds=row.roleId||data.tableShow.ids+'';
  ElMessageBox.confirm('是否确认删除角色编号为"' + roleIds + '"的数据项?','系统提示',{
    confirmButtonText:"确定",
    cancelButtonText:"取消",
    type:"warning"
  }).then(()=>{
    //调用删除接口
    delRole({roleIds:roleIds}).then(()=>{
      getList();
      ElMessage.success("删除成功");
    })
  }).catch(()=>{})
}
//done 按钮栏   隐藏搜索框
const toggleSearch=()=>{
  data.searchShow.showSearch=!data.searchShow.showSearch
}
//todo 分配数据权限操作,暂时去除这个功能
/*const handleDataScope = (row:any) => {
  console.log("分配数据权限操作",row.roleId)
}*/
//todo 分配用户
const handleAuthUser = (row:any) => {
  console.log("分配用户")
}

//done 树形列表处  展开/折叠
const handleCheckedTreeExpand = (value:any,type:any) => {

  // console.log("@@",data.dialogShow.menuOptions)
  if (type=="menu"){
    //获取所有的节点    nodesMap实际好像是个对象
    let map=menuRef.value.store.nodesMap;
    //不适合用若依的方法,因为后端接口返回只有顶层菜单,效果是只能折叠顶层菜单
    Object.keys(map).forEach((key:any)=>{
      map[key].expanded=value;
    })
  }else if (type=="org"){
    let map=roleRef.value.store.nodesMap;
    Object.keys(map).forEach((key:any)=>{
      map[key].expanded=value;
    })
  }
}
//done 树形列表处   全选/全不选
const handleCheckedTreeNodeAll = (value:any,type:any) => {
  if (type=="menu"){
    //当value为true时,全部选中    menuOptions是在打开时,会从接口获取
    menuRef.value.setCheckedNodes(value?data.dialogShow.menuOptions:[])
  }else if (type=="org"){
    roleRef.value.setCheckedNodes(value?data.dialogShow.orgOptions:[])
  }
}
//done 树形列表处   父子联动
const handleCheckedTreeConnect = (value:any,type:any) => {
  if (type=="menu"){
    data.form.menuCheckStrictly=value
  }else if (type="org"){
    data.form.orgCheckStrickly=value
  }
}

//done 获取所有选中菜单节点数据id
const getMenuAllCheckedKeys=()=>{
  //目前被选中的菜单节点
  let checkedKeys=menuRef.value.getCheckedKeys();
  //半选中的菜单节点
  let halfCheckedKeys=menuRef.value.getHalfCheckedKeys();
  //在checkedKeys基础上移除halfCheckedKeys   使用push则为添加
  checkedKeys.unshift.apply(checkedKeys,halfCheckedKeys);
  return checkedKeys
}

//done 弹出框的提交按钮
const submitForm = () => {
  roleRef.value.validate((valid:any)=>{
    if (valid){
      //有id说明是修改
      if (data.form.roleId!=undefined){
        //获取所有选中的菜单id
        data.form.menuIds=getMenuAllCheckedKeys();
        updateRole(data.form).then(res=>{
          ElMessage.success("修改成功");
          data.dialogShow.open=false;
          getList();
        })
      }else {
        data.form.menuIds=getMenuAllCheckedKeys();
        addRole(data.form).then(res=>{
          ElMessage.success("新增成功");
          data.dialogShow.open=false;
          getList();
        })
      }
    }
  })
}
//done 弹出框的取消按钮
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