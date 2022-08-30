<template>
  <div class="login">
    <div style="padding:20px;margin-top: 150px">
      <el-row :gutter="10" justify="center">

        <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
          <!-- 1.rules中定义的数据对应form-item中的prop
              2.label-width  为标签的长度,过小会变成多行
              3.label-position  标签对齐方式,
              4.model  目前主要用于表单校验使用,如果不添加的话,表单校验总是错误
        -->
          <el-form
              :rules="data.rules"
              ref="loginForm"
              label-width="80px"
              label-position="left"
              class="login-form"
              :model="data.user"
          >
            <h3 style="text-align: center">登录页面</h3>
            <!--prop用来当作校验-->
            <el-form-item label="用户名" prop="userName">
              <!--<el-icon><component is="User"></component></el-icon>-->

              <el-input prefix-icon="User" v-model="data.user.userName" type="input" placeholder="请输入用户名" autocomplete="off" clearable @keyup.enter.native="loginButton">
              </el-input>
            </el-form-item>

            <el-form-item label="密码" prop="password">
              <el-input prefix-icon="Lock" v-model="data.user.password" type="password" placeholder="请输入密码" autocomplete="off" clearable @keyup.enter.native="loginButton"></el-input>
            </el-form-item>

            <el-form-item label="验证码" prop="code">
              <!--极限宽度正好到顶部-->
              <el-input prefix-icon="Umbrella" v-model="data.user.code" type="input" placeholder="请输入验证码" autocomplete="off" clearable style="width: 65%" @keyup.enter.native="loginButton"></el-input>
              <!--验证码图片-->
              <div class="login-code">
                <img :src="data.codeUrl" @click="getCode"/>
              </div>
            </el-form-item>
            <el-button type="primary" @click="loginButton" style="width: 100%;margin-bottom: 18px">登录</el-button>
          </el-form>
        </el-col>
      </el-row>
    </div>
    <!--  底部  -->
    <div class="el-login-footer">
      <span>Copyright © 2022.05-2022.09 <a target="_blank" href="javascript:void(0);">fentric</a> All Rights Reserved.</span>
    </div>

  </div>
</template>

<script setup lang="ts">
import {onMounted, reactive, ref} from "vue";
import {useRouter} from "vue-router";
import useStore from "@/store/index";
import {login,getCaptchaImage} from "@/api";
const $router=useRouter()
//使用pinia
const {userStore}=useStore();
const data=reactive({
  //验证码图片
  codeUrl:"",
  //用户输入的
  user:{
    userName:"",
    password:"",
    code:"",
    uuid:""
  },
  rules:{
    userName:[{required:true,message:"用户名不能为空",trigger:"blur"},{min:3,message: "用户名长度不能小于3位",trigger: "blur"}],
    password:[{required:true,message:"密码不能为空",trigger:"blur"}],
    code:[{required:true,message:"验证码不能为空",trigger:"blur"}],
  }
})
const loginForm:any=ref(null);
const loginButton=()=>{
  //获取表单对象每次先进行校验
  loginForm.value.validate((valid:any)=>{
    //表单校验通过,才发送数据
    if (valid){
      login(data.user).then((res)=>{
        //保存数据(保存至pinia和本地)
        userStore.setToken(res.data.token)
        //路由跳转
        $router.push({name:"Main"})
      }).catch((error)=>{
        getCode()
      })
    }
  })
  /*login(data.user).then((res)=>{
    console.log(res)
  }).catch((error)=>{
    console.log(error)
  })*/
  // const test=Mock.Random.guid()
  //token应该从服务器获取
  // userStore.setToken(data.user.userName)
  // $store.commit("SETTOKEN",reactive_data.user.userName)
  // console.log("login.vue中store存储的token",$store.state.user.token,"本地存储,",localStorage.getItem("token"))
  // $router.push({name:"User"})
}
const getCode = () => {
  getCaptchaImage().then((res)=>{
    data.codeUrl=res.data.codeImage;
    data.user.uuid=res.data.uuid;
  }).catch((error)=>{
    console.log(error)
  })
}
getCode()
</script>

<style scoped lang="less">
.login{
  background: linear-gradient(-225deg, #E3FDF5 50%,#FFE6FA  100%);
  height: 100%;
  overflow: auto;
  //padding-top: 150px;
}
.login-form {
  /**
      参数1:x偏移值
      参数2:y偏移值
      参数3:模糊半径
      参数4:扩张半径
   */
  box-shadow: 0px 20px 30px 10px rgba(0, 0, 0, 0.1);
  border-radius: 20px;
  //磨砂玻璃
  background-color: rgba(250, 250, 250, 0.6);
  border: 1px solid #f0f0f0;
  padding: 25px 25px 5px 25px;
  margin: 0 auto;
  //值大的就在上面
  //z-index: 1000;
  max-width: 400px;
  //margin-bottom: 100px;

  .el-input {
    height: 38px;

    input {
      height: 38px;
      background-color: rgba(0, 0, 0, 0.1);
      color: #333;
    }

    // 谷歌
    input::-webkit-input-placeholder {
      color: #666;
    }

    // 火狐19+版本
    input::-moz-placeholder {
      /* Mozilla Firefox 19+ */
      color: #666;
    }

    // 火狐4-18版本
    input:-moz-placeholder {
      /* Mozilla Firefox 4 to 18 */
      color: #666;
    }

    // IE10-11版本
    input:-ms-input-placeholder {
      /* Internet Explorer 10-11 */
      color: #666;
    }
  }

  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 2px;
    color: #fff;
  }
}
.el-login-footer {
  height: 40px;
  line-height: 40px;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #000000;
  font-family: Arial;
  font-size: 12px;
  letter-spacing: 1px;
}
.login-code {
  margin-left: 10px;
  //width: 36%;
  height: 38px;
  float: right;

  img {
    cursor: pointer;
    vertical-align: middle;
    border-radius: 10px;
    height: 38px;
  }
}
</style>