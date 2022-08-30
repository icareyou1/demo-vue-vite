<template>
  <header>
    <div>
      <el-button @click="collapseMenu" icon="Menu"></el-button>
      <el-breadcrumb :separator-icon="ArrowRight" class="atoneline">
        <el-breadcrumb-item v-for="item in tags" :key="item.path" :to="{ path: item.path }">{{item.label}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div>
      <el-dropdown trigger="click" size="mini">
        <span>
<!--          Element定义好的样式-->
          <!--          <el-avatar
                        :src="img"
                    />-->
          <img :src="imgUrl" class="user">
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>个人中心</el-dropdown-item>
            <el-dropdown-item @click="logout">退出</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

    </div>


  </header>
</template>

<script setup>
//面包屑的箭头符号
import { ArrowRight } from '@element-plus/icons-vue'
import {computed} from "vue";
import {useRouter} from "vue-router";
//引入图片资源
import avator from "@/assets/vue.svg"
let imgUrl=new URL(avator,import.meta.url).href;
//使用路由
const $router=useRouter()
import useStore from "@/store/index.ts";
// 使用pinia状态管理
const {tabStore,userStore}=useStore()
//获取tablist里面的元素
const tags=computed(()=>{
  return tabStore.tabsList
})
//点击折叠按钮修改,isCollapse的值
const collapseMenu=()=>{
  tabStore.collapseMenu()
}

const logout = () => {
  userStore.clearToken()
  console.log("退出登录后数据,localStore",localStorage.getItem("token"),"---$store",userStore.token)
  $router.push("/login")
  // location.href="/#/login"
}
</script>

<style scoped>
/*弹性盒子，
justify-content: space-between; 均匀分布先首尾
*/
header{
  display: flex;
  height: 100%;
  justify-content: space-between;
  align-items: center;
}
/*头像样式*/
.user{
  width:40px;
  height: 40px;
  /*改变圆角*/
  border-radius: 30%;
}
.atoneline{
  display: inline-block;
}

</style>