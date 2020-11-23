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
  props: {
    showYLabel: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    options () {
      return {
        ...this.baseOptions,
        series: [
          {
            type: "bar",
            barMaxWidth: this.createFnForCalcRealPx(0.2),
            itemStyle: {
              color: this.getColor(0)
            }
          },
          {
            type: "bar",
            barGap: 0,
            barMaxWidth: this.createFnForCalcRealPx(0.04),
            itemStyle: {
              color: this.getColor(1)
            }
          }
        ],
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
