<template>
  <wrap-title class="gradient-bg" icon="icon-daolujiaotong" txt="区域交通">
    <p v-show="currentTab !== 'overview'" slot="center" class="goBack" @click="handleClickForChangeTab('overview')">[返回上一级]</p>
    <m-select class="style1" slot="right" v-model="option" :options="options"></m-select>
    <m-tabs-body class="in-flex" :tab="currentTab">
      <m-tabs-body-item lazy class="is-flex-column" name="overview">
        <m-row gutter="0.1rem">
          <m-column v-for="(item, index) in items" :key="item.key">
            <level-title :level="2" icon="icon-biaoti" :txt="item.label" class="canClick" :class="{ 'is-active': activeLayer === item.key }" @click.native="handleClickForOpenLayer(item)"></level-title>
            <p class="value" :style="{ color: colors[index] }">{{ dataset[item.key] | initVal | thousandCentimeter }}</p>
          </m-column>
        </m-row>
        <chart-line class="line-chart" :colors="colors" :chartData="dataset.chartData" :showYLabel="true" :isGradient="true" :gradientBySelf="true"></chart-line>
        <m-row class="row-style1 in-flex" gutter="0.1rem">
          <m-column>
            <level-title :level="2" icon="icon-biaoti" txt="实时拥堵路段"></level-title>
            <div class="list congestionType">
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
            <div class="list trafficFlow">
              <overview-item
                class="list-item canClick"
                v-for="item in trafficFlow"
                customClass="style3"
                :key="item.key"
                :icon="item.icon"
                :name="item.name"
                @click.native="handleClickForOpenLayer(item)">
              </overview-item>
            </div>
          </m-column>
        </m-row>
      </m-tabs-body-item>
      <m-tabs-body-item lazy name="congestionType" class="is-flex-column">
        <m-row gutter="0.1rem">
          <m-column width="50%">
            <level-title :level="2" icon="icon-biaoti">
              <m-select class="traffic-select" v-model="currentCongestionType" :options="items"></m-select>
            </level-title>
            <p class="value" :style="{ color: currentCongestionType === 'kslydzs' ? colors[0] : colors[1] }">{{ dataset.trainStation | initVal | thousandCentimeter }}</p>
          </m-column>
        </m-row>
        <chartline-compare style="height: 2rem;" :chartData="dataset.testData" :colors="colors2" :showYLabel="true" :isGradient="true" :gradientBySelf="true"></chartline-compare>
        <level-title :level="2" icon="icon-biaoti" txt="实时拥堵路段"></level-title>
        <div class="list congestionType">
          <m-row gutter="0.1rem">
            <m-column class="list-item" width="50%" v-for="(item, i) in dataset.list" :key="i">
              <div class="list-item__id">{{ i + 1 }}</div>
              <overview-item
                class="list-item__content"
                v-bind="listConfig"
                :name="item.name"
                :dataset="item"
                >
              </overview-item>
            </m-column>
          </m-row>
        </div>
      </m-tabs-body-item>
      <m-tabs-body-item name="traffic" class="is-flex-column">
        <m-row gutter="0.1rem">
          <m-column width="50%">
            <level-title :level="2" icon="icon-biaoti">
              <m-select class="traffic-select" v-model="currentTraffic" :options="trafficFlow"></m-select>
            </level-title>
            <p class="value" :style="{ color: colors[0] }">{{ dataset.trainStation | initVal | thousandCentimeter }}</p>
          </m-column>
        </m-row>
        <chartline-compare style="height: 2rem;" :chartData="dataset.testData" :colors="colors5" :showYLabel="true" :isGradient="true" :gradientBySelf="true"></chartline-compare>
        <hr class="hr">
        <div class="flow">
          <div class="flow-item">
            <i class="flow-item__icon iconfont icon-daolujiaotong"></i>
            <div class="flow-item__info">
              <p class="flow-item__label">到站客流</p>
              <p class="flow-item__value" style="color: #F23470">{{ 1205098 | thousandCentimeter  }}</p>
            </div>
          </div>
          <div class="flow-item">
            <i class="flow-item__icon iconfont icon-daolujiaotong"></i>
            <div class="flow-item__info">
              <p class="flow-item__label">发送客流</p>
              <p class="flow-item__value" style="color: #4FCFD5">{{ 1205098 | thousandCentimeter  }}</p>
            </div>
          </div>
        </div>
        <chart-line style="height: 2rem;" :chartData="dataset.testData2" :colors="colors3" :showYLabel="true" :isGradient="true" :gradientBySelf="true"></chart-line>
        <hr class="hr">
        <p class="litter-title">客流分布</p>
        <chart-bar-y class="in-flex" :chartData="dataset.testData3" :colors="colors4" labelColor="#fff" unit="%" :isGradient="true"></chart-bar-y>
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
import ChartlineCompare from "@/components/Charts/Line/ChartLineForCompare";
import ChartBarY from "@/components/Charts/BarY/ChartBarYForValuePosition";
import OverviewItem from "@/components/OverviewItem";
import MSelect from "@/components/MSelect";
import MTabsBody from "@/components/MTabsBody/MTabsBody";
import MTabsBodyItem from "@/components/MTabsBody/MTabsBodyItem";
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
    ChartlineCompare,
    ChartBarY,
    OverviewItem,
    MSelect,
    MTabsBody,
    MTabsBodyItem
  },
  inheritAttrs: false,
  data() {
    return {
      colors: Object.freeze([scssVar.number, scssVar.numberSecondary]),
      colors2: Object.freeze(["#4FCFD5", "#DED7D7"]),
      colors3: Object.freeze(["#F23470", "#4FCFD5"]),
      colors4: Object.freeze(["#4FCFD5", "#2E9BCF"]),
      colors5: Object.freeze(["#2E9BCF", "#DED7D7"]),
      items: Object.freeze([
        { label: "快速路拥堵指数", key: "kslydzs", value: "kslydzs" },
        { label: "地面拥堵指数", key: "dmydzs", value: "dmydzs" }
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
          { label: "拥堵长度", prop: "width", unit: "km" }
          // { label: "拥堵时间", prop: "time", unit: "h" }
        ]
      }),
      trafficFlow: Object.freeze([
        { name: "上海火车站区域", icon: "icon-huoche", key: "trainStation", label: "上海火车站区域", value: "trainStation" },
        { name: "轨道交通/公交车", icon: "icon-gonggongjiaotong", key: "bus", label: "轨道交通/公交车", value: "bus" },
        { name: "网约车/出租车", icon: "icon-chuzuwangyue", key: "taxi", label: "网约车/出租车", value: "taxi" },
        { name: "共享单车", icon: "icon-chuzuwangyue", key: "bicycle", label: "共享单车", value: "bicycle" }
      ]),
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
        chartData2: [
          ["客流", "今天", "昨天"],
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
        testData: [
          ["拥堵指数", "今日", "作日"],
          ...(getDate("today").map(d => {
            return [d[0], Math.floor(Math.random() * 100), Math.floor(Math.random() * 100)];
          }))
        ],
        testData2: [
          ["客流", "到站客流", "发送客流"],
          ...(getDate("today").map(d => {
            return [d[0], Math.floor(Math.random() * 100), Math.floor(Math.random() * 100)];
          }))
        ],
        testData3: [
          ["客流分布", "客流分布"],
          ["候车室", 25],
          ["站内公共区域", 20],
          ["出入口", 15],
          ["南北广场", 10],
          ["地下车库", 5]
        ]
      },
      activeLayer: null,
      currentTab: "overview",
      currentCongestionType: "kslydzs",
      currentTraffic: "trainStation"
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
    registerLayers() {
      // 路段图层
      this.items.forEach(item => {
        const layName = `${item.key}Layer`;
        this[layName] = this.$_mapProxy.registerLayer(layName, item.label.slice(0, -2))
        .setParameters({
          "name": layName,
          "type": "layer",
          "mode": "replace",
          "legendVisible": false,
          "popupEnabled": false,
          "isFiltered": true,
          "isLocate": true,
          "labels": [
            {
              "fields": [
                "#.名称"
              ],
              "color": [
                255,
                255,
                255,
                1
              ],
              "size": 24
            }
          ],
          "renderer": {
            "type": "unique-value",
            "field": "value",
            "uniqueValueInfos": [
              {
                "value": "0",
                "symbol": {
                  "type": "line-3d",
                  "symbolLayers": [
                    {
                      "type": "line",
                      "size": 8,
                      "material": {
                        "color": [
                          255,
                          0,
                          0,
                          1
                        ]
                      },
                      "cap": "round",
                      "join": "round"
                    }
                  ]
                }
              }
            ]
          }
        });
      });

      // 热力图图层

      // // 定位图层 不显示图标
      // this.hiddenPointLayer = this.$_mapProxy.registerLayer("hiddenPointLayer", "隐藏定位点")
      // .setParameters({
      //   name: "hiddenPointLayer",
      //   type: "point",
      //   mode: "replace",
      //   isLocate: true,
      //   hasImg: false,
      //   tilt: 0
      // });

      // 撒点
      const taxiLayers = [{ name: "taxi" }];
      taxiLayers.forEach(layer => {
        const layerName = `${layer.name}Layer`;
        this[layerName] = this.$_mapProxy.registerLayer(layerName, "撒点图层")
          .setParameters({
            "name": layerName,
            "type": "point",
            "mode": "replace",
            "legendVisible": false,
            "popupEnabled": false,
            "isFiltered": true,
            "isLocate": true,
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
    },
    handleClickForOpenLayer(item) {
      if (this.activeLayer !== item.key) {
        this.activeLayer = item.key;
        switch (item.key) {
          case "kslydzs":
          case "dmydzs":
            this.currentCongestionType = item.key;
            this.handleClickForChangeTab("congestionType");
            const roads = [{ name: "江场三路", value: 0 }, { name: "新疆路", value: 0 }, { name: "晋城路", value: 0 }, { name: "广中路", value: 0 }, { name: "中华新路", value: 0 }, { name: "北苏州路", value: 0 }, { name: "止园路", value: 0 }];
            this[`${item.key}Layer`].setParameters({
              data: {
                "content": roads.slice(0, Math.floor(Math.random() * roads.length)),
                "layers": {
                  "name": "道路中心线"
                },
                "join": "名称=name"
              }
            }).open();
            break;
          case "trainStation":
          case "bus":
            this.currentCongestionType = item.key;
            this.handleClickForChangeTab("traffic");
            const points = [[-1604.94, 1639.61], [-1604.42, 1639.85], [-1605.46, 1638.77], [-1604.93, 1637.73], [-1604.97, 1636.65], [-1605.53, 1637.85], [-1595.51, 1634.12], [-1603.13, 1624.39], [-1596.01, 1628.89], [-1597.3, 1623.98], [-1393.38, 1739.87], [-1401.12, 1689.7], [-1551.83, 1672.53], [-1566.29, 1871.48], [-1321.5, 1687.28], [-1283.99, 1757.13], [-1479.78, 1730.79]];
            const data = points.map(d => {
              return {
                X: d[0],
                Y: d[1],
                COUNT: 10 + Math.floor(Math.random() * 10) + Math.floor(Math.random() * 10)
              };
            });
            // console.log(this.$_mapProxy, JSON.stringify(data), "------------------------");
            this.$_mapProxy.bridge && this.$_mapProxy.bridge.Invoke({
              ActionName: "goToPosition",
              Parameters: {
                positon: {
                  x: -1529.45,
                  y: 1783.92,
                  z: 10
                },
                tilt: 0,
                hasImg: false,
                zoom: 9
              }
            });
            this.$_mapProxy.bridge && this.$_mapProxy.bridge.Invoke({
              "ActionName": "doShowHeat",
              "Parameters": {
                "datasource": data,
                "visible": true,
                "isLocate": true,
                "weightField": "COUNT",
                "gradient": {
                  ".25": "#4ef1b2",
                  ".50": "#7cd346",
                  ".75": "#f3f12c",
                  ".95": "#fd2f02"
                },
                "radius": 35,
                "geofield": {
                  "xfield": "X",
                  "yfield": "Y"
                }
              }
            });
            break;
          case "taxi":
            this.currentCongestionType = item.key;
            this.handleClickForChangeTab("traffic");
            this[`${item.key}Layer`].setParameters({
              "data": {
                "content": [{ "x": -1733, "y": -917 }],
                "parsegeometry": "function(item){return {x:item.x, y:item.y}}"
              }
            }).open();
            break;
          case "bicycle":
            this.currentCongestionType = item.key;
            this.handleClickForChangeTab("traffic");
            break;
        }
      } else {
        this[`${item.key}Layer`] && this[`${item.key}Layer`].close();
        if (item.key === "trainStation" || item.key === "taxi") {
          this.$_mapProxy.bridge.Invoke({
            ActionName: "FullExtent"
          });
        }
        this.activeLayer = null;
      }
    }
  },
  created() {
    this.registerLayers();
  }
};
</script>
<style lang="scss" scoped>
.canClick {
  cursor: pointer;
  &:hover {
    /deep/ {
      .title {
        color: $hover;
      }
    }
  }
  &.is-active {
    /deep/ {
      .title {
        color: $hover;
      }
    }
  }
}
.is-active {
  color: $hover;
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
}
.line-chart {
  height: 2rem;
}
.list {
  height: 0;
  flex: 1;
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
.congestionType {
  overflow: auto;
}
.trafficFlow {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.traffic-select {
  font-size: inherit;
  color: inherit;
}
.flow {
  display: flex;
}
.flow-item {
  width: 0;
  flex: 1;
  display: flex;
  align-items: center;
  border-right: 0.02rem dashed #4E78A4;
  &:last-of-type {
    border-right-color: transparent;
  }
}
.flow-item__icon {
  width: 1.2rem;
  font-size: 0.56rem;
  color: #1E5CBF;
  text-align: center;
  .supportWebkitTextFillColor &{
    background-image: linear-gradient(225deg, #669DF4 0%, #1E5CBF 100%);;
    // background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
}
.flow-item__label {
  font-size: 0.28rem;
  color: $titleLevel2;
  margin-bottom: 0.1rem;
}
.flow-item__value {
  font-size: 0.52rem;
}
.hr {
  height: 0;
  border: 0.02rem solid #4E78A4;
  margin: 0.1rem 0;
}
.litter-title {
  font-size: 0.28;
  color: $titleLevel2;
  margin-bottom: 0.1rem;
}
</style>
