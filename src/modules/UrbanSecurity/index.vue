<template>
  <wrap-title class="gradient-bg" icon="icon-zonghezhili" :txt="title">
    <span slot="center" v-show="tab !== 'overview'" class="back" @click="handleClickForBack">[返回上一级]</span>
    <m-tabs-body :tab="tab">
      <m-tabs-body-item name="overview">
        <m-row gutter="0.1rem">
          <m-column v-for="item in items" :key="item.name">
            <overview-item v-bind="item" customClass="style2" style="cursor: pointer" @click.native="handleClickForOverviewItem(item)"></overview-item>
          </m-column>
        </m-row>
      </m-tabs-body-item>
      <m-tabs-body-item name="sgy" class="detail">
        <m-row gutter="0.1rem">
          <m-column width="20%">
            <overview-item v-if="activeItem" v-bind="activeItem" customClass="style2"></overview-item>
          </m-column>
          <m-column width="30%">
            <level-title :level="2" icon="icon-biaoti" txt="水供应趋势"></level-title>
            <chart-line :chartData="dataset.sgy_chartData" :colors="colors" :smooth="true"></chart-line>
          </m-column>
          <m-column width="50%">
            <level-title :level="2" icon="icon-biaoti" txt="街镇用水量"></level-title>
            <chart-bar :chartData="dataset.sgy_chartData2" :colors="colors2"></chart-bar>
          </m-column>
        </m-row>
      </m-tabs-body-item>
      <m-tabs-body-item name="dlgy">
        <m-row gutter="0.1rem">
          <m-column width="20%">
            <overview-item v-if="activeItem" v-bind="activeItem" customClass="style2"></overview-item>
          </m-column>
          <m-column width="30%">

          </m-column>
          <m-column width="50%"></m-column>
        </m-row>
      </m-tabs-body-item>
      <m-tabs-body-item name="rqgy">
        <m-row gutter="0.1rem">
          <m-column width="20%">
            <overview-item v-if="activeItem" v-bind="activeItem" customClass="style2"></overview-item>
          </m-column>
          <m-column width="30%"></m-column>
          <m-column width="50%"></m-column>
        </m-row>
      </m-tabs-body-item>
      <m-tabs-body-item name="ljcl">
        <m-row gutter="0.1rem">
          <m-column width="20%">
            <overview-item v-if="activeItem" v-bind="activeItem" customClass="style2"></overview-item>
          </m-column>
          <m-column width="30%"></m-column>
          <m-column width="50%"></m-column>
        </m-row>
      </m-tabs-body-item>
      <m-tabs-body-item name="wscl">
        <m-row gutter="0.1rem">
          <m-column width="20%">
            <overview-item v-if="activeItem" v-bind="activeItem" customClass="style2"></overview-item>
          </m-column>
          <m-column width="30%"></m-column>
          <m-column width="50%"></m-column>
        </m-row>
      </m-tabs-body-item>
    </m-tabs-body>
  </wrap-title>
</template>
<script>
import LevelTitle from "@/components/MTitle/LevelTitle";
import WrapTitle from "@/components/MTitle/WrapTitle";
import MTabs from "@/components/MTabs";
import MRow from "@/components/Layout/MRow";
import MColumn from "@/components/Layout/MColumn";
import OverviewItem from "@/components/OverviewItem";
import MTabsBody from "@/components/MTabsBody/MTabsBody";
import MTabsBodyItem from "@/components/MTabsBody/MTabsBodyItem";
import ChartLine from "@/components/Charts/Line/ChartLineForCompare";
import ChartBar from "./ChartBar";
export default {
  name: "OverView",
  components: {
    LevelTitle,
    WrapTitle,
    MTabs,
    MRow,
    MColumn,
    OverviewItem,
    MTabsBody,
    MTabsBodyItem,
    ChartLine,
    ChartBar
  },
  inheritAttrs: false,
  data() {
    return {
      colors: Object.freeze(["#FCBF51", "#DED7D7"]),
      colors2: Object.freeze(["#30BC9B", "#92B9F7"]),
      items: Object.freeze([
        { icon: "icon-gongzuoliliangku", name: "水供应", nameUnit: "（吨）", prop: "sgy", extraItems: [{ label: "存量", prop: "stock" }] },
        { icon: "icon-dianxiangmen", name: "电力供应", nameUnit: "（kw）", prop: "dlgy", extraItems: [{ label: "存量", prop: "stock" }] },
        { icon: "icon-gongzuoliliangku", name: "燃气供应", nameUnit: "（m³）", prop: "rqgy", extraItems: [{ label: "存量", prop: "stock" }] },
        { icon: "icon-gongzuoliliangku", name: "垃圾处理", nameUnit: "（吨）", prop: "ljcl", extraItems: [{ label: "处理率", prop: "treatmentRate" }] },
        { icon: "icon-gongzuoliliangku", name: "污水处理", nameUnit: "（吨）", prop: "wscl", extraItems: [{ label: "处理率", prop: "treatmentRate" }] }
      ]),
      tab: "overview",
      activeItem: null,
      dataset: {
        sgy_chartData: [
          ["水供应趋势", "xxx", "xxx2"],
          ["11.02", 500, 400],
          ["11.03", 300, 199],
          ["11.04", 350, 400],
          ["11.05", 210, 120],
          ["11.06", 480, 300],
          ["11.07", 360, 250],
          ["11.08", 200, 100]
        ],
        sgy_chartData2: [
          ["街镇用水量", "xxx", "xxx2"],
          ["南西", 200, 100],
          ["静安寺", 200, 100],
          ["共和新", 200, 100],
          ["大宁路", 200, 100],
          ["曹家渡", 200, 100],
          ["天目西", 200, 100]
        ]
      }
    };
  },
  computed: {
    title() {
      let res = "城市保障";
      if (this.activeItem) {
        res += `-${this.activeItem.name}`;
      }
      return res;
    }
  },
  methods: {
    handleClickForOverviewItem(item) {
      this.tab = item.prop;
      this.activeItem !== item && (this.activeItem = item);
    },
    handleClickForBack() {
      this.tab = "overview";
      this.activeItem = null;
    }
  }
};
</script>
<style lang="scss" scoped>
.m-tabs-body__item {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.back {
  cursor: pointer;
  font-size: 0.24rem;
  color: #A8C7F9;
}
.detail {
  .m-row {
    height: 100%;
  }
  .m-column {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .v-chart-container {
    height: 0;
    flex: 1;
  }
}
</style>
