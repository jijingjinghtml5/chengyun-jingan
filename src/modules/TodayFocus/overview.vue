<template>
  <div class="overview">
    <div class="three-public">
        <div class="wall">
          <m-row gutter="60px">
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
        <m-row class="tile-row" gutter="60px" v-for="(chunk , i) in otherItems" :key="`other-chunk-${i}`">
            <m-column v-for="(item, index) in chunk" :key="`other-${index}`">
              <tile :item="item" class="block clickAble" @click="handleClick(item)"></tile>
            </m-column>
          </m-row>
      </div>
  </div>
</template>
<script>
import MRow from "@/components/Layout/MRow";
import MColumn from "@/components/Layout/MColumn";
import LineChart from "@/components/Charts/Line/ChartLine";
import Tile from "@/components/Tile";

export default {
  name: "TodayFocusOverview",
  components: { MRow, MColumn, LineChart, Tile },
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
          icon: "icon-biaoti",
          label: "公共安全案件数",
          count: 30,
          rate: 1.08,
          color: "#F23470"
          // unit: "件"
        },
        {
          icon: "icon-biaoti",
          label: "公共管理案件数",
          count: 0,
          rate: 1.08,
          color: "#2E9BCF"
          // unit: "件"
        },
        {
          icon: "icon-biaoti",
          label: "公共安全案件数",
          count: 78,
          rate: 1.08,
          color: "#1ABC9C"
          // unit: "件"
        }
      ],
      items: [
        {
          icon: "icon-biaoti",
          label: "今日警情",
          count: 30,
          rate: 1.08,
          unit: "件"
        },
        {
          icon: "icon-biaoti",
          label: "今日事故",
          count: 0,
          rate: 1.08,
          unit: "件"
        },
        {
          icon: "icon-biaoti",
          label: "今日群体事件",
          count: 78,
          rate: 1.08,
          unit: "件"
        },
        {
          icon: "icon-biaoti",
          label: "今日火情",
          count: 0,
          rate: -1.08,
          unit: "件"
        },
        {
          icon: "icon-biaoti",
          label: "今日抢险救援",
          count: 1048,
          rate: 1.08,
          unit: "条"
        },
        {
          icon: "icon-biaoti",
          label: "今日信访",
          count: 60,
          rate: 1.08,
          unit: "条"
        }
      ],
      chunkSize: 3,
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
      if (["公共安全案件数", "公共管理案件数", "公共服务案件数"].indexOf(item.type) === -1) {
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
      padding: 0.1rem 0;
      .block{
        height: 2.1rem;
      }
    }
  }
}
</style>
