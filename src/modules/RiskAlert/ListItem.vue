<template>
  <el-row :gutter="20" class="item">
    <el-col :span="2" class="icon">
      <span class="iconfont" :class="item.icon" :style="`color:${item.color}`"></span>
    </el-col>
    <el-col :span="4" class="title">
      <div class="level1">{{item.title}}</div>
      <!-- <div class="level2">更新时间:{{item.update_time}}</div> -->
    </el-col>
    <el-col :span="18" class="metrics">
      <div class="metric-item" v-for="metric in item.metrics" :key="metric.label">
        <div class="level2">{{metric.label}}</div>
        <div class="value" :style="`color: ${metric.color} `">{{metric.key ? dataset[metric.key] : '-'}}</div>
      </div>
    </el-col>
    <!-- <el-col :span="3" class="opt">
      <slot :name="item.slot" v-bind:item="item">
      </slot>
    </el-col> -->
  </el-row>
</template>
<script>
import Vue from "vue";
import { Row, Col } from "element-ui";
Vue.use(Row);
Vue.use(Col);

export default {
  name: "ListItem",
  props: {
    item: {
      type: Object,
      default: () => {
        return {
          icon: "icon-yiqingfangkong",
          title: "疫情防控",
          color: "#D0021B",
          update_time: "今日8:00",
          metrics: [
            {
              label: "新增集观",
              count: 1,
              color: "#F23470"
            },
            {
              label: "解除集观",
              count: 2,
              color: "#6CCB73"
            },
            {
              label: "新增居家观察",
              count: 78,
              color: "#F96F4F"
            }
          ]
        };
      }
    },
    dataset: {
      type: Object,
      default() {
        return {};
      }
    }
  }
};
</script>
<style lang="scss" scoped>
  .item{
    padding: 25px 0;
    border-top: 2px solid #4E78A4;
    border-bottom: 2px solid #4E78A4;
    line-height: 2.2;
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    .icon{
      font-size: 72px;
      text-align: center;
    }
    .metrics{
      display: flex;
      justify-content: space-between;
      .metric-item{
        flex: 1;
        .value{
          line-height: 1;
          margin-top:10px;
        }
      }
    }
    .opt{
      height: 100%;
      font-size: 52px;
      padding: 0 40px;
      color: #669DF4;
    }

    .level1{
      font-size: 36px;
      font-weight: 500;
    }
    .level2{
      font-size: 28px;
      color: #D1C9C4;
    }
    .value{
      font-size: 52px;
      font-weight: 500;
    }
  }
  .color1{
    color: #D0021B;
  }
  .color2{
    color: #F96F4F;
  }
  .color3{
    color: #FCBF51;
  }
  .color4{
    color: #2E9BCF;
  }
</style>
