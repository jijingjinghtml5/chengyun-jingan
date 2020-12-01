<template>
  <wrap-title class="gradient-bg" icon="icon-dihezhongdianquyu">
    <m-tabs slot="level-title" v-model="firstTab" :tabs="tabs" @change="handleChangeForTabItem"></m-tabs>
    <m-tabs-body :tab="secondTab">
      <m-tabs-body-item name="today" class="today-overview">
        <m-row>
          <m-column  v-for="item in todayItems" :key="item.name">
            <overview-item v-bind="item" customClass="style2" :dataset="dataset[item.prop]" @click.native="handleClickForOpenLayer(item)"></overview-item>
          </m-column>
        </m-row>
      </m-tabs-body-item>
      <m-tabs-body-item name="district">
        <m-row>
          <m-column  v-for="item in districtItems" :key="item.name">
            <overview-item v-bind="item"></overview-item>
          </m-column>
        </m-row>
      </m-tabs-body-item>
      <m-tabs-body-item v-for="item in todayItems" :key="item.prop" :name="item.prop" class="today-overview">
        <overview-item v-bind="item" customClass="style2" :dataset="dataset.prop" @click.native="handleClickForCloseLayer(item)"></overview-item>
      </m-tabs-body-item>
    </m-tabs-body>
  </wrap-title>
</template>
<script>
import WrapTitle from "@/components/MTitle/WrapTitle";
import MTabs from "@/components/MTabs";
import MRow from "@/components/Layout/MRow";
import MColumn from "@/components/Layout/MColumn";
import OverviewItem from "@/components/OverviewItem";
import MTabsBody from "@/components/MTabsBody/MTabsBody";
import MTabsBodyItem from "@/components/MTabsBody/MTabsBodyItem";
export default {
  name: "OverView",
  components: {
    WrapTitle,
    MTabs,
    MRow,
    MColumn,
    OverviewItem,
    MTabsBody,
    MTabsBodyItem
  },
  inheritAttrs: false,
  data() {
    return {
      tabs: Object.freeze([
        { label: "今日城运概况", value: "today" },
        { label: "全区概览", value: "district" }
      ]),
      todayItems: Object.freeze([
        { icon: "icon-tianqi", name: "气象指数", showIncrease: false, valueColor: "#6CCB73", prop: "qxzs" },
        { icon: "icon-jiaotongyongdu1", name: "交通拥堵指数", prop: "jtydzs" },
        { icon: "icon-ganzhi", name: "智能感知预警数", prop: "zngzyjs" },
        { icon: "icon-yuqing", name: "舆情热点数", prop: "yqrds" },
        { icon: "icon-huodong", name: "重大活动数", showIncrease: false, prop: "zdhds" }
      ]),
      districtItems: Object.freeze([
        { icon: "icon-renkouku", name: "实有人口", prop: "djyl", customClass: "style2" },
        { icon: "icon-GDP", name: "GDP", prop: "gggl", customClass: "style2" },
        { icon: "icon-shichang", name: "税收总量", prop: "ggaq", customClass: "style2" },
        { icon: "icon-chuzu", name: "商务楼宇", prop: "ggfw", customClass: "style2" },
        { icon: "icon-jiuye", name: "就业率", valueUnit: "%", prop: "shcy", customClass: "style2" }
      ]),
      firstTab: "today",
      secondTab: "today",
      dataset: {
        qxzs: {
          value: "正常"
        },
        jtydzs: {
          value: 10,
          increase: 0
        },
        zngzyjs: {
          value: 30,
          increase: -1.08
        },
        yqrds: {
          value: 10987,
          increase: 1.08
        },
        zdhds: {
          value: "开学日"
        }
      }
    };
  },
  methods: {
    handleClickForOpenLayer(item) {
      this.secondTab = item.prop;
      const layerName = `${item.prop}Layer`;
      this[layerName].setParameters({
        "data": {
          "content": [{ "x": -1733, "y": -917 }],
          "parsegeometry": "function(item){return {x:item.x, y:item.y}}"
        }
      }).open();
    },
    handleClickForCloseLayer(item) {
      this.secondTab = this.tabs[0].value;
      this[`${item.prop}Layer`].close();
    },
    handleChangeForTabItem(val) {
      this.secondTab = val;
    },
    registerLayersForTodayOverview() {
      this.todayItems.forEach(item => {
        const key = `${item.prop}Layer`;
        this[key] = this.$_mapProxy
          .registerLayer(key, item.name.slice(0, 4) + "图层")
          .setParameters({
            "name": key,
            "type": "point",
            "mode": "replace",
            "legendVisible": false,
            "popupEnabled": false,
            "isFiltered": true,
            "isLocate": false,
            "renderer": {
              type: "simple",
              symbol: {
                type: "simple-marker",
                size: 20,
                color: [0, 255, 244],
                outline: {
                  color: "#ffffff",
                  width: "1px"
                }
              }
            }
          });
      });
    }
  },
  created() {
    this.registerLayersForTodayOverview();
  }
};
</script>
<style lang="scss" scoped>
.m-tabs-body__item {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.today-overview {
  .overview-item {
    cursor: pointer;
  }
}
</style>
