<template>
  <div class="app-container home">
    <el-row :gutter="40" style="margin-bottom:100px;">
<!--      <el-col :xs="24" :sm="24" :md="24" :lg="14" :xl="14">
        <el-card style="margin:-10px;" shadow="hover" body-style="background-color:#eee;">
          <div ref="map" style="height:651px;margin:-17px;margin-top:-12px;"></div>
        </el-card>
      </el-col>-->

      <el-col :xs="24" :sm="24" :md="24" :lg="10" :xl="10">

        <el-card>
          <h3 style="font-weight:bold">设备统计</h3>
          <!--gutter 表示列之间的距离-->
          <el-row :gutter="40">

            <!--蓝色统计列-->
            <el-col :span="12">
              <el-row>
                <el-col :span="24">
                  <div class="card-panel card-panel-blue">
                    <!--左右布局-->
                    <div class="card-panel-img">
                      <el-icon >
                        <component is="Odometer"></component>
                      </el-icon>
                    </div>
                    <!--上下布局-->
                    <div class="card-panel-text">
                      <div>在线设备</div>
                      <count-to :start-val="0" :end-val="deviceStatistic.onlineDeviceCount" :duration="1000"></count-to>
                    </div>
                  </div>
                </el-col>
                <el-col :span="24">
                  <div class="card-panel card-panel-blue">
                    <!--左右布局-->
                    <div class="card-panel-img">
                      <el-icon >
                        <component is="Odometer"></component>
                      </el-icon>
                    </div>
                    <!--上下布局-->
                    <div class="card-panel-text">
                      <div>今日告警</div>
                      <count-to :start-val="0" :end-val="deviceStatistic.todayWarmCount" :duration="1000"></count-to>
                    </div>
                  </div>
                </el-col>
                <el-col :span="24">
                  <div class="card-panel card-panel-blue">
                    <!--左右布局-->
                    <div class="card-panel-img">
                      <el-icon >
                        <component is="Odometer"></component>
                      </el-icon>
                    </div>
                    <!--上下布局-->
                    <div class="card-panel-text">
                      <div>今日事件</div>
                      <count-to :start-val="0" :end-val="deviceStatistic.todayEventCount" :duration="1000"></count-to>
                    </div>
                  </div>
                </el-col>
                <el-col :span="24">
                  <div class="card-panel card-panel-blue">
                    <!--左右布局-->
                    <div class="card-panel-img">
                      <el-icon >
                        <component is="Odometer"></component>
                      </el-icon>
                    </div>
                    <!--上下布局-->
                    <div class="card-panel-text">
                      <div>今日操作</div>
                      <count-to :start-val="0" :end-val="deviceStatistic.todayOperationCount" :duration="1000"></count-to>
                    </div>
                  </div>
                </el-col>
              </el-row>

            </el-col>
            <!--红色统计列-->
            <el-col :span="12">
              <el-row>
                <el-col :span="24">
                  <div class="card-panel card-panel-red">
                    <!--左右布局-->
                    <div class="card-panel-img">
                      <el-icon >
                        <component is="Odometer"></component>
                      </el-icon>
                    </div>
                    <!--上下布局-->
                    <div class="card-panel-text">
                      <div>离线设备</div>
                      <count-to :start-val="0" :end-val="deviceStatistic.offlineDeviceCount" :duration="1000"></count-to>
                    </div>
                  </div>
                </el-col>
                <el-col :span="24">
                  <div class="card-panel card-panel-red">
                    <!--左右布局-->
                    <div class="card-panel-img">
                      <el-icon >
                        <component is="Odometer"></component>
                      </el-icon>
                    </div>
                    <!--上下布局-->
                    <div class="card-panel-text">
                      <div>历史告警</div>
                      <count-to :start-val="0" :end-val="deviceStatistic.totalWarmCount" :duration="1000"></count-to>
                    </div>
                  </div>
                </el-col>
                <el-col :span="24">
                  <div class="card-panel card-panel-red">
                    <!--左右布局-->
                    <div class="card-panel-img">
                      <el-icon >
                        <component is="Odometer"></component>
                      </el-icon>
                    </div>
                    <!--上下布局-->
                    <div class="card-panel-text">
                      <div>历史事件</div>
                      <count-to :start-val="0" :end-val="deviceStatistic.totalEventCount" :duration="1000"></count-to>
                    </div>
                  </div>
                </el-col>
                <el-col :span="24">
                  <div class="card-panel card-panel-red">
                    <!--左右布局-->
                    <div class="card-panel-img">
                      <el-icon >
                        <component is="Odometer"></component>
                      </el-icon>
                    </div>
                    <!--上下布局-->
                    <div class="card-panel-text">
                      <div>历史操作</div>
                      <count-to :start-val="0" :end-val="deviceStatistic.totalOperationCount" :duration="1000"></count-to>
                    </div>
                  </div>
                </el-col>
              </el-row>
            </el-col>

          </el-row>
        </el-card>

<!--        <el-card style="margin:-10px;margin-top:40px;height:300px;background-color:#fafafa;" shadow="hover">
          <h3 style="font-weight:bold;margin-bottom:10px;">信息栏</h3>
          <div style="cursor:pointer;display:table;width:100%;line-height:36px;" @click="openDetail(item.noticeId)" v-for="item in noticeList" :key="item.noticeId">
            <div style="display:table-cell;padding-right:10px;">
              <el-tag size="mini" effect="dark" type="warning" v-if="item.noticeType==2">公告</el-tag>
              <el-tag size="mini" effect="dark" v-else>信息</el-tag>
              {{item.noticeTitle}}
            </div>
            <div style="display:table-cell;width:90px;font-size:14px;"><i class="el-icon-time"></i> {{ parseTime(item.createTime, '{y}-{m}-{d}') }}</div>
          </div>
        </el-card>-->

      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import {onMounted, reactive} from "vue";
import {CountTo} from "vue3-count-to";
import {getDeviceStatistic} from "@/api/device";

const deviceStatistic=reactive({
  totalDeviceCount:0,
  onlineDeviceCount:0,
  offlineDeviceCount:0,
  todayWarmCount:0,
  totalWarmCount:0,
  todayEventCount:0,
  totalEventCount:0,
  todayOperationCount:0,
  totalOperationCount:0,
})
//从接口获取设备统计数据
const showDeviceStatistic=()=>{
  getDeviceStatistic().then(res=>{
    deviceStatistic.totalDeviceCount=res.data.totalDeviceCount
    deviceStatistic.onlineDeviceCount=res.data.onlineDeviceCount
    deviceStatistic.offlineDeviceCount=res.data.offlineDeviceCount
    deviceStatistic.todayWarmCount=res.data.todayWarmCount
    deviceStatistic.totalWarmCount=res.data.totalWarmCount
    deviceStatistic.todayEventCount=res.data.todayEventCount
    deviceStatistic.totalEventCount=res.data.totalEventCount
    deviceStatistic.todayOperationCount=res.data.todayOperationCount
    deviceStatistic.totalOperationCount=res.data.totalOperationCount

  })
}

//在这后面打印deviceStatistic,仍然是初始值,因为异步
showDeviceStatistic()
</script>

<style scoped lang="less">
.card-panel{
  height: 68px;
  border: 1px solid #eee;
  margin-bottom: 15px;
  display: flex;
  border-radius: 5px;
  //box-shadow: 0 0 10px 1px #eee;
  //分布两端
  justify-content: space-between;
  //不设置这个el-icon的div将会撑满68px(因为默认为stretch)
  align-items: center;

  //图标外层的div
  .card-panel-img{
    margin-left: 10px;
    border-radius: 10px;
    //图标
    .el-icon{
      //指定图片大小
      font-size: 50px;
      //别让图片基线对齐,不然下面距离边框有点远
      vertical-align: middle;
    }
  }
  //右侧文字div
  .card-panel-text{
    margin-right: 10px;
    padding: 5px;
    text-align: center;
    color: #666666;
    font-size: 20px;
    div{
      color: #8c8c8c;
    }
  }
}
//放在card-panel同级
.card-panel-blue{
  //图标外层的div
  .card-panel-img{
    background-color: #fff;
    //图标
    .el-icon{
      color: #36a3f7;
    }
  }
  &:hover{
    .card-panel-img{
      background-color: #36a3f7;
      //图标
      .el-icon{
        color: #fff;
      }
    }
  }
}

//放在card-panel同级
.card-panel-red{
  //图标外层的div
  .card-panel-img{
    background-color: #fff;
    //图标
    .el-icon{
      color: #f56c6c;
    }
  }
  &:hover{
    .card-panel-img{
      background-color: #f56c6c;
      //图标
      .el-icon{
        color: #fff;
      }
    }
  }
}

</style>