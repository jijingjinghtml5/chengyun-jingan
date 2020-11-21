<template>
  <wrap-title class="gradient-bg" icon="icon-daolu" txt="区域交通">
    <m-row gutter="0.1rem">
      <m-column v-for="(item, index) in items" :key="item.key">
        <level-title :level="2" icon="icon-biaoti" :txt="item.label"></level-title>
        <p class="value" :style="{ color: colors[index] }">{{ dataset[item.key] | initVal | thousandCentimeter }}</p>
      </m-column>
    </m-row>
    <chart-line class="line-chart" :colors="colors" :chartData="dataset.chartData" :showYLabel="true" :isGradient="true" :gradientBySelf="true"></chart-line>
    <m-row gutter="0.1rem">
      <m-column>
        <level-title :level="2" icon="icon-biaoti" txt="实时拥堵堵路"></level-title>
        <div class="list">
          <overview-item
            v-for="(item, i) in dataset.list" :key="i"
            v-bind="listConfig"
            :name="item.name"
            :dataset="item"
            >
          </overview-item>
        </div>
      </m-column>
      <m-column>
        <level-title :level="2" icon="icon-biaoti" txt="交通客流"></level-title>
        <div class="list"></div>
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
import { getDate } from "@/utils/tools";
export default {
  name: "RegionalTransportation",
  components: {
    LevelTitle,
    WrapTitle,
    MRow,
    MColumn,
    ChartLine,
    OverviewItem
  },
  data() {
    return {
      colors: Object.freeze(["#4FCFD5", "#BE6CCC"]),
      items: Object.freeze([
        { label: "快速路拥堵指数", key: "kslydzs" },
        { label: "地面拥堵指数", key: "dmydzs" }
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
  overflow: auto;
}
</style>
