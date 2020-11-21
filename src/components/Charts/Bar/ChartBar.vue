<template>
  <div class="v-chart-container">
    <v-chart
      v-show="!noData"
      :style="{ width: '100%', height: '100%' }"
      :options="options"
      autoresize
      auto-resize
    />
    <p
      class="no-data-tip"
      :style="{ fontSize: fontSize_ ? fontSize_ + 'px' : '' }"
      v-show="noData"
    >暂无数据</p>
  </div>
</template>
<script>
import ChartBaseMixins from "../mixins/ChartBaseMixins";
import ChartMixins from "../mixins/ChartCustomMixins";
export default {
  name: "ChartBar",
  mixins: [ChartBaseMixins, ChartMixins],
  computed: {
    options () {
      const dataArr = this.chartData && this.chartData.length > 1 ? this.chartData[0].slice(1) : [];

      const series = dataArr.map((d, i) => {
        return {
          type: "bar",
          barMaxWidth: +this.barMaxWidth_,
          itemStyle: {
            color: this.getColor(i)
          },
          z: 1
        };
      });
      return {
        ...this.baseOptions,
        series: series,
        dataZoom: this.dataZoom
      };
    }
  }
};
</script>
<style lang="scss" scoped>
.v-chart-container {
  position: relative;
  width: 100%;
  height: 100%;
  .echarts {
    width: 100%;
    height: 100%;
  }
  .no-data-tip {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 10;
    line-height: 1;
    color: #fff;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
}
</style>
