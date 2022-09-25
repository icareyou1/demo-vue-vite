<template>

  <el-input-number
      :precision="3"
      :controls="false"
      min="0"
      max="65.53"
      :model-value="data.num/1000"
      @blur="handleTransformNum($event,'num')"
  />
  <el-button @click="showNum">点击</el-button>
</template>

<script setup lang="ts">
import {computed, reactive} from "vue";

const data:any=reactive({
  num:undefined as any
})
const showNum=()=>{
  console.log("@@@",data.num)
}

const handleTransformNum = (e:any,val:any) => {
  data[val]=(e.target.value*1000).toFixed(0)
  console.log("!!!!",e.target.value)
}
</script>

<style scoped lang="less">
.el-input-number {
  /deep/.el-input__inner {
    -webkit-appearance: none;
    -moz-appearance: textfield;
    text-align: left;
    line-height: 1;
  }
}
</style>