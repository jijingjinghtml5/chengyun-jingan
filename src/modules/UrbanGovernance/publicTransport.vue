<template>
  <div id="PublicTransport">
    <div class="total-wrap">
      <p>
        公交线路：<span>{{ line }}</span>
      </p>
      <p>
        公交站点：<span>{{ point }}</span>
      </p>
    </div>
    <ChartLinePublic :chartData="chartData"></ChartLinePublic>
  </div>
</template>

<script>
import { getPublicLine, getPublicPoint, getPublicTransportChart } from "./api.js";
import ChartLinePublic from "./components/ChartLinePublic.vue";
export default {
  name: "PublicTransport",
  components: {
    ChartLinePublic
  },
  data() {
    return {
      line: 0,
      point: 0,
      chartData: []
    };
  },
  created() {
    getPublicLine().then(res => {
      this.line = res.data.numHits || 0;
    });
    getPublicPoint().then(res => {
      this.point = res.data.data.length || 0;
    });
    getPublicTransportChart().then(res => {
      this.chartData = [
        ["时间", "进站客流", "出站客流"],
        ...res.data[0].dataList.map(item => {
          return [item.sTime, item.value_in, item.value_out];
        })
      ];
    });
  }
};
</script>

<style lang="scss">
#PublicTransport {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .total-wrap {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.15rem 10%;
    & > p {
      font-size: 0.36rem;
      span {
        color: #4FCFD5;
        font-weight: bold;
      }
    }
  }
}
</style>
