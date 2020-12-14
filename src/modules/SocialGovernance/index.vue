<template>
  <wrap-title class="gradient-bg" icon="icon-shehuizhili" txt="社会治理">
    <!-- <m-select class="style1" slot="right" v-model="option" :options="options"></m-select> -->
    <level-title :level="2" icon="icon-biaoti">
      <m-tabs class="levelt2-select" v-model="tab" :tabs="tabs"></m-tabs>
    </level-title>
    <m-tabs-body :tab="tab">
      <m-tabs-body-item name="社会治安">
        <m-row>
          <m-column width="50%">
            <overview-item
              name="刑事案件发生数（起）"
              value="30"
              increase="18.45"
              customClass="style6">
            </overview-item>
          </m-column>
          <m-column width="50%">
            <overview-item
              name="治安案件发生数（起）"
              value="42"
              increase="6.11"
              customClass="style6">
            </overview-item>
          </m-column>
          <m-column width="50%" >
            <overview-item
              name="交通事故发生数（㎡）"
              value="5"
              increase="6.11"
              customClass="style6">
            </overview-item>
          </m-column>
          <m-column width="50%" >
            <overview-item
              name="火灾发生数（㎡）"
              value="0"
              :increase="0"
              customClass="style6">
            </overview-item>
          </m-column>
        </m-row>
      </m-tabs-body-item>
      <m-tabs-body-item name="社会救助">
        <m-row>
          <m-column width="50%">
            <overview-item
              name="居家养老服务（人次）"
              value="2987"
              :increase="18.45"
              customClass="style6">
            </overview-item>
          </m-column>
          <m-column width="50%">
            <overview-item
              name="社会综合帮扶（人次）"
              value="42"
              :increase="-6.11"
              customClass="style6">
            </overview-item>
          </m-column>
          <m-column width="33.33%">
            <overview-item
              name="廉租房受理(人次)"
              value="5982"
              :increase="18.45"
              customClass="style6">
            </overview-item>
          </m-column>
          <m-column width="33.33%">
            <overview-item
              name="新增就业岗位(个)"
              value="65432"
              :increase="6.11"
              customClass="style6">
            </overview-item>
          </m-column>
          <m-column width="33.33%">
            <overview-item
              name="法律援助咨询(人)"
              value="76"
              :increase="0"
              customClass="style6">
            </overview-item>
          </m-column>
        </m-row>
      </m-tabs-body-item>
    </m-tabs-body>
    <level-title :level="2" icon="icon-biaoti" txt="民生民意"></level-title>
    <m-row>
      <m-column width="50%">
        <overview-item
          name="信访接待数（件）"
          value="201"
          :increase="36.27"
          customClass="style6">
        </overview-item>
      </m-column>
      <m-column width="50%">
        <overview-item
          name="12345诉求数（人）"
          value="502"
          :increase="6.30"
          customClass="style6">
        </overview-item>
      </m-column>
      <m-column width="50%">
        <overview-item
          name="市民满意度"
          value="90"
          valueUnit="%"
          :increase="36.27"
          customClass="style6">
        </overview-item>
      </m-column>
      <m-column width="50%">
        <overview-item
          name="问题解决率"
          value="99.8"
          valueUnit="%"
          :increase="-6.30"
          customClass="style6">
        </overview-item>
      </m-column>
    </m-row>
    <level-title :level="2" icon="icon-biaoti" txt="民生保障"></level-title>
    <chart-line class="in-flex" :chartData="dataset.chartData" :colors="colors" :showYLabel="true" :isGradient="true" :gradientBySelf="true" :showLegend="true" :legendConfig="legendConfig"></chart-line>
  </wrap-title>
</template>
<script>
import WrapTitle from "@/components/MTitle/WrapTitle";
import LevelTitle from "@/components/MTitle/LevelTitle";
import MSelect from "@/components/MSelect";
import MRow from "@/components/Layout/MRow";
import MColumn from "@/components/Layout/MColumn";
import OverviewItem from "@/components/OverviewItem";
import MTabs from "@/components/MTabs";
import MTabsBody from "@/components/MTabsBody/MTabsBody";
import MTabsBodyItem from "@/components/MTabsBody/MTabsBodyItem";
import ChartLine from "@/components/Charts/Line/ChartLine";
import { getDate } from "@/utils/tools";
export default {
  name: "UrbanGovernance",
  components: {
    WrapTitle,
    LevelTitle,
    MSelect,
    MRow,
    MColumn,
    OverviewItem,
    MTabs,
    MTabsBody,
    MTabsBodyItem,
    ChartLine
  },
  inject: ["createFnForCalcRealPx"],
  data() {
    return {
      colors: Object.freeze(["#1ABC9C", "#679DF4", "#F96F4F", "#D0021B"]),
      legendConfig: Object.freeze({
        top: 0,
        left: "center",
        icon: "line",
        textStyle: {
          color: "#D1C9C4",
          fontSize: this.createFnForCalcRealPx(0.24)
        }
      }),
      options: Object.freeze([
        { label: "本周", value: "currentWeek" },
        { label: "本月", value: "currentMonth" }
      ]),
      tabs: Object.freeze([
        { label: "社会治安", value: "社会治安" },
        { label: "社会救助", value: "社会救助" }
      ]),
      option: "currentWeek",
      tab: "社会治安",
      dataset: {
        chartData: [
          ["民生保障", "肉禽蛋水产", "蔬菜豆制品", "米面粮油", "水果"],
          ...(getDate("currentMonth").map(d => {
            return [d[0], Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100)];
          }))
        ]
      }
    };
  }
};
</script>
<style lang="scss" scoped>
.m-tabs-body {
  height: auto;
}
.levelt2-select {
  &.m-tabs {
    color: #4E78A4;
  }
}
</style>
