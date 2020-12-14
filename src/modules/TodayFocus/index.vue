<template>
<div class="container gradient-bg">
    <wrap-title txt="今日关注" :level="1" icon="icon-wangge">
      <div slot="right" class="title-right">
        <span class="iconfont icon-chaoqianjian-lianghongdeng"
          style="color:#D0021B; cursor:pointer;"
          @click="handleClick('list',{label: '红灯案件', key: 'red'})"
        ></span>
        <span style="margin-right: 0.4rem">{{red | thousandCentimeter}}</span>
        <span class="iconfont icon-jinjidaiban-lianghuangdeng"
          style="color:#F5A623; cursor:pointer;"
          @click="handleClick('list',{label: '黄灯案件', key: 'yellow'})"
          ></span>
        <span>{{yellow | thousandCentimeter}}</span>
      </div>
      <div slot="center" class="title-center" v-if="current!='overview'">
        <span @click="current='overview'" class="clickAble">[返回上一级]</span>
      </div>
      <component :is="currentPage" :dataset="compnentData" :item="clickData" style="margin-top:20px;" @click="handleClick"></component>
    </wrap-title>
</div>
</template>

<script>
import WrapTitle from "@/components/MTitle/WrapTitle";
import MTitle from "@/components/MTitle/LevelTitle";

import Overview from "./overview.vue";
import CaseDashboard from "./caseDashboard.vue";
import caseList from "./caseList.vue";

import { getData } from "./api";
export default {
  name: "TodayFocus",
  components: { WrapTitle, MTitle, Overview, CaseDashboard, caseList },
  computed: {
    currentPage() {
      switch (this.current) {
        case "dashboard":
          return CaseDashboard;
        case "list":
          return caseList;
        default:
          return Overview;
      }
    },
    compnentData() {
      return {
        trendData: this.trendData,
        stats: this.stats,
        gridData: this.gridData
      };
    }
  },
  data() {
    return {
      yellow: 1000,
      red: 10,
      current: "overview",
      clickData: {},
      trendData: {},
      stats: {},
      gridData: {
        today: "-",
        yesterday: "-"
      }
    };
  },
  created() {
    this.$timer.register(this.getData, this);
  },
  methods: {
    getData() {
      getData().then(res => {
        if (!res.data) return;
        this.yellow = res.data.yellow_alarm_count || "-";
        this.red = res.data.red_alarm_count || "-";
        let _dd = {};
        (res.data.trend || []).map(item => {
          _dd[item.event_source] = item.data;
        });
        this.trendData = _dd;
        let _d = {};
        (res.data.stats || []).map(item => {
          let rate = item.yesterday ? Math.floor((item.today - item.yesterday) / item.yesterday * 10000) / 100 : "-";
          _d[item.event_source] = {
            count: item.today,
            rate: rate
          };
        });
        this.stats = _d;
        // console.log("stats", res.data.stats, this.stats);
        this.gridData.today = res.data.today_total;
        this.gridData.yesterday = res.data.yesterday_total;
      });
    },
    handleClick(type, item) {
      this.current = type;
      this.clickData = item;
    }
  }
};
</script>
<style lang="scss" scoped>
.container{
  height: 100%;

  .title-right{
    font-size: 0.52rem;
    color: #fff;

    span{
      margin-right: 0.1rem;
    }
  }
  .title-center{
    font-size: 0.24rem;
    color: #A8C7F9;
    cursor: pointer;
    display: table-cell;
    vertical-align: bottom;
    height: 0.4rem;
  }

}
</style>
