<template>
  <el-card style="padding: 10px 100px;">
    <div style="text-align: center">
      <h1>{{subComponent.title}}</h1>
    </div>
    <el-form :model="data.form" ref="refAddCategory" :rules="subComponent.rules">

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
            <!--d2001波特率-->
            <el-select
                v-model="data.form[item.value]"
                :placeholder="item.placeholder"
                v-else-if="Object.keys(data.componentItems).indexOf(item.value)!==-1"
                clearable
            >
              <el-option
                  v-for="dict in data.componentItems[item.value]"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
              />
            </el-select>
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
  componentItems:{
    d2001:[
      {label:"2400",value:0},{label: "4800",value: 1},{label: "9600",value: 2}
    ],
    d2002:[
      {label:"本地监测",value:0},{label: "报警联动",value: 1}
    ],
    d2003:[{label:"三相四线",value:0},{label:"三相三线",value:1},{label:"单相",value:2}],
    d2008:[{label:"NTC",value:0},{label:"PT100",value:1},{label:"KTY84",value:2},{label:"B7F55",value:3},{label:"B6F55",value:4}],
    d2009:[{label:"告警禁止",value:0},{label:"过欠压告警",value:1},{label:"过压告警",value:2},{label:"欠压告警",value:3}],
    d2010:[{label:"告警禁止",value:0},{label:"过欠频告警",value:1},{label:"过频告警",value:2},{label:"欠频告警",value:3}],
    d2011:[{label:"告警禁止",value:0},{label:"过欠流告警",value:1},{label: "过流告警",value: 2},{label: "欠流告警",value:3}],
    d2012:[{label:"告警禁止",value:0},{label:"过欠功率告警",value:1},{label: "过功率告警",value: 2},{label: "欠功率告警",value:3}],
    d2013:[{label:"告警禁止",value:0},{label:"过欠温告警",value:1},{label: "过温告警",value: 2},{label: "欠温告警",value:3}],
    d2014:[{label:"告警禁止",value:0},{label: "雷电流超限告警",value: 1},{label: "雷电流次数告警",value: 2}],
    d2016:[{label:"禁止",value:0},{label:"使能",value: 1}],
    d2017:[{label:"禁止",value:0},{label:"使能",value: 1}]
  }
})

//自定义事件
const $emit=defineEmits(['handleForm','handleCancel'])
//获取表单
const refAddCategory:any=ref(null)
//此处发送事件
const sendForm = () => {
  refAddCategory.value.validate((valid:any)=>{
    //如果通过校验才将数据传给父组件
    if(valid){
      //经过父组件处理,成功才reset
      // $emit('handleForm',data.form)
      console.log("@data@",data.form)
    }
  })
}
//通知父类移除子类
const sendCancel = () => {
  //重置输入表单(因为双向绑定,按道理改变data也是可以的)
  // $emit('handleCancel')
  console.log("@data@",data.form)
}
</script>

<style scoped lang="less">
</style>