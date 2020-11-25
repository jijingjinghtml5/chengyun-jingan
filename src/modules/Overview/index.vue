<template>
  <wrap-title class="gradient-bg" icon="icon-dihezhongdianquyu">
    <m-tabs slot="level-title" v-model="firstTab" :tabs="tabs" @change="handleChangeForTabItem"></m-tabs>
    <m-tabs-body :tab="secondTab">
      <m-tabs-body-item name="today" class="today-overview">
        <m-row>
          <m-column  v-for="item in todayItems" :key="item.name">
            <overview-item v-bind="item" customClass="style1" @click.native="handleClickForOpenLayer(item)"></overview-item>
          </m-column>
        </m-row>
      </m-tabs-body-item>
      <m-tabs-body-item name="district">
        <m-row>
          <m-column  v-for="item in districtItems" :key="item.name">
            <overview-item v-bind="item" customClass="style2"></overview-item>
          </m-column>
        </m-row>
      </m-tabs-body-item>
      <m-tabs-body-item v-for="item in todayItems" :key="item.prop" :name="item.prop" class="today-overview">
        <overview-item v-bind="item" customClass="style1" @click.native="handleClickForCloseLayer(item)"></overview-item>
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
        { icon: "icon-gongzuoliliang", name: "工作力量在岗率", valueUnit: "%", valueColor: "#6CCB73", prop: "gzllzgl" },
        { icon: "icon-shizhengyanghu", name: "市政养护执行率", valueUnit: "%", valueColor: "#6CCB73", prop: "szyhzxl" },
        { icon: "icon-jianshegongdi1", name: "在建工程巡查率", valueUnit: "%", valueColor: "#6CCB73", prop: "zjgcxcl" },
        { icon: "icon-wulianganzhi1", name: "智能感知在线率", valueUnit: "%", valueColor: "#6CCB73", prop: "zngzzxl" },
        { icon: "icon-jingtaijiaotong", name: "静态交通使用率", valueUnit: "%", valueColor: "#6CCB73", prop: "jtjtsyl" }
      ]),
      districtItems: Object.freeze([
        { icon: "icon-renkouku", name: "实有人口", nameUnit: "（万人）", showIncrease: false, prop: "syrk", extraItems: [{ label: "户籍人口占比", prop: "hjrkzb", unit: "%" }] },
        { icon: "icon-juminxiaoqu", name: "居民人口", nameUnit: "（个）", showIncrease: false, prop: "jmrk", extraItems: [{ label: "居委数", prop: "jws" }] },
        { icon: "icon-shichang", name: "商业楼园", nameUnit: "（个）", showIncrease: false, prop: "syly", extraItems: [{ label: "企业数", prop: "qys" }] },
        { icon: "icon-xuexiao", name: "教育资源", nameUnit: "（个）", showIncrease: false, prop: "jyzy", extraItems: [{ label: "学生教师比", prop: "xsjsb" }] },
        { icon: "icon-yiyuan", name: "医疗资源", nameUnit: "（个）", showIncrease: false, prop: "ylzy", extraItems: [{ label: "三甲医院", prop: "sjyy" }] },
        { icon: "icon-wulianganzhi1", name: "物联感知", nameUnit: "（台）", showIncrease: false, prop: "wlgz", extraItems: [{ label: "覆盖率", prop: "cover", unit: "%" }] }
      ]),
      firstTab: "today",
      secondTab: "today"
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
