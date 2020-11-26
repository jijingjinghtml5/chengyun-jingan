<template>
  <wrap-title class="gradient-bg" icon="icon-jingji" txt="民生保障">
    <m-select class="style1" slot="right" v-model="option" :options="options"></m-select>
    <m-row gutter="0.1rem">
      <m-column v-for="(item, index) in items" :key="item.key" @click.native="handleClickForOpenLayer(item)">
        <level-title :level="2" icon="icon-biaoti" :class="{ 'is-active': active === item.key }">
          {{ item.label }}<sub v-if="item.unit">{{ item.unit }}</sub>
        </level-title>
        <p class="value" :style="{ color: colors3[index] }">{{ dataset[item.key] | initVal | thousandCentimeter }}</p>
      </m-column>
    </m-row>
    <chartline-compare class="line-chart" :colors="colors" :chartData="dataset.chartData" :showYLabel="true"></chartline-compare>
    <!-- <chart-line class="line-chart" :colors="colors" :chartData="dataset.chartData" :showYLabel="true" :isGradient="true" :gradientBySelf="true" :showLegend="true" :legendConfig="legendConfig"></chart-line> -->
    <level-title :level="2" icon="icon-biaoti" txt="菜价监控"></level-title>
    <m-row gutter="0.1rem">
      <m-column v-for="item in overviewItems" :key="item.name" width="50%">
        <overview-item
          :key="item.name"
          v-bind="item"
          customClass="style4">
        </overview-item>
      </m-column>
    </m-row>
    <p style="margin-bottom: 0.2rem">菜价变化趋势</p>
    <div class="chart-item in-flex">
      <chart-line :chartData="dataset.chartData2" :colors="colors2" :showYLabel="true" :isGradient="true" :gradientBySelf="true" :showLegend="true" :legendConfig="legendConfig"></chart-line>
    </div>
  </wrap-title>
</template>
<script>
import LevelTitle from "@/components/MTitle/LevelTitle";
import WrapTitle from "@/components/MTitle/WrapTitle";
import MRow from "@/components/Layout/MRow";
import MColumn from "@/components/Layout/MColumn";
import OverviewItem from "@/components/OverviewItem";
import ChartLine from "@/components/Charts/Line/ChartLine";
import ChartlineCompare from "@/components/Charts/Line/ChartLineForCompare";
import MSelect from "@/components/MSelect";
import { getDate } from "@/utils/tools";
import ScssVar from "@/style/var.js";
export default {
  name: "LivelihoodSecurity",
  components: {
    LevelTitle,
    WrapTitle,
    MRow,
    MColumn,
    ChartLine,
    OverviewItem,
    ChartlineCompare,
    MSelect
  },
  inheritAttrs: false,
  data() {
    return {
      colors: Object.freeze(["#4FCFD5", "DED7D7"]),
      colors2: Object.freeze(["#1ABC9C", "#679DF4", "#F96F4F", "#D0021B"]),
      // colors2: Object.freeze(["#6CCB73", "#2E9BCF", "#FCBF51", "#F96F4F", "#D0021B"]),
      colors3: Object.freeze([ScssVar.number, "#1ABC9C"]),
      items: Object.freeze([
        { label: "救助对象数", key: "jzdxs", unit: "（户）" },
        { label: "救助金额", key: "jzje", unit: "（万元）" }
      ]),
      legendConfig: Object.freeze({
        top: 0,
        left: "center",
        icon: "line"
      }),
      overviewItems: Object.freeze([
        { name: "肉禽蛋水产均价（元）" },
        { name: "蔬菜豆制品均价（元）" },
        { name: "米面粮油均价（元）" },
        { name: "水果均价（元）" }
      ]),
      options: Object.freeze([
        { label: "本周", value: "currentWeek" },
        { label: "本月", value: "currentMonth" }
      ]),
      option: "currentWeek",
      dataset: {
        jzdxs: 10980,
        jzje: 92980,
        chartData: [
          ["xxx", "xxx1", "xxx2"],
          ...(getDate("today").map(d => {
            return [d[0], Math.floor(Math.random() * 100), Math.floor(Math.random() * 100)];
          }))
        ],
        chartData2: [
          ["菜价变化趋势", "肉禽蛋水产", "蔬菜豆制品", "米面粮油", "水果"],
          ...(getDate("currentMonth").map(d => {
            return [d[0], Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100)];
          }))
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
