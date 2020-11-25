<template>
  <wrap-title class="gradient-bg" icon="icon-wangluoyuqing" txt="舆情热点">
    <m-select class="style1" slot="right" v-model="option" :options="options"></m-select>
    <m-row gutter="0.1rem">
      <m-column v-for="(item, index) in items" :key="item.key">
        <level-title :level="2" icon="icon-biaoti">
          {{ item.label }}<sub v-if="item.unit">{{ item.unit }}</sub>
        </level-title>
        <p class="value" :style="{ color: colors[index] }">{{ dataset[item.key] | initVal | thousandCentimeter }}</p>
      </m-column>
    </m-row>
    <chart-line class="line-chart" :colors="colors2" :chartData="dataset.chartData" :showYLabel="true" :isGradient="true" :gradientBySelf="true" :showLegend="true" :legendConfig="legendConfig"></chart-line>
    <level-title :level="2" icon="icon-biaoti" txt="舆情类型Top5"></level-title>
    <chart-bar-y class="barY-chart" :chartData="dataset.chartBarYData" :colors="colors3" :isGradient="true" labelColor="#fff" barMaxWidth="0.2"></chart-bar-y>
    <p style="margin: 0.2rem 0; color: #D1C9C4;">热门舆情话题</p>
    <div class="topic-list in-flex">
      <auto-scroll-wrap
        v-show="dataset.topicList && dataset.topicList.length"
        :isVirtual="true"
        :dataset="dataset.topicList"
        :distance="createFnForCalcRealPx(1.1)"
        :interval="1000">
        <RecycleScroller
          ref="wrap"
          :items="dataset.topicList"
          :itemSize="rowHeight"
          :keyField="'id'"
          v-slot="{ item }">
          <div class="li-item">
            <p class="li-item__topic">#{{ item.topic }}#</p>
            <p class="li-item__info">
              <span class="li-item__time">发布时间：{{ item.time }}</span>
              <span class="li-item__number">
                {{ item.readNum }}阅读
                |
                {{ item.talkNum }}讨论
              </span>
            </p>
          </div>
        </RecycleScroller>
      </auto-scroll-wrap>
      <p v-show="!dataset.topicList || !dataset.topicList.length" class="no-data-tip">暂无数据</p>
    </div>
  </wrap-title>
</template>
<script>
import LevelTitle from "@/components/MTitle/LevelTitle";
import WrapTitle from "@/components/MTitle/WrapTitle";
import MRow from "@/components/Layout/MRow";
import MColumn from "@/components/Layout/MColumn";
import ChartLine from "@/components/Charts/Line/ChartLine";
import ChartBarY from "@/components/Charts/BarY/ChartBarY";
import AutoScrollWrap from "@/components/AutoScrollWrap";
import { RecycleScroller } from "vue-virtual-scroller";
import "vue-virtual-scroller/dist/vue-virtual-scroller.css";
import MSelect from "@/components/MSelect";
import { getDate } from "@/utils/tools";
import scssVar from "@/style/var.js";
export default {
  name: "HotSpots",
  components: {
    LevelTitle,
    WrapTitle,
    MRow,
    MColumn,
    ChartLine,
    ChartBarY,
    AutoScrollWrap,
    RecycleScroller,
    MSelect
  },
  inject: ["createFnForCalcRealPx"],
  data() {
    return {
      colors: Object.freeze([scssVar.number, scssVar.alertHigh]),
      colors2: Object.freeze(["#1ABC9C", "#F96F4F"]),
      colors3: Object.freeze(["#4FCFD5", "#2E9BCF"]),
      items: Object.freeze([
        { label: "舆情信息总量", key: "qyrz", unit: "（条）" },
        { label: "消极信息", key: "zdqy", unit: "（条）" }
      ]),
      legendConfig: Object.freeze({
        top: 0,
        left: "center",
        icon: "line"
      }),
       options: Object.freeze([
        { label: "本周", value: "currentWeek" },
        { label: "本月", value: "currentMonth" }
      ]),
      option: "currentWeek",
      rowHeight: 110,
      dataset: {
        chartData: [
          ["舆情信息", "正面", "消极"],
          ...(getDate("currentMonth").map(d => {
            return [d[0], Math.floor(Math.random() * 100), Math.floor(Math.random() * 100)];
          }))
        ],
        chartBarYData: [
          ["舆情类型Top5", "舆情类型Top5"],
          ["娱乐", 2098],
          ["时事", 1752],
          ["金融", 1265],
          ["商业", 1087],
          ["综艺", 887]
        ],
        topicList: Object.freeze([
          { id: 1, topic: "RCEP会带来什么影响", time: "今日8：00", readNum: "2.1亿", talkNum: "8,094" },
          { id: 2, topic: "腾讯全民K歌涉黄被罚全面整改", time: "今日8：00", readNum: "2.1亿", talkNum: "8,094" },
          { id: 3, topic: "抗糖真能抗衰老吗", time: "今日8：00", readNum: "2.1亿", talkNum: "8,094" },
          { id: 4, topic: "RCEP会带来什么影响", time: "今日8：00", readNum: "2.1亿", talkNum: "8,094" },
          { id: 5, topic: "RCEP会带来什么影响", time: "今日8：00", readNum: "2.1亿", talkNum: "8,094" }
        ])
      }
    };
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
}
.line-chart,
.barY-chart {
  height: 2rem;
}
.li-item {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 1rem;
  font-size: 0.28rem;
  line-height: 0.36rem;
  color: #fff;
  border-top: 0.02rem solid #4E78A4;
  border-bottom: 0.02rem solid #4E78A4;
}
.li-item__info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.24rem;
  color: #92B9F7;
}
</style>
