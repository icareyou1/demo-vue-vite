<template>
  <el-container>
    <el-aside width="auto"><Aside></Aside></el-aside>
    <el-container>
      <el-header style="padding: 0px"><Header></Header></el-header>
      <Tag></Tag>
      <el-main><router-view></router-view></el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import Aside from "@/components/Aside/index.vue"
import Header from  "@/components/Header/index.vue"
import Tag from "@/components/Tag/index.vue"
</script>

<style scoped lang="less">
.el-container{
  height: 100%;
}
.el-aside{
  height: 100%;
}
</style>