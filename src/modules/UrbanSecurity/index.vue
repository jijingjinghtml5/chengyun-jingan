<template>
  <wrap-title class="gradient-bg" icon="icon-zonghezhili" :txt="title">
    <span slot="center" v-show="tab !== 'overview'" class="back" @click="handleClickForBack">[返回上一级]</span>
    <!-- <m-select class="style1" slot="right" v-model="option" :options="options"></m-select> -->
    <m-tabs-body :tab="tab">
      <m-tabs-body-item name="overview">
        <m-row gutter="0.1rem">
          <m-column v-for="item in items" :key="item.name" :span="item.span || 1">
            <!-- @click.native="handleClickForOverviewItem(item)" -->
            <overview-item
            v-bind="item"
            :dataset="itemsData[item.name] || dataset[item.prop]"
            customClass="style2" style="cursor: pointer"></overview-item>
          </m-column>
        </m-row>
      </m-tabs-body-item>
      <m-tabs-body-item name="sgy" class="detail">
        <m-row gutter="0.1rem">
          <m-column width="20%">
            <overview-item class="active" v-if="activeItem" v-bind="activeItem" customClass="style2"></overview-item>
          </m-column>
          <m-column width="80%">
            <chart-line :chartData="dataset.sgy_chartData" :colors="colors" :smooth="true"></chart-line>
          </m-column>
          <!-- <m-column width="50%">
            <level-title :level="2" icon="icon-biaoti" txt="街镇用水量"></level-title>
            <chart-bar :chartData="dataset.sgy_chartData2" :colors="colors2"></chart-bar>
          </m-column> -->
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
import MSelect from "@/components/MSelect";
import { getData } from "./api";
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
    ChartBar,
    MSelect
  },
  inheritAttrs: false,
  data() {
    return {
      colors: Object.freeze(["#4FCFD5", "#DED7D7"]),
      colors2: Object.freeze(["#30BC9B", "#92B9F7"]),
      items: Object.freeze([
        { icon: "icon-chuzhililiang1", name: "处置力量", nameUnit: "(人)", showIncrease: false, prop: "water_supply" },
        { icon: "icon-zaigangrenshu", name: "在岗人数", nameUnit: "(人)", showIncrease: false, prop: "power_supply" },
        { icon: "icon-ganzhi", name: "智能感知预警", showIncrease: false, valueUnit: "%", prop: "zngzyj" },
        { icon: "icon-wanggeanjian", name: "网格案件数", nameUnit: "(件)", showIncrease: false, prop: "wet_garbage" },
        { icon: "icon-rexian", span: 1.2, name: "市民服务热线", nameUnit: "(件)", showIncrease: false, prop: "recyclable_waste" }
      ]),
      options: Object.freeze([
        { label: "本周", value: "currentWeek" },
        { label: "本月", value: "currentMonth" }
      ]),
      tab: "overview",
      activeItem: null,
      option: "currentWeek",
      dataset: {
        zngzyj: {
          value: "-"
        },
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
      },
      itemsData: {}
    };
  },
  computed: {
    title() {
      let res = "城市运行";
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
    },
    getData() {
      getData().then(res => {
        // console.log(res);
        // if (res.db && res.db[0]) {
        //   this.dataset.water_supply = res.db[0].water_supply;
        //   this.dataset.power_supply = res.db[0].power_supply;
        //   this.dataset.dry_garbage = res.db[0].dry_garbage;
        //   this.dataset.wet_garbage = res.db[0].wet_garbage;
        //   this.dataset.recyclable_waste = res.db[0].recyclable_waste;
        // }
        if (res.api) {
          this.dataset.zngzyj = {
            value: Math.round(res.api.device_online_percent * 100) / 100
          };
        }
        let tmp = {};
        (res.items || []).map(item => {
          tmp[item.name] = item;
        });
        this.itemsData = tmp;
      });
    }
  },
  created() {
    this.$timer.register(this.getData, this);
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
  .active {
    /deep/ {
      .overview-item__name {
        color: $titleActive;
        font-weight: bold;
      }
    }
  }
}
</style>
