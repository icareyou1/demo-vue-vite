<template>
<h1>测试pages</h1>
  <router-link replace=true to="/Page1">点击渲染页面1</router-link>
  <router-link to="/Page2">点击渲染页面2</router-link>
  <router-link to="/Page3">点击渲染页面3</router-link>
  <el-button @click="showPage3">点击跳转3</el-button>
<router-view></router-view>
</template>

<script setup lang="ts">
import {useRouter} from "vue-router";

const $router=useRouter()
const showPage3=()=>{
  $router.push({name:"Page3",params:{id:10010,name:"zhouqi"}})
}
</script>

<style scoped lang="less">

</style>