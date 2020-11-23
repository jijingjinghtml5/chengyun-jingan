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
// 右侧显示值
import { thousandCentimeter } from "../../../utils/tools";
import ChartBaseMixins from "../mixins/ChartBaseMixins";
import ChartMixins from "../mixins/ChartCustomMixins";
export default {
  name: "ChartBar",
  mixins: [ChartBaseMixins, ChartMixins],
  props: {
    gradientDir: {
      type: String,
      default: "x"
    },
    isStack: {
      type: Boolean,
      default: false
    },
    showValue: {
      type: Boolean,
      default: true
    },
    backgroundColor: {
      type: String,
      default: null
    }
  },
  computed: {
    options () {
      const dataArr = this.chartData && this.chartData.length > 1 ? this.chartData[0].slice(1) : [];

      const series = dataArr.map((d, i) => {
        return {
          type: "bar",
          barMaxWidth: +this.barMaxWidth_,
          stack: this.isStack ? "stack" : null,
          showBackground: !!this.backgroundColor,
          backgroundStyle: {
            color: this.backgroundColor
          },
          label: {
            show: this.showValue,
            position: "right",
            fontSize: +this.fontSize_,
            color: "#fff",
            formatter: params => {
              return thousandCentimeter(params.data[1]);
            }
          },
          itemStyle: {
            color: this.getColor(i)
          },
          z: 1
        };
      });
      return {
        ...this.baseOptions,
        grid: {
          top: this.showLegend ? +this.fontSize_ * 1.5 : +this.fontSize_ * 0.5,
          left: 0,
          right: +this.fontSize_ * 4,
          bottom: 0,
          containLabel: true
        },
        xAxis: {
          ...this.yAxis,
          max: "dataMax"
        },
        yAxis: {
          ...this.xAxis,
          inverse: true,
          axisLine: {
            show: false
          }
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
