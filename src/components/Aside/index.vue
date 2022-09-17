<template>
  <!--标题,图片应该进行折叠显示-->
  <div id="title">
    <img :src="imgUrl" ref="img" :style="isCollapse?collapseImgStyle:extendImgStyle">
    <h3>{{isCollapse?"风创":"风创防雷监测系统"}}</h3>
  </div>
  <el-scrollbar>
    <!--background-color 不要使用@asideBackgroundColor 不然el-menu折叠效果失效,血的教训-->
    <el-menu
        default-active="/"
        class="el-menu-vertical-demo"
        :collapse="isCollapse"
        text-color="#ffffff"
        background-color="#304156"
        active-text-color="#ffd04b"
    >
      <AsideItem v-for="(item,index) in menuRoutes" :item="item" :key="item.path+index"></AsideItem>
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
import AsideItem from "@/components/Aside/AsideItem.vue";
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
const {tabStore,permissionStore}=useStore();

//控制aside的展开与收起
const isCollapse=computed(()=>{
  return tabStore.isCollapse;
})
//获取路由
const menuRoutes=computed(()=>permissionStore.getMenuRoutes)
</script>


<style scoped lang="less">

.el-menu{
  height: 100%;
  border: none;
  ::v-deep{

    .el-sub-menu-item:hover{
      background-color: red;
    }
    .el-menu-item:hover{
      background-color: red;
    }
    .is-active{
      background-color: green;
    }
  }
}


/**
--el-menu-text-color默认状态下字体颜色
--el-menu-hover-text-color悬停状态下字体颜色
--el-menu-active-color激活状态下字体颜色
--el-menu-bg-color整个菜单栏背景色
--el-menu-hover-bg-color菜单item悬停状态下背景色
 */

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