<template>
<wrap-title :txt="item.label" :level="2" icon="icon-biaoti" class="dashboard">
  <div slot="right" class="title-right">
    <span @click="handleClick">[案件列表]</span>
  </div>
  <div class="count" :style="`color:${item.color}`">{{item.count | thousandCentimeter}}</div>
  <div class="line-content">
    <chart-line :chartData="chartData" :colors="colors" :showYLabel="true" :isGradient="true" :gradientBySelf="true"></chart-line>
  </div>
  <div class="step-content">
    <case-step></case-step>
  </div>
  <div class="bar-content">
    <chart-bar :chartData="chartData2" :colors='["#F23470", "#92B9F7"]' :showYLabel="true" :isGradient="true" :gradientBySelf="true" :pageLen="24"></chart-bar>
  </div>
</wrap-title>
</template>
<script>
import WrapTitle from "@/components/MTitle/WrapTitle";
import MTitle from "@/components/MTitle/LevelTitle";
import ChartLine from "@/components/Charts/Line/ChartLineForCompare.vue";
import CaseStep from "@/components/CaseStep/index.vue";
import { getDate } from "@/utils/tools";
import ChartBar from "../../components/Charts/Bar/ChartBar4.vue";
export default {
  name: "TodayCaseDashboard",
  components: { WrapTitle, MTitle, ChartLine, CaseStep, ChartBar },
  props: {
    item: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      colors: Object.freeze(["#F23470", "#92B9F7"]),
      chartData: [["日期", "今日", "昨日"], ...(getDate("today").map(d => {
            return [d[0], Math.floor(Math.random() * 100), Math.floor(Math.random() * 100)];
          }))],
      chartData2: [
        ["街道", "今日", "昨日"],
        ["南西", Math.floor(Math.random() * 100), Math.floor(Math.random() * 100)],
        ["静安寺", Math.floor(Math.random() * 100), Math.floor(Math.random() * 100)],
        ["临汾", Math.floor(Math.random() * 100), Math.floor(Math.random() * 100)],
        ["大宁", Math.floor(Math.random() * 100), Math.floor(Math.random() * 100)],
        ["共和新", Math.floor(Math.random() * 100), Math.floor(Math.random() * 100)],
        ["曹家渡", Math.floor(Math.random() * 100), Math.floor(Math.random() * 100)],
        ["天目西", Math.floor(Math.random() * 100), Math.floor(Math.random() * 100)],
        ["宝山", Math.floor(Math.random() * 100), Math.floor(Math.random() * 100)],
        ["江宁", Math.floor(Math.random() * 100), Math.floor(Math.random() * 100)],
        ["北站", Math.floor(Math.random() * 100), Math.floor(Math.random() * 100)],
        ["石门二", Math.floor(Math.random() * 100), Math.floor(Math.random() * 100)],
        ["芷江西", Math.floor(Math.random() * 100), Math.floor(Math.random() * 100)],
        ["彭浦镇", Math.floor(Math.random() * 100), Math.floor(Math.random() * 100)],
        ["彭浦新", Math.floor(Math.random() * 100), Math.floor(Math.random() * 100)]
      ]
    };
  },
  methods: {
    handleClick() {
      this.$emit("click", "list", this.item);
    }
  }
};
</script>
<style lang="scss" scoped>
.dashboard{
  padding: 0;

  .title-right{
    cursor:pointer;
  }
  .count{
    padding: 10px 20px;
    font-weight: bold;
    font-size:72px;
  }
  .line-content{
    padding: 10px 0;
    height: 300px;
  }
  .step-content{
    padding: 20px 0;
  }
  .bar-content{
    height: 300px;
  }
}
</style>
