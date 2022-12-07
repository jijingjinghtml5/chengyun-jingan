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
      :style="{ fontSize: fontSize ? fontSize + 'px' : '' }"
      v-show="noData"
    >暂无数据</p>
  </div>
</template>
<script>
export default {
  name: "ChartLine",
  props: {
    fontSize: {
      type: Number,
      default: 36
    },
    chartData: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    noData() {
      return !this.chartData.length;
    },
    options () {
      return {
          tooltip: {
            trigger: "axis",
            textStyle: {
              fontSize: 25,
              lineHeight: 50
            }
          },
          legend: {
            itemHeight: 10,
            itemWidth: 30,
            icon: "rect",
            textStyle: {
              color: "#fff",
              fontSize: 25
            }
          },
          grid: {
            left: "3%",
            right: "4%",
            bottom: "3%",
            containLabel: true
          },
          toolbox: {
            feature: {
              saveAsImage: {}
            }
          },
          xAxis: {
            type: "category",
            boundaryGap: false,
            splitLine: { show: false },
            axisTick: { show: false },
            axisLabel: {
              fontSize: 25,
              color: "#92B9F7"
            },
            axisLine: {
              lineStyle: {
                width: 1,
                color: "#92B9F7"
              }
            }
          },
          yAxis: {
            splitNumber: 3,
            type: "value",
            splitLine: { show: false },
            axisTick: { show: false },
            axisLine: { show: false },
            axisLabel: {
              fontSize: 25,
              color: "#92B9F7",
              interval: 0,
              showMinLabel: false
            }
          },
          series: [
            {
              name: "出站客流",
              type: "line",
              smooth: true,
              symbol: "none"
            },
            {
              name: "进站客流",
              type: "line",
              symbol: "none",
              smooth: true
            }
          ],
          dataset: this.chartData && this.chartData.length ? {
            source: this.chartData
          } : []
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
