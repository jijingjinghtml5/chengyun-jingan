<template>
<div class="container gradient-bg">
    <wrap-title txt="风险预警" :level="1" icon="icon-ditanshijiancha">
      <!-- <div slot="right" class="title-right">
        <span>预警总数：</span>
        <span>{{total | thousandCentimeter}}</span>
      </div> -->
      <div class="list">
        <list-item v-for="(item, index) in items" :key="index" :item="item" :dataset="dataset" :itemsData="itemsData">
          <!-- <template v-slot:yq="item">
            <span class="iconfont icon-jinru clickAble" style="margin-right:20px;"></span>
            <span class="iconfont icon-tiaozhuandaojiezhen clickAble"></span>
          </template> -->
        </list-item>
      </div>
    </wrap-title>
</div>
</template>

<script>
import WrapTitle from "@/components/MTitle/WrapTitle";
import MTitle from "@/components/MTitle/LevelTitle";

import ListItem from "./ListItem.vue";

import { getData } from "./api";

export default {
  name: "RiskAlert",
  inject: ["createFnForCalcRealPx"],
  components: { WrapTitle, MTitle, ListItem },
  data() {
    return {
      activeItem: null,
      onMap: false,
      activeIndex: -1,
      total: 12,
      dataset: {},
      items: [
        {
          icon: "icon-yiqingfangkong",
          title: "疫情防控",
          color: "#D0021B",
          update_time: "今日8:00",
          slot: "yq",
          metrics: [
            {
              label: "当前管控",
              count: 1,
              key: "health_stats_total",
              color: "#F23470"
            },
            {
              label: "新增集隔",
              count: 2,
              key: "health_stats_isolation_add",
              color: "#F96F4F"
            },
            {
              label: "解除集隔",
              count: 2,
              key: "health_stats_isolation_remove",
              color: "#6CCB73"
            },
            {
              label: "核酸采样点",
              count: 78,
              key: "health_stats_home_add",
              color: "#F96F4F"
            },
            {
              label: "已启用采样点",
              count: 78,
              key: "health_stats_home_add",
              color: "#6CCB73"
            }
          ]
        },
        {
          icon: "icon-jiaotongyongdu",
          title: "交通拥堵",
          color: "#F96F4F",
          update_time: "今日8:00",
          metrics: [
            {
              label: "道路拥堵",
              count: 78,
              key: "crowd_road_count",
              color: "#4FCFD5"
            },
            {
              label: "地铁大客流",
              count: 80,
              color: "#F23470"
            },
            {
              label: "地铁故障",
              count: 2,
              color: "#F96F4F"
            }
          ]
        },
        {
          icon: "icon-richangguanli",
          title: "风险事项",
          color: "#F23470",
          update_time: "今日8:00",
          metrics: [
            {
              label: "24小时热线",
              count: 78,
              color: "#4FCFD5"
            },
            {
              label: "舆情监测",
              count: 2,
              color: "#F23470"
            },
            {
              label: "物联感知",
              count: 78,
              key: "iot_count",
              color: "#4FCFD5"
            }
          ]
        }
        // {
        //   icon: "icon-renqunjuji",
        //   title: "人群聚集",
        //   color: "#2E9BCF",
        //   update_time: "今日8:00",
        //   metrics: [
        //     {
        //       label: "重点场所",
        //       count: 102,
        //       color: "#F23470"
        //     },
        //     {
        //       label: "道路/园区",
        //       count: 69,
        //       color: "#6CCB73"
        //     },
        //     {
        //       label: "交通枢纽",
        //       count: 78,
        //       color: "#6CCB73"
        //     }
        //   ]
        // }
      ],
      itemsData: {}
    };
  },
  created() {
    this.$timer.register(this.getData, this);
  },
  methods: {
    getData() {
      getData().then(res => {
        // console.log(">>>>", res);
        if (res.data) {
          this.dataset = res.data;
          this.dataset.health_stats_total = res.data.public_health_stats.total;
          this.dataset.health_stats_isolation_add = res.data.public_health_stats.isolation_observe_stats.today_add;
          this.dataset.health_stats_isolation_remove = res.data.public_health_stats.isolation_observe_stats.today_remove;
          this.dataset.health_stats_home_add = res.data.public_health_stats.home_observe_stats.today_add;
          this.dataset.health_stats_home_remove = res.data.public_health_stats.home_observe_stats.today_remove;
        }

        let tmp = {};
        this.dataset.items = res.items || [];
        (res.items || []).map(item => {
          tmp[item.name] = item;
        });
        this.itemsData = tmp;
        // console.log(">>>>", this.itemsData);
      });
    },
    showDetail(item) {
      this.activeItem = item;
    },
    goBack() {
      this.activeItem = null;
      this.onMap = false;
      this.$_mapProxy.resetPointLocation();
    },
    getIcon(item) {
      let icon = "iconfont ";
      switch (item.type) {
        case "疫情防控":
          icon += "icon-yiqingfangkong";
          break;
        case "道路交通":
          icon += "icon-jiaotongyongdu";
          break;
        case "道路扬尘":
          icon += "icon-yangchen1";
          break;
        case "路面积水":
          icon += "icon-daolujishui1";
          break;
        case "人群聚集":
          icon += "icon-renqunjuji";
          break;
        default:
          icon += "icon-richangguanli";
      }
      return icon;
    },
    showOnMap(item) {
      if (this.onMap) {
        // 移除
        this.onMap = false;
        this.$_mapProxy.resetPointLocation();
      } else {
        this.onMap = true;
        this.$_mapProxy.pointLocation(item).setPopupConfig({
          component: "RiskAlertPopup"
        });
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.container{
  height: 100%;
  .title-right{
    color: #ffffff;
  }
  .list{
    margin-top:10px;
  }
}
</style>
