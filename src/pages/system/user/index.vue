<template>
  <div style="padding: 20px">
    <el-row :gutter="20">

      <!--组织数据-->
      <el-col :span="4" :xs="24">
        <div class="head-container">
          <el-input
              v-model="data.left.orgName"
              placeholder="请输入组织名称"
              clearable
              prefix-icon="Search"
              style="margin-bottom: 20px"
          />
        </div>
        <div class="head-container" >
          <!--
              @node-click           当节点被点击的时候触发
              highlight-current     是否高亮显示当前选中节点
              default-expand-all    是否默认展开所有节点
              expand-on-click-node  是否在点击节点时候展开或缩放节点,默认为true;当为false时,点击箭头才有效
              filter-node-method    对树节点进行筛选时执行方法,返回false表示节点会被隐藏
          -->
          <el-tree
              :data="data.left.orgOptions"
              :props="{ label: 'orgName', children: 'children' }"
              :expand-on-click-node="false"
              :filter-node-method="filterNode"
              ref="orgTreeRef"
              highlight-current
              default-expand-all
              @node-click="handleNodeClick"
          />
        </div>
      </el-col>
      <!--==============================================-->
      <!--用户数据-->
      <el-col :span="20" :xs="24">
        <!--顶部搜索栏-->
        <el-form :model="data.queryParams" ref="queryRef" :inline="true" v-show="data.right.searchShow.showSearch" label-width="68px">
          <el-form-item label="用户名称" prop="userName">
            <el-input
                v-model="data.queryParams.userName"
                placeholder="请输入用户名称"
                clearable
                style="width: 240px"
                @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="手机号码" prop="phoneNumber">
            <el-input
                v-model="data.queryParams.phoneNumber"
                placeholder="请输入手机号码"
                clearable
                style="width: 240px"
                @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="性别" prop="gender">
            <el-select
                v-model="data.queryParams.gender"
                placeholder="用户性别"
                clearable
                style="width: 220px"
            >
              <el-option
                  v-for="dict in data.right.searchShow.genderSelectionOption"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select
                v-model="data.queryParams.status"
                placeholder="用户状态"
                clearable
                style="width: 220px"
            >
              <el-option
                  v-for="dict in data.right.searchShow.statusSelectOption"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="创建时间" style="width: 308px;">
            <el-date-picker
                v-model="data.right.searchShow.dateRange"
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
        <el-row :gutter="10" class="mb8">
          <el-col :span="1">
            <el-button
                type="primary"
                plain
                icon="Plus"
                @click="handleAdd"
                v-hasPerm="['system:user:add']"
            >新增</el-button>
          </el-col>
          <el-col :span="1">
            <el-button
                type="success"
                plain
                icon="Edit"
                :disabled="data.right.buttonShow.updateDisabled"
                @click="handleUpdate"
                v-hasPerm="['system:user:update']"
            >修改</el-button>
          </el-col>
          <el-col :span="1">
            <el-button
                type="danger"
                plain
                icon="Delete"
                :disabled="data.right.buttonShow.deleteDisabled"
                @click="handleDelete"
                v-hasPerm="['system:user:delete']"
            >删除</el-button>
          </el-col>

          <!--右侧的图标-->
          <el-col :offset="19" :span="2">
            <!--placement: 提示出现的地方-->
            <el-tooltip class="item" effect="dark" :content="data.right.searchShow.showSearch ? '隐藏搜索' : '显示搜索'" placement="top">
              <el-button circle icon="Search" @click="toggleSearch()" />
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="刷新" placement="top">
              <el-button circle icon="Refresh" @click="getList()" />
            </el-tooltip>
          </el-col>
        </el-row>
        <!--列表栏目-->
        <el-table v-loading="data.right.tableShow.loading" :data="data.right.tableShow.userList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column label="用户编号" align="center" prop="userId"/>
          <el-table-column label="用户名称" align="center" prop="userName"/>
          <el-table-column label="用户昵称" align="center" prop="nickName"/>
          <el-table-column label="性别" align="center">
            <template #default="scope">
              {{scope.row.gender=="0"?"男":(scope.row.gender=="1"?"女":"")}}
            </template>
          </el-table-column>
          <el-table-column label="组织" align="center" prop="sysOrg.orgName"/>
          <el-table-column label="手机号码" align="center" prop="phoneNumber" width="120" />
          <el-table-column label="状态" align="center">
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
          <el-table-column label="用户备注" prop="comment" :show-overflow-tooltip="true"/>
          <el-table-column label="创建时间" align="center" prop="createTime" width="170">
            <template #default="scope">
              <span>{{ parseTime(scope.row.createTime) }}</span>
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
              <el-tooltip content="重置密码" placement="top" v-if="scope.row.userId !== 10010">
                <el-button
                    type="primary"
                    link
                    icon="Key"
                    @click="handleResetPassword(scope.row)"
                    v-hasPerm="['system:user:update']"
                >重置密码</el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <!--分页部分-->
        <div v-show="data.right.paginationShow.total>0" class="pagination-container">
          <el-config-provider :locale="zhCn">
            <el-pagination
                :background="true"
                :layout="data.right.paginationShow.layout"
                :total="data.right.paginationShow.total"
                :page-sizes="data.right.paginationShow.pageSizes"
                v-model:current-page="currentPage"
                v-model:page-size="pageSize"
            ></el-pagination>
          </el-config-provider>
        </div>
      <!--  添加用户或修改用户对话框-->
        <el-dialog :title="data.right.dialogShow.title" v-model="data.right.dialogShow.open" width="600px">
          <el-form :model="data.form" :rules="data.right.rules" ref="userRef" label-width="80px">
            <el-row>
              <el-col :span="12">
                <el-form-item label="用户昵称" prop="nickName">
                  <el-input v-model="data.form.nickName" placeholder="请输入用户昵称" maxlength="30" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="归属组织">
                  <!--check-strickly在复选框中使用,默认false-->
                  <!--clearable不要开放,会变null-->
                  <el-tree-select
                      v-model="data.form.orgId"
                      :data="data.left.orgOptions"
                      :props="{ value: 'orgId', label: 'orgName', children: 'children' ,}"
                      value-key="orgId"
                      placeholder="请选择归属组织"
                      check-strictly
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="手机号码" prop="phoneNumber">
                  <el-input v-model="data.form.phoneNumber" placeholder="请输入手机号码" maxlength="11" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="邮箱" prop="email">
                  <el-input v-model="data.form.email" placeholder="请输入邮箱" maxlength="50" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item v-if="data.form.userId == undefined" label="用户名称" prop="userName">
                  <el-input v-model="data.form.userName" placeholder="请输入用户名称" maxlength="30" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item v-if="data.form.userId == undefined" label="用户密码" prop="password">
                  <el-input v-model="data.form.password" placeholder="请输入用户密码" type="password" maxlength="20" show-password />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="用户性别">
                  <el-select v-model="data.form.gender" placeholder="请选择">
                    <el-option
                        v-for="dict in data.right.searchShow.genderSelectionOption"
                        :key="dict.value"
                        :label="dict.label"
                        :value="dict.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="状态">
                  <el-radio-group v-model="data.form.status">
                    <el-radio
                        v-for="dict in data.right.searchShow.statusSelectOption"
                        :key="dict.value"
                        :label="dict.value"
                    >{{ dict.label }}</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="角色">
                  <el-select v-model="data.form.roleId"  placeholder="请选择">
                    <el-option
                        v-for="item in data.right.dialogShow.roleOptions"
                        :key="item.roleId"
                        :label="item.roleName"
                        :value="item.roleId"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="备注">
                  <el-input v-model="data.form.comment" type="textarea" placeholder="请输入内容"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <template #footer>
            <div class="dialog-footer">
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
import {computed, reactive, ref, watch,} from "vue";
import {
  addUser, delUser,
  getRolesForAddUser,
  getUserByUserId,
  listUser,
  orgTreeSelect, resetUserPassword, updateUser,
  updateUserStatusByUserId
} from "@/api/user";
import {addDateRangePlus,parseTime} from "@/utils";
import {ElMessageBox} from "element-plus";
import zhCn from "element-plus/lib/locale/lang/zh-cn"

const data=reactive({
  form:{}as any,
  queryParams:{
    pageNum:1,
    pageSize:10,
    userName: undefined,
    phoneNumber:undefined,
    gender:undefined,
    status: undefined,
    orgId:undefined
  },
  //左部分数据
  left:{
    orgName:"" as any,
    orgOptions:[]
  },
  //===========================
  //右部分数据
  right:{
    rules: {
      userName: [{ required: true, message: "用户名称不能为空", trigger: "blur" }, { min: 2, max: 20, message: "用户名称长度必须介于 2 和 20 之间", trigger: "blur" }],
      nickName: [{ required: true, message: "用户昵称不能为空", trigger: "blur" }],
      password: [{ required: true, message: "用户密码不能为空", trigger: "blur" }, { min: 4, max: 20, message: "用户密码长度必须介于 5 和 20 之间", trigger: "blur" }],
      email: [{ type: "email", message: "请输入正确的邮箱地址", trigger: ["blur", "change"] }],
      phoneNumber: [{ pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/, message: "请输入正确的手机号码", trigger: "blur" }]
    },
    //顶部搜索部分
    searchShow:{
      //日期范围
      dateRange:[],
      showSearch:true,
      //搜索部分状态下拉框
      statusSelectOption:[
        {label:"正常",value:"0"},{label:"禁用",value: "1"}
      ],
      //搜索部分性别下拉框
      genderSelectionOption:[
        {label:"男",value:"0"},{label:"女",value:"1"}
      ]
    },
    //按钮展示栏目
    buttonShow:{
      //更新按钮是否禁用
      updateDisabled:true,
      //删除按钮是否禁用
      deleteDisabled:true
    },
    //列表部分
    tableShow:{
      //表格是否在加载
      loading:true,
      //用户表
      userList:[],
      //多选框选中的值
      ids:[]
    },
    //分页
    paginationShow:{
      total:0,
      //分页布局
      layout:"total,sizes,prev,pager,next,jumper",
      //选择每页展示的数量
      pageSizes:[1,5,10,20,50,100],
      //展示多少页码,移动端默认五个
      pageCount:document.body.clientWidth<992?5:7
    },
    //弹出框
    dialogShow:{
      roleOptions:[],
      open:false,
      title:"",
    }
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
    if (currentPage.value*val>data.right.paginationShow.total){
      currentPage.value=1
    }
    getList()
  }
})


const orgTreeRef:any=ref(null);
//done 左侧 组织栏查询下拉树结构
const getOrgTree = () => {
  orgTreeSelect().then(res=>{
    data.left.orgOptions=res.data;
  })
}
/*

//done 获取组织名字列(优化弹出框)
const getOrgNames=computed(()=>{
  parseTree(data.left.orgOptions);
  return arrays.indexOf(data.form.orgId)==-1? "":data.form.orgId;
})
//返回数组,配合上面使用
const arrays:any=[]
const parseTree=(list:any)=>{
    list.forEach((item:any)=>{
      if (item.children){
        parseTree(item.children)
      }
      arrays.push(item.orgId)
    })
}
*/

//done  reactive定义数据和ref定义数据监视方式不同
watch(()=>data.left.orgName,value => {
  orgTreeRef.value.filter(value)
})
//done 左侧组织栏 通过条件过滤节点   当对节点进行筛选时,会执行这个操作,返回false隐藏节点
const filterNode=(value:any,row:any)=>{
  //当输入框为空的时候,展示所有
  if (!value) return true;
  //进行字符匹配  todo 子类筛选出来,父类也会展示(组件功能)
  return row.orgName.indexOf(value)!==-1;
}

//done 左侧组织栏  节点点击事件
const handleNodeClick=(row:any)=>{
  data.queryParams.orgId=row.orgId
  handleQuery();
}

//done 搜索按钮
const handleQuery=()=>{
  data.queryParams.pageNum=1;
  //查询列表getList
  getList()
}
const queryRef:any=ref(null)
//done 重置按钮,只重置右边的
const resetQuery=()=>{
  data.right.searchShow.dateRange=[]
  queryRef.value.resetFields();
  handleQuery();
}
//done 按钮栏   隐藏搜索框
const toggleSearch=()=>{
  data.right.searchShow.showSearch=!data.right.searchShow.showSearch
}

//done 查询用户列表     接口完成,渲染数据
const getList = () => {
  //加载
  data.right.tableShow.loading=true;
  listUser(addDateRangePlus(data.queryParams,data.right.searchShow.dateRange)).then(res=>{
    data.right.tableShow.loading=false;
    data.right.tableShow.userList=res.data.rows;
    data.right.paginationShow.total=res.data.total;
  })
}
//done 处理多选框选中
const handleSelectionChange=(selection:any)=>{
  //map函数将返回值组成新数组
  data.right.tableShow.ids=selection.map((item:any)=>item.userId);
  //只有一个选中的时候修改才有效果  true为禁用
  data.right.buttonShow.updateDisabled=selection.length!=1
  //有选中就启用修改按钮
  data.right.buttonShow.deleteDisabled=!selection.length
}
//done 处理用户状态改变
const handleStatusChange=(row:any)=>{
  let text=row.status==="0"?"启用":"停用";
  ElMessageBox.confirm("确定要"+text+'"'+row.userName+'"用户吗?','系统提示',{
    confirmButtonText:'确定',
    cancelButtonText:'取消',
    type:'warning'
  }).then(()=>{
    //调用接口
    updateUserStatusByUserId({userId:row.userId,status:row.status}).then(()=>{
      ElMessage.success(text+"成功");
    })
  }).catch(()=>{
    //按钮返回
    row.status=row.status==="0"?"1":"0"
  })
}
const userRef:any=ref(null);
//done 重置表单
const reset=()=>{
  //两个时间,头像,删除
  data.form={
    userId:undefined,
    userName:undefined,
    password:undefined,
    nickName:undefined,
    gender:undefined,
    phoneNumber:undefined,
    email:undefined,
    status:"0",
    orgId:undefined,
    roleId:undefined,
    comment:undefined
  }
  //第一个弹窗还没加载出来
  if (userRef.value!==null){
    userRef.value.resetFields();
  }
}
//done 新增用户
const handleAdd=()=>{
  reset();
  //先获取角色,本账户权限以后下的角色(直接给所有权限,系统管理不给其他用户即可)
  getRolesForAddUser().then(res=>{
    data.right.dialogShow.roleOptions=res.data;
    data.right.dialogShow.open=true;
    data.right.dialogShow.title="添加用户";
  });
  //组织已经获取了
}
//done 修改用户
const handleUpdate=(row:any)=>{
  reset();
  const userId=row.userId||data.right.tableShow.ids[0]
  getUserByUserId({userId:userId}).then(res=>{
    //获取当前选中角色,角色列表 ,还有用户信息
    data.form=res.data.form;
    data.right.dialogShow.roleOptions=res.data.roles;
    data.right.dialogShow.open=true;
    data.right.dialogShow.title="修改用户"
  })
}
//done 删除用户
const handleDelete = (row:any) => {
  const userIds=row.userId||data.right.tableShow.ids+"";
  ElMessageBox.confirm('是否删除用户编号为"'+userIds+'"的数据?','系统提示',{
    confirmButtonText:"确定",
    cancelButtonText:"取消",
    type:"warning"
  }).then(()=>{
    //调用删除接口
    delUser({userIds:userIds}).then(()=>{
      getList();
      ElMessage.success("删除成功");
    })
  }).catch(()=>{})
}
//done 重置密码
const handleResetPassword=(row:any)=>{
  ElMessageBox.prompt('请输入"'+row.userName+"'的新密码","提示",{
    confirmButtonText:"确定",
    cancelButtonText:"取消",
    //
    closeOnClickModal:false,
    inputPattern:/^.{4,20}$/,
    inputErrorMessage:"用户密码长度必须在4-20之间"
  }).then(event => {
    resetUserPassword({userId:row.userId,password:event.value}).then((res:any)=>{
      ElMessage.success("密码修改成功");
    })
  }).catch(()=>{})
}

//done 提交表单
const submitForm = () => {
  userRef.value.validate((valid:any)=>{
    //如果校验通过
    if (valid){
      if (data.form.userId!=undefined){
        //修改用户
        updateUser(data.form).then(res=>{
          ElMessage.success("修改成功");
          data.right.dialogShow.open=false;
          getList()
        })
      }else {
        //新增用户
        addUser(data.form).then(res=>{
          ElMessage.success("新增成功");
          data.right.dialogShow.open=false;
          getList();
        })
      }
    }
  })
}
//done 取消表单
const cancel = () => {
  data.right.dialogShow.open=false;
  reset();
}

getOrgTree();
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