<template>
  <!--标题,图片应该进行折叠显示-->
  <div id="title">
    <img :src="imgUrl" ref="img" :style="isCollapse?collapseImgStyle:extendImgStyle">
    <h3>{{isCollapse?"风创":"风创防雷监测系统"}}</h3>
  </div>
  <el-scrollbar>
    <el-menu
        default-active="/"
        class="el-menu-vertical-demo"
        :collapse="isCollapse"
        text-color="#ffffff"
        background-color="@asideBackgroundColor"
        active-text-color="#ffd04b"
    >

      <!--一级菜单的处理-->
      <el-menu-item @click="clickMenu(item)" v-for="item in noChildren" :index="item.path" :key="item.path">
        <el-icon>
          <component :is="item.icon"></component>
        </el-icon>
        <template #title>{{item.label}}</template>
      </el-menu-item>
      <!--二级菜单的处理-->
      <el-sub-menu v-for="item in hasChildren" :index="item.label" :key="item.label">
        <template #title>
          <el-icon><component :is="item.icon"></component></el-icon>
          <span>{{item.label}}</span>
        </template>
        <!--对公司遍历,需要index不然会同时展开-->
        <el-sub-menu v-for="subItem in item.children" :key="subItem.label" :index="subItem.label">
          <template #title>
            <!--<el-icon><component :is="subItem.icon"></component></el-icon>-->
            <span>{{subItem.label}}</span>
          </template>
          <!--设备遍历-->
          <el-menu-item-group v-for="ssItem in subItem.children" :key="ssItem.path">
            <el-menu-item :index="ssItem.path" @click="clickMenu(ssItem)">{{ssItem.label}}</el-menu-item>
          </el-menu-item-group>
        </el-sub-menu>
      </el-sub-menu>
    </el-menu>
  </el-scrollbar>

</template>

<script setup>
import {reactive, computed} from 'vue'
import {useRouter} from "vue-router"
import useStore from "@/store/index.ts";
//引入图片资源
import extendImg from "@/assets/logo.png"
import collapseImg from "@/assets/vue.svg"
let  extendImgStyle="width:160px;height:60px"
let  collapseImgStyle="width:60px;height:60px"
let imgUrl=computed(()=>{
  //折叠显示图片
  if (isCollapse.value==true){
    return new URL(collapseImg,import.meta.url).href;
  }else {
    return new URL(extendImg,import.meta.url).href;
  }
})
//使用路由
const $router=useRouter()
//使用pinia
const {tabStore}=useStore();

//控制aside的展开与收起
const isCollapse=computed(()=>{
  return tabStore.isCollapse;
})

const menu=reactive([
  {path:"/",name:"Main",label:"首页",icon:"House",url:"Home/Home"},
  {path:"/mall",name:"Mall",label:"告警记录",icon:"Platform",url:"MallManage/MallManage"},
  {path:"/user",name:"User",label:"用户管理",icon:"User",url:"UserManage/UserManage"},
  {path:"/user",name:"User",label:"设备管理",icon:"Cellphone",url:"UserManage/UserManage"},

  {label:"在线监测",icon: "Platform",children:[
      {label:"风创能源",icon:"User",children:[
          {path:"/page1",name:"Page1",label:"SPD监测模块",icon:"User",url:"Other/PageOne"},
          {path:"/page2",name:"Page2",label:"FCMD-200接地电阻模块",icon:"User",url:"Other/PageTwo"},
          {path:"/page3",name:"Page3",label:"有线网关",icon:"User",url:"Other/PageThree"},
        ]},

      {label:"沃力特",icon:"User",children:[
          {path:"/page4",name:"Page1",label:"SPD监测模块",icon:"User",url:"Other/PageOne"},
          {path:"/page5",name:"Page2",label:"FCMD-200接地电阻模块",icon:"User",url:"Other/PageTwo"},
          {path:"/page6",name:"Page3",label:"有线网关",icon:"User",url:"Other/PageThree"},
        ]},
    ]},
])
//遍历menu没有子元素的
const noChildren=computed(()=>{
  return menu.filter(item=>!item.children)
})
//遍历menu有子元素的
const hasChildren=computed(()=>{
  return menu.filter(item=>item.children)
})
//点击左侧边栏进行跳转
const clickMenu=(item)=>{
  $router.push({
    name:item.name
  })
  tabStore.selectMenu(item)
}
</script>


<style scoped lang="less">

.el-menu{
  height: 100%;
  border: none;
}
/*
修改悬浮样式,二级菜单暂时不好实现
.el-sub-menu:hover{
  background-color: green;
}
.el-menu-item:hover{
  background-color:red;
}
*/
#title{
  padding: 0px;
  text-align: center;
  background: @asideBackgroundColor;
  height: 100px;
  h3{
    /*去除aside部分上部的白边*/
    margin: 0;
    padding: 0;
    color: #fff;
  }
}
.el-scrollbar{
  height: calc(~ "100% - 100px");
  background:@asideBackgroundColor;
}
</style>