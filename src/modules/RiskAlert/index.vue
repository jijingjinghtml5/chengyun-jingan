<template>
<div class="container gradient-bg">
    <wrap-title txt="风险预警" :level="1" icon="icon-ditanshijiancha">
      <div slot="right" class="title-right">
        <span>预警总数：</span>
        <span>{{total | thousandCentimeter}}</span>
      </div>
      <div class="list">
        <list-item v-for="(item, index) in items" :key="index" :item="item">
          <template v-slot:yq="item">
            <span class="iconfont icon-jinru clickAble" style="margin-right:20px;"></span>
            <span class="iconfont icon-tiaozhuandaojiezhen clickAble"></span>
          </template>
        </list-item>
      </div>
    </wrap-title>
</div>
</template>

<script>
import WrapTitle from "@/components/MTitle/WrapTitle";
import MTitle from "@/components/MTitle/LevelTitle";

import ListItem from "./ListItem.vue";

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
      items: [
        {
          icon: "icon-yiqingfangkong",
          title: "疫情防控",
          color: "#D0021B",
          update_time: "今日8:00",
          slot: "yq",
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
        },
        {
          icon: "icon-jiaotongyongdu",
          title: "交通拥堵",
          color: "#F96F4F",
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
        },
        {
          icon: "icon-richangguanli",
          title: "风险事项",
          color: "#F23470",
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
        },
        {
          icon: "icon-renqunjuji",
          title: "人群聚集",
          color: "#2E9BCF",
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
        }
      ]
    };
  },
  methods: {
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
