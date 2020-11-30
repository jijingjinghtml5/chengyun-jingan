<template>
  <wrap-title class="gradient-bg" icon="icon-jingji" txt="民生保障">
    <p v-show="currentTab !== 'overview'" slot="center" class="goBack" @click="handleClickForChangeTab('overview')">[返回上一级]</p>
    <m-select class="style1" slot="right" v-model="option" :options="options"></m-select>
    <m-tabs-body class="in-flex" :tab="currentTab">
      <m-tabs-body-item class="is-flex-column" lazy name="overview">
        <m-row gutter="0.1rem" @click.native="handleClickForChangeTab('detail')">
          <m-column v-for="(item, index) in items" :key="item.key" @click.native="handleClickForOpenLayer(item)">
            <level-title :level="2" icon="icon-biaoti" :class="{ 'is-active': active === item.key }">
              {{ item.label }}<sub v-if="item.unit">{{ item.unit }}</sub>
            </level-title>
            <p class="value" :style="{ color: colors3[index] }">{{ dataset[item.key] | initVal | thousandCentimeter }}</p>
          </m-column>
        </m-row>
        <chartline-compare class="line-chart" :colors="colors" :chartData="dataset.chartData" :showYLabel="true"></chartline-compare>
          <level-title :level="2" icon="icon-biaoti" txt="菜价监控" @click.native="handleClickForChangeTab('price')"></level-title>
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
      </m-tabs-body-item>
      <m-tabs-body-item class="is-flex-column" lazy name="detail">
        <m-row gutter="0.1rem">
          <m-column v-for="(item, index) in items" :key="item.key" @click.native="handleClickForOpenLayer(item)">
            <level-title :level="2" icon="icon-biaoti" :class="{ 'is-active': active === item.key }">
              {{ item.label }}<sub v-if="item.unit">{{ item.unit }}</sub>
            </level-title>
            <p class="value" :style="{ color: colors3[index] }">{{ dataset[item.key] | initVal | thousandCentimeter }}</p>
          </m-column>
        </m-row>
        <m-row gutter="0.1rem">
          <m-column>
            <p class="litter-title">
              救助户类型
            </p>
            <chart-pie style="height: 2.5rem;" :chartData="dataset.chartData3" :colors="colors4" :fontSize="0.24" :labelColor="labelColor" :isRose="true"></chart-pie>
          </m-column>
          <m-column>
            <p class="litter-title">
              救助金发放金额
            </p>
            <chart-pie style="height: 2.5rem;" :chartData="dataset.chartData3" :colors="colors4" :fontSize="0.24" :labelColor="labelColor" :isRose="true"></chart-pie>
          </m-column>
        </m-row>
        <div class="list in-flex is-flex-column">
          <div class="list-header">
            各类救助对象
          </div>
          <auto-scroll-wrap
            class="in-flex"
            v-show="dataset.objects && dataset.objects.length"
            :isVirtual="true"
            :dataset="dataset.objects"
            :distance="createFnForCalcRealPx(1.3)"
            :interval="1000">
            <RecycleScroller
              ref="wrap"
              :items="dataset.objects"
              :itemSize="createFnForCalcRealPx(1.4)"
              :keyField="'id'"
              v-slot="{ item }">
              <div class="li-item">
                <div class="li-item__info">
                  <div class="li-item__name">
                    {{ item.name }}
                  </div>
                  <div class="li-item__others">
                    <p class="text-ellipsis">对象住址：{{ item.address }}</p>
                    <p class="text-ellipsis">具体问题：{{ item.problem }}</p>
                  </div>
                </div>
                <ul class="li-item__ways">
                  <li v-for="way in ways" :key="way.key" :class="{ 'is-active': item.ways.indexOf(way.key) !== -1 }">
                    {{ way.label }}
                  </li>
                </ul>
              </div>
            </RecycleScroller>
          </auto-scroll-wrap>
          <p v-show="!dataset.objects || !dataset.objects.length" class="no-data-tip">暂无数据</p>
        </div>
      </m-tabs-body-item>
      <m-tabs-body-item name="price" lazy class="is-flex-column">
        <level-title :level="2" icon="icon-biaoti" txt="菜价监控"></level-title>
        <div class="price-wp in-flex ">
          <div class="price-item" v-for="item in overviewItemsForAll" :key="item.name">
            <overview-item
              class="price-item__overview"
              v-bind="item"
              customClass="style4">
            </overview-item>
            <div class="price-item__chart">
              <chartline-compare :chartData="dataset.testData" :colors="colors" :isGradient="true" :gradientBySelf="true"></chartline-compare>
            </div>
          </div>
        </div>
      </m-tabs-body-item>
    </m-tabs-body>
  </wrap-title>
</template>
<script>
import LevelTitle from "@/components/MTitle/LevelTitle";
import WrapTitle from "@/components/MTitle/WrapTitle";
import MRow from "@/components/Layout/MRow";
import MColumn from "@/components/Layout/MColumn";
import OverviewItem from "@/components/OverviewItem";
import MSelect from "@/components/MSelect";
import MTabsBody from "@/components/MTabsBody/MTabsBody";
import MTabsBodyItem from "@/components/MTabsBody/MTabsBodyItem";
import ChartLine from "@/components/Charts/Line/ChartLine";
import ChartlineCompare from "@/components/Charts/Line/ChartLineForCompare";
import ChartPie from "@/components/Charts/Pie/ChartPie3";
import AutoScrollWrap from "@/components/AutoScrollWrap";
import { RecycleScroller } from "vue-virtual-scroller";
import "vue-virtual-scroller/dist/vue-virtual-scroller.css";
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
    MSelect,
    MTabsBody,
    MTabsBodyItem,
    ChartPie,
    AutoScrollWrap,
    RecycleScroller
  },
  inject: ["createFnForCalcRealPx"],
  inheritAttrs: false,
  data() {
    return {
      colors: Object.freeze(["#4FCFD5", "#DED7D7"]),
      colors2: Object.freeze(["#1ABC9C", "#679DF4", "#F96F4F", "#D0021B"]),
      colors3: Object.freeze([ScssVar.number, "#1ABC9C"]),
      colors4: Object.freeze(["#4FCFD5", "#30BC9B", "#2E9BCF", "#6CCB73", "#BE6CCC", "#989898"]),
      labelColor: ScssVar.titleLevel2,
      legendConfig: Object.freeze({
        top: 0,
        left: "center",
        icon: "line"
      }),
      options: Object.freeze([
        { label: "本周", value: "currentWeek" },
        { label: "本月", value: "currentMonth" }
      ]),
      items: Object.freeze([
        { label: "救助对象数", key: "jzdxs", unit: "（户）" },
        { label: "救助金额", key: "jzje", unit: "（万元）" }
      ]),
      overviewItems: Object.freeze([
        { name: "肉禽蛋水产均价（元）" },
        { name: "蔬菜豆制品均价（元）" },
        { name: "米面粮油均价（元）" },
        { name: "水果均价（元）" }
      ]),
      overviewItemsForAll: Object.freeze([
        { name: "肉禽蛋水产均价（元）" },
        { name: "水产海鲜均价（元）" },
        { name: "蔬菜均价（元）" },
        { name: "米面粮油均价（元）" },
        { name: "水果均价（元）" },
        { name: "豆制品均价（元）" }
      ]),
      ways: Object.freeze([
        { label: "解决就业", key: 0 },
        { label: "解决就餐", key: 1 },
        { label: "慈善帮困", key: 2 },
        { label: "街道帮扶", key: 3 },
        { label: "临时补助", key: 4 }
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
        ],
        chartData3: [
          ["救助户类型", "救助户类型"],
          ["低保人员", 25000],
          ["重残无业", 12500],
          ["临时救助", 12500],
          ["特困供养", 10000],
          ["医疗救助", 7000],
          ["慈善帮困", 6666]
        ],
        objects: [
          { id: 1, name: "代用名", address: "临汾路299弄3号301室", problem: "失业在家，失火困难，有一定存款", ways: [0, 4] },
          { id: 2, name: "代用名", address: "临汾路299弄3号301室", problem: "失业在家，失火困难，有一定存款", ways: [1, 4] },
          { id: 3, name: "代用名", address: "临汾路299弄3号301室", problem: "失业在家，失火困难，有一定存款", ways: [2, 4] },
          { id: 4, name: "代用名", address: "临汾路299弄3号301室", problem: "失业在家，失火困难，有一定存款", ways: [1, 4] },
          { id: 5, name: "代用名", address: "临汾路299弄3号301室", problem: "失业在家，失火困难，有一定存款", ways: [1, 4] },
          { id: 6, name: "代用名", address: "临汾路299弄3号301室", problem: "失业在家，失火困难，有一定存款", ways: [1, 4] },
          { id: 7, name: "代用名", address: "临汾路299弄3号301室", problem: "失业在家，失火困难，有一定存款", ways: [1, 4] },
          { id: 8, name: "代用名", address: "临汾路299弄3号301室", problem: "失业在家，失火困难，有一定存款", ways: [1, 4] }
        ],
        testData: [
          ["菜价", "今日", "作日"],
          ...(getDate("today").map(d => {
            return [d[0], Math.floor(Math.random() * 100), Math.floor(Math.random() * 100)];
          }))
        ]
      },
      active: null,
      currentTab: "overview"
    };
  },
  methods: {
    handleClickForChangeTab(tab) {
      // if (this.currentTab !== tab) {
      //   this.currentTab = tab;
      // } else {
      //   this.currentTab = "overview";
      // }
      this.currentTab = tab;
    },
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

.goBack {
  font-size: 0.24rem;
  color: #A8C7F9;
  margin-top: 0.2rem;
  cursor: pointer;
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
.litter-title {
  font-size: 0.24rem;
  color: $titleLevel2;
}
.list-header {
  @extend .litter-title;
  height: 0.4rem;
  border-top: 0.02rem solid #4E78A4;
  border-bottom: 0.02rem solid #4E78A4;
  line-height: 0.36rem;
}
.li-item {
  height: 1.3rem;
  padding: 0.1rem 0;
  border-bottom: 0.02rem solid #4E78A4;
}
.li-item__info {
  display: flex;
  align-items: center;
  // height: 0.9rem;
}
.li-item__name {
  font-size: 0.32rem;
  font-weight: bold;
  color: #fff;
  width: 2rem;
  text-align: center;
}
.li-item__others {
  // font-size: 0.24rem;
  color: #fff;
  > p {
    font-size: 0.24rem;
    line-height: 0.36rem;
  }
}
.li-item__ways {
  display: flex;
  > li {
    width: 0;
    flex: 1;
    margin-right: 0.1rem;
    color: #92B9F7;
    line-height: 0.36rem;
    background: linear-gradient(180deg, #5458A9 0%, #154FA3 100%);
    border: 1px solid #0C52C0;
    text-align: center;
    &.is-active {
      color: #F6F6F6;
      background: linear-gradient(180deg, #5458A9 0%, #154FA3 100%);
      border: 0.02rem solid #679DF4;
    }
    &:last-of-type {
      margin-right: 0;
    }
  }
}
.no-data-tip {
  font-size: 0.24rem;
  color: #fff;
  line-height: 0.36rem;
}

.price-wp {
  overflow: auto;
}
.price-item {
  display: flex;
  align-items: center;
  border-bottom: 0.02rem solid #4E78A4;
}
.price-item__overview,
.price-item__chart {
  width: 0;
  flex: 1;
}
.price-item__chart {
  height: 1.5rem;
}
</style>
