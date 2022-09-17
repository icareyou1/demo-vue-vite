<template>
  <div style="height: 100vh;">
    <router-view></router-view>
    <!--<Main></Main>-->
  </div>

</template>

<script setup lang="ts">
import Main from "@/pages/Main.vue";
</script>

<style lang="less">
html,body{
  margin: 0;
  padding: 0;
}
</style>
