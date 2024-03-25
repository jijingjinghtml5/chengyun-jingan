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

import { getData, getData2, getDataItems, getDataItems119, getDataItems119Ratio } from "./api";
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
        gridData: this.gridData,
        itemsData: this.itemsData
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
      },
      itemsData: {}
    };
  },
  created() {
    this.$timer.register(this.getData, this);
  },
  methods: {
    getData() {
      // getData().then(res => {
      //   if (!res.data) return;
      //   // this.yellow = res.data.yellow_alarm_count || "-";
      //   // this.red = res.data.red_alarm_count || "-";
      //   // let _dd = {};
      //   // (res.data.trend || []).map(item => {
      //   //   _dd[item.event_source] = item.data;
      //   // });
      //   // this.trendData = _dd;
      //   // let _d = {};
      //   // (res.data.stats || []).map(item => {
      //   //   let rate = item.yesterday ? Math.floor((item.today - item.yesterday) / item.yesterday * 10000) / 100 : "-";
      //   //   _d[item.event_source] = {
      //   //     count: item.today,
      //   //     rate: rate
      //   //   };
      //   // });
      //   // this.stats = _d;
      //   const staticData = res.items.filter(item => item.id == 46);
      //   if (staticData.length) {
      //     this.gridData.today = staticData[0].value;
      //   } else {
      //     this.gridData.today = res.data.today_total;
      //   }
      //   this.gridData.yesterday = res.data.yesterday_total;

      //   let tmp = {};
      //   (res.items || []).map(item => {
      //     tmp[item.name] = item;
      //   });
      //   this.itemsData = tmp;
      // });
      getData2().then(res => {
        if (!res) return;
        this.yellow = res.yellow_alarm_count || "-";
        this.red = res.red_alarm_count || "-";
        let _dd = {};
        (res.trend || []).map(item => {
          _dd[item.event_source] = item.data;
        });
        this.trendData = _dd;
        let _d = {};
        (res.stats || []).map(item => {
          let rate = item.yesterday ? Math.floor((item.today - item.yesterday) / item.yesterday * 10000) / 100 : "-";
          _d[item.event_source] = {
            count: item.today,
            rate: item.today === item.yesterday ? '0' : rate
          };
        });
        this.stats = _d;
        getDataItems().then(items=>{
          const staticData = items.filter(item => item.id == 46);
          if (staticData.length) {
            this.gridData.today = staticData[0].value;
          } else {
            this.gridData.today = res.today_total;
          }
          this.gridData.yesterday = res.yesterday_total;

          let tmp = {};
          (items || []).map(item => {
            tmp[item.name] = item;
          });
          getDataItems119().then(res => {
            getDataItems119Ratio().then(res2 => {
              const { today_count = 0, yesterday_count = 0 } = res2 || {}
              this.itemsData['119'].rate = Math.floor(((today_count - yesterday_count) / yesterday_count) * 10000) / 100 || '-'
            })
            this.itemsData['119'].value = (res || []).length
            this.itemsData['119'].pointList = res || []
          })
          this.itemsData = tmp;
        })
      })
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
