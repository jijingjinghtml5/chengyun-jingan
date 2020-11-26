<template>
  <div class="overview">
    <div class="three-public">
        <div class="wall">
          <m-row gutter="20px">
            <m-column v-for="(item, index) in pubilcItems" :key="`public-${index}`">
              <tile :item="item" class="block clickAble"  @click="handleClick(item)"></tile>
            </m-column>
          </m-row>
        </div>
        <div class="chart">
          <line-chart :chartData="chartData" :colors="colors" :showYLabel="true" :pageLen="24" :isGradient="true" :gradientBySelf="true">
          </line-chart>
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
import MRow from "@/components/Layout/MRow";
import MColumn from "@/components/Layout/MColumn";
import LineChart from "@/components/Charts/Line/ChartLine";
import Tile from "@/components/Tile/index2";
import Tile1 from "@/components/Tile/index1";

import Vue from "vue";
import { Row, Col } from "element-ui";
Vue.use(Row);
Vue.use(Col);

export default {
  name: "TodayFocusOverview",
  components: { MRow, MColumn, LineChart, Tile, Tile1 },
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
      colors: ["#F23470", "#2E9BCF", "#1ABC9C"],
      chartData: [
        ["时间", "公共安全", "公共管理", "公共服务"],
        ...(new Array(24)).fill(0).map((v, index) => {
          return [
            index.toString().padStart(2) + ":00",
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
      height: 3.6rem;
    }
  }
  .wall-panel{
    .tile-row{
      padding: 0.3rem 0;
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
