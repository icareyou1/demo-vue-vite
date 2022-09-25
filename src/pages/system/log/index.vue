<template>
  <!--
  \s 匹配空白字符
  ?匹配前面0或1
  /g 可以匹配多个
  \B 非单词边界匹配
  -->
  <el-input
      v-model="data.number"
      :formatter="format"
      :parser="parse"
  />
  <el-button @click="output">点击输出</el-button>

  <input v-model="data.number">
</template>

<script setup lang="ts">
import {computed, nextTick, onMounted, reactive} from "vue";


const data=reactive({
  number:null as any
})
const output = () => {
  console.log("@@",data.number)
  console.log("@@",typeof   data.number)
}

const vShow1={
  beforeMount:(el:any,bingding:any)=>{
    el.value=bingding.value*10
    console.log("@@",bingding.value)
    console.log("@@",el)
  }
}/**
 * \B  阻止出现在边界
 * g  匹配出现多次
 * +   匹配一次或多次
 * *   匹配0或多次
 * https://blog.csdn.net/mfkpie/article/details/103845941/  前瞻后顾
 * ?=  前瞻     exp1(?=exp2) 查找exp2前面的exp1
 * ?<=   后顾   (?<=exp2)exp1 查找exp2后面的exp1
 *    "中国人".replace(/(?<=中国)人/, "rr") // 匹配中国人中的人，将其替换为rr，结果为 中国rr
 * ?!  负前瞻    exp1(?!exp2) 查找后面不是exp2的exp1
 * ?<!  负后顾   (?<!exp2)exp1 查找前面不是exp2的exp1
 */
const format=(value:any)=>{
  return `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}
const parse=(value:any)=>{
  console.log("@@@",value.replace(/\$\s?|(,*)/g, ''))
  return value.replace(/\$\s?|(,*)/g, '')
}


</script>

<style scoped lang="less">

</style>