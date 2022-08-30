<template>
  <div class="tags">
    <el-tag
        v-for="(item,index) in tags"
        :key="item.name"
        :closable="item.name !== 'Home'"
        :effect="$route.name===item.name?'dark':'plain'"
        @click="changeMenu(item)"
        @close="handleClose(item,index)"
    >
      {{ item.name }}
    </el-tag>
  </div>
</template>

<script setup>
import useStore from "@/store/index.ts";
import {computed, getCurrentInstance} from "vue";
import {useRouter} from "vue-router";
const {proxy}=getCurrentInstance()
//获取路由
const $router=useRouter()
const {tabStore}=useStore()
//获取当前所有tags
const tags=computed(()=>{
  return tabStore.tabsList
})
//点击tag更改页面
const changeMenu=(item)=>{
  $router.push({name:item.name})
}
//点击关闭按钮
const handleClose=(item,index)=>{
  const length= tags.value.length
  //删除state中存储数据
  tabStore.closeTag(item)
  //删除不是当前选中的tag
  if (item.name!==proxy.$route.name){
    return;
  }
  //如果删除当前激活的,且是最右边的; 那么就展示其左边的页面
  if (index===length-1){
    $router.push({
      name:tags.value[index-1].name
    })
  }else {  //如果当前激活不是最右边
    console.log("如果当前激活不是最右边",tags)
    $router.push({
      //返回的tags已经是变化的值,所以不要再加1
      name:tags.value[index].name
    })
  }
}
</script>

<style scoped>
.tags{
  padding: 10px;
}
.el-tag{
  margin-right: 10px;
  /*悬浮上面改变鼠标为小手*/
  cursor: pointer;
}
</style>