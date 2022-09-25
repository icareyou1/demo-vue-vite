<template>
  <template v-if="!item.hidden">
    <!--标志着为main路由,只展示子组件-->
    <template v-if="item.meta.mainFlag===true">
      <el-menu-item :key="item.children[0].path" :index="item.children[0].path" @click="clickMenu(item.children[0])">
        <el-icon>
          <component :is="item.children[0].meta.icon"></component>
        </el-icon>
        <template #title>{{item.children[0].meta.name}}</template>
      </el-menu-item>
    </template>


    <!--不为main路由-->
    <template v-else>
      <!--一级菜单的处理-->
      <el-menu-item v-if="!item.children.length" :key="item.path" :index="item.path" @click="clickMenu(item)">
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
        <template  v-for="subItem in item.children">
          <el-menu-item-group v-if="!subItem.hidden" :key="subItem.path" :index="subItem.path">
            <el-menu-item :index="subItem.path" @click="clickMenu(subItem)">
              <el-icon><component :is="subItem.meta.icon"></component></el-icon>
              <template #title>{{subItem.meta.name}}</template>
            </el-menu-item>
          </el-menu-item-group>
        </template>

      </el-sub-menu>
    </template>

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