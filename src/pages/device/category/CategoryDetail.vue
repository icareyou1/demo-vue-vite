<template>
  <el-card style="padding: 10px 100px;">
    <div style="text-align: center">
      <h1>{{subComponent.title}}</h1>
    </div>
    <el-form :model="data.form" ref="refCategoryDetail" :rules="subComponent.rules">

      <el-row :gutter="10">
        <el-col :span="8" v-for="item in subComponent.formItem" :key="item.value">
          <el-form-item :label="item.label" :prop="item.value">
            <!--特殊情况--status-->
            <el-radio-group v-model="data.form[item.value]" v-if="item.value=='status'">
              <el-radio
                  v-for="dict in data.statusSelectOption"
                  :key="dict.value"
                  :label="dict.value"
              >{{ dict.label }}</el-radio>
            </el-radio-group>
            <!--特殊情况---comment -->
            <el-input :placeholder="item.placeholder" type="textarea" v-model="data.form[item.value]" v-else-if="item.value=='comment'"/>
            <!--普遍情况-->
            <el-input :placeholder="item.placeholder" v-model="data.form[item.value]" v-else/>

          </el-form-item>
        </el-col>
      </el-row>

    </el-form>
    <div style="text-align: center">
      <el-button type="primary" @click="sendForm">确 定</el-button>
      <el-button @click="sendCancel">取 消</el-button>
    </div>
  </el-card>

</template>

<script setup lang="ts">
//接受外部传递
import {onBeforeUnmount, reactive, ref} from "vue";
//接受父组件传递
const props=defineProps({
  data:{
    type:Object,
    default:{}
  },
  subComponent:{
    type:Object
  }
})
const data=reactive({
  form:props.data,
  statusSelectOption:[
    {label:"正常",value:"0"},{label:"禁用",value: "1"}
  ],
})

//自定义事件
const $emit=defineEmits(['handleForm','handleCancel'])
//获取表单
const refCategoryDetail:any=ref(null)
//此处发送事件
const sendForm = () => {
  refCategoryDetail.value.validate((valid:any)=>{
    //如果通过校验才将数据传给父组件
    if(valid){
      //经过父组件处理,成功才reset
      $emit('handleForm',data.form)
    }
  })
}
//通知父类移除子类
const sendCancel = () => {
  //重置输入表单(因为双向绑定,按道理改变data也是可以的)
  $emit('handleCancel')
}
</script>

<style scoped lang="less">
</style>