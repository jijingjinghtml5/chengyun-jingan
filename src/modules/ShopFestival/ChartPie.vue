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
      :style="{ fontSize: '25px' }"
      v-show="noData"
    >暂无数据</p>
  </div>
</template>
<script>
export default {
  name: "ChartLine",
  props: {
    chartData: {
      type: Array,
      default: () => {
        return []
      }
    },
    colors: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  computed: {
    noData () {
      return !(this.chartData && this.chartData.length > 1);
    },
    options () {
      return {
        color: this.colors,
        tooltip: {
          trigger: 'axis',
          textStyle: {
            fontSize: 25,
            lineHeight: 50
          },
        },
        // legend: {
        //   right: '10%',
        //   top: 'middle',
        //   icon: 'circle',
        //   orient: 'vertical',
        //   itemGap: 30,
        //   textStyle: {
        //     color: "#fff",
        //     fontSize: 40
        //   }
        // },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        series: [
          {
            type: 'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            label: {
              show: true,
              formatter: '{b}\n{d}%',
              fontSize: 40,
              fontWeight: 'bold'
            },
          }
        ],
        dataset: {
          source: this.chartData
        }
      }
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
