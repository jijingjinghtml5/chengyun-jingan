<template>
  <wrap-title class="gradient-bg" icon="icon-jingji" txt="经济发展">
    <m-select class="style1" slot="right" v-model="option" :options="options"></m-select>
    <m-row gutter="0.1rem">
      <m-column v-for="item in items" :key="item.key" @click.native="handleClickForOpenLayer(item)">
        <level-title :level="2" icon="icon-biaoti" :class="{ 'is-active': active === item.key }">
          {{ item.label }}<sub v-if="item.unit">{{ item.unit }}</sub>
        </level-title>
        <p class="value">{{ dataset[item.key] | initVal | thousandCentimeter }}</p>
      </m-column>
    </m-row>
    <chart-line class="line-chart" :colors="colors" :chartData="dataset.chartData" :showYLabel="true" :isGradient="true" :gradientBySelf="true" :showLegend="true" :legendConfig="legendConfig"></chart-line>
    <level-title :level="2" icon="icon-biaoti" txt="营商服务"></level-title>
    <m-row gutter="0.1rem">
      <m-column v-for="item in overviewItems" :key="item.name" width="50%">
        <overview-item
          :key="item.name"
          v-bind="item"
          customClass="style4">
        </overview-item>
      </m-column>
    </m-row>
    <p style="margin-bottom: 0.2rem">企业稳定期五色分布</p>
    <div class="chart-item in-flex">
      <chart-bar :chartData="dataset.chartBarData" :colors="colors2" :isCustom="true" :showYLabel="true" unit="%"></chart-bar>
    </div>
  </wrap-title>
</template>
<script>
import LevelTitle from "@/components/MTitle/LevelTitle";
import WrapTitle from "@/components/MTitle/WrapTitle";
import MRow from "@/components/Layout/MRow";
import MColumn from "@/components/Layout/MColumn";
import ChartLine from "@/components/Charts/Line/ChartLine";
import OverviewItem from "@/components/OverviewItem";
import ChartBar from "@/components/Charts/Bar/ChartBar";
import MSelect from "@/components/MSelect";
import { getDate } from "@/utils/tools";
export default {
  name: "EconomicDevelopment",
  components: {
    LevelTitle,
    WrapTitle,
    MRow,
    MColumn,
    ChartLine,
    OverviewItem,
    ChartBar,
    MSelect
  },
  inheritAttrs: false,
  data() {
    return {
      colors: Object.freeze(["#1ABC9C", "#679DF4", "#F96F4F", "#D0021B"]),
      colors2: Object.freeze(["#6CCB73", "#2E9BCF", "#FCBF51", "#F96F4F", "#D0021B"]),
      items: Object.freeze([
        { label: "企业融资", key: "qyrz", unit: "（亿元）" },
        { label: "重点企业", key: "zdqy", unit: "（家）" }
      ]),
      legendConfig: Object.freeze({
        top: 0,
        left: "center",
        icon: "line"
      }),
      overviewItems: Object.freeze([
        { name: "法人事务申报量", showIncrease: false, extraItems: [{ label: "网上申报量", prop: "online" }] },
        { name: "法人事务办结率", valueColor: "#1ABC9C", showIncrease: false, extraItems: [{ label: "节省时间", prop: "save" }] },
        { name: "企业问题汇集量" },
        { name: "企业问题解决率", valueColor: "#1ABC9C" }
      ]),
      options: Object.freeze([
        { label: "本周", value: "currentWeek" },
        { label: "本月", value: "currentMonth" }
      ]),
      option: "currentWeek",
      dataset: {
        qyrz: 10980,
        zdqy: 109,
        chartData: [
          ["区域交通", "新设", "迁入", "迁出", "注销"],
          ...(getDate("currentMonth").map(d => {
            return [d[0], Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100)];
          }))
        ],
        chartBarData: [
          ["企业稳定期五色分布", "企业稳定期五色分布"],
          ["0", 50],
          ["1", 30],
          ["2", 20],
          ["3", 5],
          ["4", 5]
        ]
      },
      active: null
    };
  },
  methods: {
    handleClickForOpenLayer(item) {
      const current = item.key;
      if (this.active !== current) {
        // this.active && this[this.active].close();
        this.active = current;
        this[`${current}Layer`].setParameters({
          "data": {
            "content": [{ "x": -1733, "y": -917 }],
            "parsegeometry": "function(item){return {x:item.x, y:item.y}}"
          }
        }).open();
      } else {
        this.active = null;
        this[`${current}Layer`].close();
      }
    },
    registerLayers() {
      this.items.forEach(item => {
        const key = `${item.key}Layer`;
        this[key] = this.$_mapProxy
          .registerLayer(key, item.label + "图层")
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
    this.registerLayers();
  }
};
</script>
<style lang="scss" scoped>
sub {
  bottom: 0;
}
.value {
  font-size: 0.72rem;
  line-height: 0.84rem;
  font-weight: bold;
  color:$number;
}
.line-chart {
  height: 2rem;
}
.overview-item {
  margin-bottom: 0.2rem;
}
.is-active {
  /deep/ {
    .title {
      color: $hover;
    }
  }
}
</style>
