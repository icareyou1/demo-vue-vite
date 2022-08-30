<template>
<h1>page3</h1>
  {{$route.params.id}}
  <el-button @click="getCheckCode">获取验证码</el-button>
  {{data.msg}}
</template>

<script setup lang="ts">
import {useRoute} from "vue-router";
import {getCaptchaImage} from "@/api";
import {reactive} from "vue";
const $route=useRoute()
//定义data数据
let data = reactive({
  name:"周琪",
  msg:"",
})
const getCheckCode=()=>{
  getCaptchaImage().then((res:any)=>{
    data.msg=res.msg;
    console.log(res)
  }).catch((error)=>{
    console.log(error)
  })
}
</script>

<style scoped lang="less">

</style>