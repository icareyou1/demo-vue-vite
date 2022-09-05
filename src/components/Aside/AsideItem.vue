<template>
  <template v-if="!item.hidden">
    <!--一级菜单的处理-->
    <el-menu-item v-if="!item.children" :key="item.path" :index="item.path" @click="clickMenu(item)">
      <el-icon>
        <component :is="item.meta.icon"></component>
      </el-icon>
      <template #title>{{item.meta.name}}</template>
    </el-menu-item>
    <!--展示二级菜单-->
    <!--额外的属性是必要的,不然一起折叠-->
    <el-sub-menu :key="item.path" :index="item.path"  v-else>
      <template #title>
        <el-icon><component :is="item.meta.icon"></component></el-icon>
        <span>{{item.meta.name}}</span>
      </template>
      <timplate  v-for="subItem in item.children">
        <el-menu-item-group v-if="!subItem.hidden" :key="subItem.path" :index="subItem.path">
          <el-menu-item :index="subItem.path" @click="clickMenu(subItem)">
            <el-icon><component :is="subItem.meta.icon"></component></el-icon>
            <template #title>{{subItem.meta.name}}</template>
          </el-menu-item>
        </el-menu-item-group>
      </timplate>

    </el-sub-menu>
  </template>


</template>

<script setup lang="ts">
//使用路由
import {useRouter} from "vue-router";
import useStore from "@/store";
//使用pinia
const {tabStore}=useStore();
const $router=useRouter()
//接收父组件传递
const props=defineProps({
  item:{
    type:Object,
    required:true
  }
})
//点击左侧边栏进行跳转
const clickMenu=(item:any)=>{
  $router.push({
    name:item.name
  })
  tabStore.selectMenu(item)
}
</script>

<style scoped lang="less">

</style>