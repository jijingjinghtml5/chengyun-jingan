<template>
  <div class="overview">
    <div class="three-public">
        <div class="wall">
          <m-row gutter="10px">
            <m-column v-for="(item, index) in pubilcItems" :key="`public-${index}`">
              <tile :item="item" class="block clickAble"  @click="handleClick(item)"></tile>
            </m-column>
          </m-row>
        </div>
        <div class="chart">
          <wrap-title :level="2" txt="案件趋势" icon="icon-biaoti">
            <line-chart :showLegend="true" :legendConfig="legendConfig" :chartData="chartData" :colors="colors" :showYLabel="true" :pageLen="24" :isGradient="true" :gradientBySelf="true">
            </line-chart>
          </wrap-title>
        </div>
      </div>
      <div class="wall-panel">
        <m-row class="tile-row" gutter="20px" v-for="(chunk , i) in otherItems" :key="`other-chunk-${i}`">
            <MColumn :span="5" v-for="(item, index) in chunk" :key="`other-${index}`">
              <tile1 :item="item" class="block clickAble" @click="handleClick(item)"></tile1>
            </MColumn>
          </m-row>
      </div>
  </div>
</template>
<script>
import WrapTitle from "@/components/MTitle/WrapTitle";
import MRow from "@/components/Layout/MRow";
import MColumn from "@/components/Layout/MColumn";
import LineChart from "@/components/Charts/Line/ChartLine";
import Tile from "@/components/Tile/index2";
import Tile1 from "@/components/Tile/index1";

import { getDate } from "@/utils/tools";

import Vue from "vue";
import { Row, Col } from "element-ui";
Vue.use(Row);
Vue.use(Col);

export default {
  name: "TodayFocusOverview",
  components: { WrapTitle, MRow, MColumn, LineChart, Tile, Tile1 },
  computed: {
    otherItems() {
      let items = [...this.items];
      const length = items.length;
      if (length < this.chunkSize) {
        return items;
      }
      let chunks = [];
      for (let i = 0; i < length; i += this.chunkSize) {
        chunks.push(items.splice(0, this.chunkSize));
      }
      return chunks;
    }
  },
  data() {
    return {
      legendConfig: {
        icon: "rect",
        itemWidth: 20,
        itemHeight: 6,
        top: 0,
        right: 250
      },
      pubilcItems: [
        {
          label: "一网统管",
          count: 109772,
          rate: 1.08,
          color: "#4FCFD5"
        },
        {
          icon: "icon-biaoti",
          label: "一网通办",
          count: 12198,
          rate: 1.08,
          color: "#2E9BCF"
        }
      ],
      items: [
        {
          // icon: "icon-biaoti",
          label: "12345热线",
          count: 30,
          rate: 1.08,
          unit: "件"
        },
        {
          // icon: "icon-biaoti",
          label: "110",
          count: 0,
          rate: 1.08,
          unit: "件"
        },
        {
          // icon: "icon-biaoti",
          label: "119",
          count: 78,
          rate: 1.08,
          unit: "件"
        },
        {
          // icon: "icon-biaoti",
          label: "120",
          count: 0,
          rate: -1.08,
          unit: "件"
        },
        {
          // icon: "icon-biaoti",
          label: "962121",
          count: 0,
          rate: -1.08,
          unit: "件"
        },
        {
          // icon: "icon-biaoti",
          label: "网格巡查",
          count: 104800,
          rate: 1.08,
          unit: "件"
        },
        {
          // icon: "icon-biaoti",
          label: "市场监管",
          count: 60,
          rate: 1.08,
          unit: "件"
        },
        {
          // icon: "icon-biaoti",
          label: "110非警情",
          count: 60,
          rate: 1.08,
          unit: "件"
        },
        {
          // icon: "icon-biaoti",
          label: "综治",
          count: 60,
          rate: 1.08,
          unit: "件"
        },
        {
          // icon: "icon-biaoti",
          label: "矛盾纠纷",
          count: 60,
          rate: 1.08,
          unit: "件"
        }
      ],
      chunkSize: 5,
      colors: ["#1ABC9C", "#679DF4", "#F96F4F", "#BE6CCC", "#D0021B"],
      chartData: [
        ["时间", "网格", "12345热线", "综治", "市场监管", "110非警情"],
        ...getDate("currentMonth").map((v, index) => {
          return [
            v[0],
            Math.floor(Math.random() * 100),
            Math.floor(Math.random() * 100),
            Math.floor(Math.random() * 100),
            Math.floor(Math.random() * 100),
            Math.floor(Math.random() * 100)
          ];
        })
      ]
    };
  },
  methods: {
    handleClick(item) {
      console.log("item,", item);
      let component = "dashboard";
      if (["公共安全案件数", "公共管理案件数", "公共服务案件数"].indexOf(item.label) === -1) {
        component = "list";
      }
      this.$emit("click", component, item);
    }
  }
};
</script>

<style lang="scss" scoped>
.overview{
  width: 100%;
  height: 100%;

  .three-public{
    .wall{
      .block{
        height: 2.1rem;
      }
    }
    .chart{
      padding: 0.1rem 0;
      height: 4rem;
    }
  }
  .wall-panel{
    .tile-row{
      padding: 0.25rem 0;
    }
    .el-col, .m-column {
      border-right: 1px dashed #4E78A4;
      &:last-child{
        border: 0;
      }
    }
  }
}
</style>
