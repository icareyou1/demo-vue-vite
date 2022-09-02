<template>
<h1>page3</h1>
  {{$route.params.id}}
  <el-button @click="getCheckCode">获取验证码</el-button>
  <el-button @click="testPromise">测试Promise</el-button>
  <el-button @click="getPiniaToken">获取pinia存储的token</el-button>
  <hr>
  {{data.msg}}

</template>

<script setup lang="ts">
import {useRoute} from "vue-router";
import {getCaptchaImage} from "@/api";
import {reactive} from "vue";
import useStore from "@/store/index"
const {userStore}=useStore()
const $route=useRoute()
//定义data数据
let data = reactive({
  name:"周琪",
  msg:userStore.userName,
})
const getCheckCode=()=>{
  getCaptchaImage().then((res:any)=>{
    data.msg=res.msg;
    console.log(res)
  }).catch((error)=>{
    console.log(error)
  })
}
const testPromise = () => {
  const p=new Promise((resolve,reject)=>{
    console.log("promise")
    setTimeout(()=>{
      let n=Math.random();
      console.log(n)
      if (n<=0.5){
        resolve(n);
      }else {
        reject()
      }
    },3000)
  })
  p.then(
      (n)=>{
    console.log("success",n)
  },()=>{
    console.log("faile")
  })
  console.log("!!!!!!!!!!!!!!")
}
const getPiniaToken = () => {
  console.log("--------",userStore.token)
}
</script>

<style scoped lang="less">

</style>