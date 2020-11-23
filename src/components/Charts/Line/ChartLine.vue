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
  name: "ChartLine",
  mixins: [ChartBaseMixins, ChartMixins],
  props: {
    legendConfig: {
      type: Object,
      default: () => {
        return {
          top: 0,
          right: 0,
          icon: "line"
        };
      }
    }
  },
  computed: {
    options () {
      const dataArr = this.chartData && this.chartData.length > 1 ? this.chartData[0].slice(1) : [];
      const series = dataArr.map((d, i) => {
        return {
          name: d,
          type: "line",
          symbol: "none",
          smooth: this.isSmooth,
          lineStyle: {
            width: 2
          },
          areaStyle: this.isArea ? {
            color: this.getColor(i)
          } : null
        };
      });
      const axisLabelOption = this.chartData && this.chartData.length > 3 ? {
        interval: Math.floor((this.chartData.length - 3) / 2),
        showMinLabel: true,
        showMaxLabel: true
      } : {};
      return {
        ...this.baseOptions,
        grid: {
          top: this.showLegend ? +this.fontSize_ * 2 : +this.fontSize_,
          left: this.showXLabel ? +this.fontSize_ * (this.showYLabel ? 0.5 : 1.5) : 0,
          right: this.showXLabel ? +this.fontSize_ * 1.5 : 0,
          bottom: 0,
          containLabel: true
        },
        tooltip: {
          trigger: "axis",
          textStyle: {
            fontSize: +this.fontSize_,
            lineHeight: +this.fontSize_ * 1.15
          },
          appendToBody: true
        },
        xAxis: {
          type: "category",
          splitLine: { show: false },
          axisLabel: {
            show: this.showXLabel,
            fontSize: this.fontSize_,
            color: this.labelColor,
            ...axisLabelOption
          },
          axisTick: { show: false },
          axisLine: this.axisLine,
          boundaryGap: false
        },
        series: series
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
