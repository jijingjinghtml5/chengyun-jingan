<template>
<div class="container">
    <wrap-title txt="今日关注" :level="1" icon="icon-wangge">
      <div slot="right" class="title-right">
        <span class="iconfont icon-chaoqianjian-lianghongdeng" style="color:#D0021B"></span>
        <span style="margin-right: 0.4rem">10</span>
        <span class="iconfont icon-jinjidaiban-lianghuangdeng" style="color:#F5A623;"></span>
        <span>2,222</span>
      </div>
      <div class="three-public">
        <div class="wall">
          <m-row gutter="60px">
            <m-column v-for="(item, index) in pubilcItems" :key="`public-${index}`">
              <tile :item="item" class="block"></tile>
            </m-column>
          </m-row>
        </div>
        <div class="chart"></div>
      </div>
      <div class="wall-panel">
        <m-row class="tile-row" gutter="60px" v-for="(chunk , i) in otherItems" :key="`other-chunk-${i}`">
            <m-column v-for="(item, index) in chunk" :key="`other-${index}`">
              <tile :item="item" class="block"></tile>
            </m-column>
          </m-row>
      </div>
    </wrap-title>
</div>
</template>

<script>
import WrapTitle from "@/components/MTitle/WrapTitle";
import MTitle from "@/components/MTitle/LevelTitle";
import MRow from "@/components/Layout/MRow";
import MColumn from "@/components/Layout/MColumn";
import BarChart from "@/components/Charts/Bar/ChartBar";

import Tile from "@/components/Tile";

export default {
  name: "TodayFocus",
  components: { WrapTitle, MTitle, MColumn, MRow, Tile, BarChart },
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
      chunkSize: 3
    };
  }
};
</script>
<style lang="scss" scoped>
.container{
  padding: 0.2rem 0.4rem;
  height: 100%;
  background: linear-gradient(180deg, rgba(84, 88, 169, 0) 0%, rgba(21, 79, 163, 0.4) 100%);

  .title-right{
    font-size: 0.52rem;
    color: #fff;

    span{
      margin-right: 0.1rem;
    }
  }
  .three-public{
    .wall{
      padding: 0.2rem 0;
      .block{
        height: 1.8rem;
      }
    }
    .chart{
      padding: 0.2rem 0;
      height: 3.8rem;
    }
  }
  .wall-panel{
    .tile-row{
      padding: 0.1rem 0;
      .block{
        height: 2rem;
      }
    }
  }
}
</style>
