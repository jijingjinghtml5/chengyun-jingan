<template>
  <wrap-title class="gradient-bg" icon="icon-daolujiaotong" txt="区域交通">
    <m-select class="style1" slot="right" v-model="option" :options="options"></m-select>
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
        <div class="list road">
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
      trafficFlow: Object.freeze([
        { name: "上海火车站区域", icon: "icon-huoche", key: "trainStation" },
        { name: "轨道交通/公交车", icon: "icon-gonggongjiaotong", key: "bus" },
        { name: "网约车/出租车", icon: "icon-chuzuwangyue", key: "taxi" }
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
        list: Object.freeze([
          { name: "南京西路 - 武宁路", value: 9.5, width: 10, time: 1.2 },
          { name: "灵石路 - 共和新路", value: 9.5, width: 10, time: 1.2 },
          { name: "大宁路 - 共和新路", value: 9.5, width: 10, time: 1.2 },
          { name: "南京西路111 - 武宁路", value: 9.5, width: 10, time: 1.2 }
        ])
      },
      activeLayer: null
    };
  },
  methods: {
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
            // const points = [[-1604.94,1639.61], [-1604.42,1639.85], [-1605.46,1638.77], [-1604.93,1637.73], [-1604.97,1636.65], [-1605.53,1637.85], [-1595.51,1634.12], [-1603.13,1624.39], [-1596.01,1628.89], [1597.3,1623.98]];
            // const data = points.map(d => {
            //   return {
            //     x: d[0],
            //     y: d[1],
            //     count: 10 + Math.floor(Math.random() * 10) + Math.floor(Math.random() * 10)
            //   }
            // })
            // console.log(this.$_mapProxy, "------------------------");
            // this.$_mapProxy.bridge({
            //   "ActionName": "doShowHeat",
            //   "Parameters": {
            //     "visible": true,
            //     "weightFied": "COUNT",
            //     "gradient": {
            //       ".25": "#4ef1b2",
            //       ".50": "#7cd346",
            //       ".75": "#f3f12c",
            //       ".95": "#fd2f02"
            //     },
            //     "radius": 35,
            //     "geofield": {
            //       "xfield": "X",
            //       "yfield": "Y"
            //     }
            //   }
            // })
            break;
          case "taxi":
            this[`${item.key}Layer`].setParameters({
              "data": {
                "content": [{ "x": -1733, "y": -917 }],
                "parsegeometry": "function(item){return {x:item.x, y:item.y}}"
              }
            }).open();
            break;
        }
      } else {
        this[`${item.key}Layer`].close();
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
.road {
  overflow: auto;
}
.trafficFlow {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
</style>
