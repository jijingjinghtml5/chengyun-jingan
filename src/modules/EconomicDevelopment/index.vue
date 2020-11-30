<template>
  <wrap-title class="gradient-bg" icon="icon-jingji" txt="经济发展">
    <p v-show="currentTab !== 'overview'" slot="center" class="goBack" @click="handleClickForChangeTab('overview')">[返回上一级]</p>
    <m-select class="style1" slot="right" v-model="option" :options="options"></m-select>
    <m-tabs-body :tab="currentTab">
      <m-tabs-body-item lazy name="overview">
        <m-row gutter="0.1rem">
          <!-- <m-column v-for="item in items" :key="item.key" @click.native="handleClickForOpenLayer(item)">
            <level-title :level="2" icon="icon-biaoti" :class="{ 'is-active': active === item.key }">
              {{ item.label }}<sub v-if="item.unit">{{ item.unit }}</sub>
            </level-title>
            <p class="value">{{ dataset[item.key] | initVal | thousandCentimeter }}</p>
          </m-column> -->
          <m-column>
            <level-title :level="2" icon="icon-biaoti" @click.native="handleClickForChangeTab('bqqynse')">
              百强企业纳税额<sub>（亿元）</sub>
            </level-title>
            <p class="value">{{ dataset.bqqynse | initVal | thousandCentimeter }}</p>
          </m-column>
          <m-column>
            <level-title :level="2" icon="icon-biaoti" :class="{ 'is-active': active === 'zdqy' }" @click.native="handleClickForOpenLayer(item)">
              重点企业<sub>（家）</sub>
            </level-title>
            <p class="value">{{ dataset.zdqy | initVal | thousandCentimeter }}</p>
          </m-column>
        </m-row>
        <level-title :level="2" icon="icon-biaoti">
          百强企业扶持款<sub>（亿元）</sub>
        </level-title>
        <chart-line-compare class="line-chart" :colors="colors2" :chartData="dataset.chartData2" :showYLabel="true" :isGradient="true" :gradientBySelf="true"></chart-line-compare>
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
        <div class="chart-item in-flex">
          <chart-line :chartData="dataset.chartData" :colors="colors" :showYLabel="true" :isGradient="true" :gradientBySelf="true" :showLegend="true" :legendConfig="legendConfig"></chart-line>
        </div>
      </m-tabs-body-item>
      <m-tabs-body-item lazy name="bqqynse">
        <m-row gutter="0.1rem">
          <m-column width="50%">
            <level-title :level="2" icon="icon-biaoti">
              百强企业纳税额<sub>（亿元）</sub>
            </level-title>
            <p class="value">{{ dataset.bqqynse | initVal | thousandCentimeter }}</p>
          </m-column>
        </m-row>
        <level-title :level="2" icon="icon-biaoti" txt="百强企业行业分布"></level-title>
        <chart-bar-y class="mb-20" style="height: 4rem;" :chartData="dataset.chartData3" :colors="colors3" :isGradient="true" labelColor="#fff" unit="%"></chart-bar-y>
        <div class="in-flex">
          <m-list :adaption="true" :dataset="dataset.tableData" :headers="headers" ></m-list>
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
import ChartLine from "@/components/Charts/Line/ChartLine";
import ChartLineCompare from "@/components/Charts/Line/ChartLineForCompare";
import OverviewItem from "@/components/OverviewItem";
import ChartBarY from "@/components/Charts/BarY/ChartBarYForValuePosition";
import MSelect from "@/components/MSelect";
import MTabsBody from "@/components/MTabsBody/MTabsBody";
import MTabsBodyItem from "@/components/MTabsBody/MTabsBodyItem";
import MList from "@/components/MList";
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
    ChartBarY,
    MSelect,
    ChartLineCompare,
    MTabsBody,
    MTabsBodyItem,
    MList
  },
  inheritAttrs: false,
  data() {
    return {
      colors: Object.freeze(["#1ABC9C", "#679DF4", "#F96F4F", "#D0021B"]),
      colors2: Object.freeze(["#4FCFD5", "#DED7D7"]),
      colors3: Object.freeze(["#4FCFD5", "#2E9BCF"]),
      items: Object.freeze([
        { label: "百强企业纳税额", key: "bqqynse", unit: "（亿元）" },
        { label: "重点企业", key: "zdqy", unit: "（家）" }
      ]),
      legendConfig: Object.freeze({
        top: 0,
        left: "center",
        icon: "line"
      }),
      overviewItems: Object.freeze([
        { name: "法人事务申报量", showIncrease: false, extraItems: [{ label: "网上申报量", prop: "online" }] },
        { name: "法人事务办结率", valueColor: "#1ABC9C", showIncrease: false, extraItems: [{ label: "节省时间", prop: "save" }] }
      ]),
      options: Object.freeze([
        { label: "本周", value: "currentWeek" },
        { label: "本月", value: "currentMonth" }
      ]),
      headers: Object.freeze([
        { label: "企业名称", prop: "name", ratio: 1.5 },
        { label: "所属企业", prop: "belong" },
        { label: "企业类型", prop: "type" },
        { label: "纳税金额", prop: "value" }
      ]),
      option: "currentWeek",
      dataset: {
        bqqynse: 10980,
        zdqy: 109,
        chartData: [
          ["区域交通", "新设", "迁入", "迁出", "注销"],
          ...(getDate("currentMonth").map(d => {
            return [d[0], Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100)];
          }))
        ],
        chartData2: [
          ["百强企业扶持款", "xxx1", "xxx2"],
          [2015, Math.floor(Math.random() * 100), Math.floor(Math.random() * 100)],
          [2016, Math.floor(Math.random() * 100), Math.floor(Math.random() * 100)],
          [2017, Math.floor(Math.random() * 100), Math.floor(Math.random() * 100)],
          [2018, Math.floor(Math.random() * 100), Math.floor(Math.random() * 100)],
          [2019, Math.floor(Math.random() * 100), Math.floor(Math.random() * 100)]
        ],
        chartData3: [
          ["百强企业行业分布", "百强企业行业分布"],
          ["信息服务", 25.12],
          ["房地产", 20.11],
          ["高端制造", 18.96],
          ["餐饮", 17.88],
          ["出版", 16.21],
          ["金融", 15.98],
          ["游戏", 14.56],
          ["娱乐传媒", 12.78],
          ["生物医疗", 11.49],
          ["软件开发", 6.15]
        ],
        tableData: [
          { id: 1, name: "上海数据交易中心", belong: "大数据", type: "上市公司", value: 15000 },
          { id: 2, name: "辉瑞医疗", belong: "医疗", type: "其他", value: 12000 },
          { id: 3, name: "竹间科技", belong: "人工智能", type: "其他", value: 8000 },
          { id: 4, name: "联数物联", belong: "大数据", type: "上市公司", value: 8000 },
          { id: 5, name: "晶赞科技", belong: "人工智能", type: "其他", value: 8000 },
          { id: 6, name: "小熊教育", belong: "教育", type: "其他", value: 6000 },
          { id: 7, name: "叮咚买菜", belong: "电商", type: "上市公司", value: 5000 },
          { id: 8, name: "饿了么", belong: "电商", type: "其他", value: 2000 },
          { id: 9, name: "京东金融", belong: "金融", type: "其他", value: 1000 },
          { id: 10, name: "小米集团", belong: "高端制造", type: "上市公司", value: 1000 },
          { id: 11, name: "美团外卖", belong: "电子商务", type: "其他", value: 800 }
        ]
      },
      active: null,
      currentTab: "overview"
    };
  },
  methods: {
    handleClickForChangeTab(tab) {
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
.m-tabs-body__item {
  display: flex;
  flex-direction: column;
}
.value {
  font-size: 0.72rem;
  line-height: 0.84rem;
  font-weight: bold;
  color:$number;
}
.line-chart {
  height: 3rem;
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
.m-list {
  /deep/ {
    .list-header {
      font-size: 0.24rem;
      color: $titleLevel2;
      border-bottom: 2px solid #4E78A4;
    }
    .list-header__item {
      height: 0.4rem;
    }
    .cell {
      line-height: 1;
    }
    .list-body {
      height: calc(100% - 0.6rem);
    }
  }
}
</style>
