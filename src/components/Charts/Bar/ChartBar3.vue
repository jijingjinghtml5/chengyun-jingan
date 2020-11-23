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
/** 优化X轴展示 项目超过5相 只展示头尾和中间的项 */
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
          barMaxWidth: "50px",
          itemStyle: {
            color: this.getColor(i)
          },
          z: 1
        };
      });
      const dataLength = this.chartData.length - 1;
      const intervalNum = dataLength > 5 ? parseInt(dataLength / 2) - 1 : 0;
      return {
        ...this.baseOptions,
        grid: {
          top: this.fontSize_ * 2,
          left: this.showXLabel ? +this.fontSize_ * 1.5 : 0,
          right: this.showXLabel ? +this.fontSize_ * 1.5 : 0,
          bottom: 0,
          containLabel: true
        },
        xAxis: {
          type: "category",
          splitLine: { show: false },
          axisLabel: {
            show: this.showXLabel,
            fontSize: +this.fontSize_,
            color: this.labelColor,
            interval: intervalNum,
            showMinLabel: true,
            showMaxLabel: true,
            formatter: this.categoryLabelFmt
          },
          axisTick: { show: false },
          axisLine: this.axisLine
        },
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
