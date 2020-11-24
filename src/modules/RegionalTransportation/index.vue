<template>
  <wrap-title class="gradient-bg" icon="icon-daolujiaotong" txt="区域交通">
    <m-select class="style1" slot="right" v-model="option" :options="options"></m-select>
    <m-row gutter="0.1rem">
      <m-column v-for="(item, index) in items" :key="item.key">
        <level-title :level="2" icon="icon-biaoti" :txt="item.label"></level-title>
        <p class="value" :style="{ color: colors[index] }">{{ dataset[item.key] | initVal | thousandCentimeter }}</p>
      </m-column>
    </m-row>
    <chart-line class="line-chart" :colors="colors" :chartData="dataset.chartData" :showYLabel="true" :isGradient="true" :gradientBySelf="true"></chart-line>
    <m-row class="row-style1 in-flex" gutter="0.1rem">
      <m-column>
        <level-title :level="2" icon="icon-biaoti" txt="实时拥堵堵路"></level-title>
        <div class="list">
          <div class="list-item" v-for="(item, i) in dataset.list" :key="i">
            <div class="list-item__id">{{ i + 1 }}</div>
            <overview-item
              class="list-item__content"
              v-bind="listConfig"
              :name="item.name"
              :dataset="item"
              >
            </overview-item>
          </div>
        </div>
      </m-column>
      <m-column>
        <level-title :level="2" icon="icon-biaoti" txt="交通客流"></level-title>
        <div class="list">
          <overview-item
              class="list-item"
              v-for="(item, i) in dataset.list2" :key="i"
              v-bind="listConfig2"
              :icon="item.icon"
              :name="item.name"
              :dataset="item"
              >
            </overview-item>
        </div>
      </m-column>
    </m-row>
  </wrap-title>
</template>
<script>
import LevelTitle from "@/components/MTitle/LevelTitle";
import WrapTitle from "@/components/MTitle/WrapTitle";
import MRow from "@/components/Layout/MRow";
import MColumn from "@/components/Layout/MColumn";
import ChartLine from "@/components/Charts/Line/ChartLine";
import OverviewItem from "@/components/OverviewItem";
import MSelect from "@/components/MSelect";
import { getDate } from "@/utils/tools";
import scssVar from "@/style/var.js";
export default {
  name: "RegionalTransportation",
  components: {
    LevelTitle,
    WrapTitle,
    MRow,
    MColumn,
    ChartLine,
    OverviewItem,
    MSelect
  },
  inheritAttrs: false,
  data() {
    return {
      colors: Object.freeze([scssVar.number, scssVar.numberSecondary]),
      items: Object.freeze([
        { label: "快速路拥堵指数", key: "kslydzs" },
        { label: "地面拥堵指数", key: "dmydzs" }
      ]),
      options: Object.freeze([
        { label: "今日", value: "today" },
        { label: "本周", value: "currentWeek" },
        { label: "本月", value: "currentMonth" }
      ]),
      listConfig: Object.freeze({
        valueUnit: "km/h",
        customClass: "style3",
        showIncrease: false,
        extraItems: [
          { label: "拥堵长度", prop: "width", unit: "km" },
          { label: "拥堵时间", prop: "time", unit: "h" }
        ]
      }),
      listConfig2: Object.freeze({
        customClass: "style3"
      }),
      option: "today",
      dataset: {
        kslydzs: 20.3,
        dmydzs: 60.3,
        chartData: [
          ["区域交通", "快速路拥堵指数", "地面拥堵指数"],
          ...(getDate("today").map(d => {
            return [d[0], Math.floor(Math.random() * 100), Math.floor(Math.random() * 100)];
          }))
        ],
        list: Object.freeze([
          { name: "南京西路 - 武宁路", value: 9.5, width: 10, time: 1.2 },
          { name: "灵石路 - 共和新路", value: 9.5, width: 10, time: 1.2 },
          { name: "大宁路 - 共和新路", value: 9.5, width: 10, time: 1.2 },
          { name: "南京西路111 - 武宁路", value: 9.5, width: 10, time: 1.2 }
        ]),
        list2: Object.freeze([
          { name: "上海火车站区域", icon: "icon-daolu", value: 20987, increase: 1.08 },
          { name: "轨道交通/公交车", icon: "icon-daolu", value: 40098, increase: -1.08 },
          { name: "网约车/出租车", icon: "icon-daolu", value: 3092, increase: 1.08 },
          { name: "共享单车", icon: "icon-daolu", value: 56248, increase: 0 }
        ])
      }
    };
  }
};
</script>
<style lang="scss" scoped>
.value {
  font-size: 0.72rem;
  line-height: 0.84rem;
  font-weight: bold;
}
.line-chart {
  height: 2rem;
}
.list {
  height: 0;
  flex: 1;
  overflow: auto;
}
.list-item {
  margin-bottom: 0.2rem;
  &:last-child {
    margin-bottom: 0;
  }
}
.list-item__id {
  float: left;
  width: 0.5rem;
  height: 0.5rem;
  border: 0.02rem solid #F23470;
  background-color: rgba(#F23470, 0.4);
  font-size: 0.28rem;
  text-align: center;
  color: #fff;
  line-height: 0.46rem;
}
.list-item__content {
  margin-left: 0.8rem;
}
</style>
