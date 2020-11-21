<template>
  <div class="v-chart-container">
    <v-chart
      v-show="!noData"
      :style="{ width: '100%', height: '100%' }"
      :options="options"
      autoresize
    />
    <p
      class="no-data-tip"
      :style="{ fontSize: fontSize_ ? fontSize_ + 'px' : '' }"
      v-show="noData"
    >暂无数据</p>
  </div>
</template>
<script>
import ChartBaseMixins from '../mixins/ChartBaseMixins'
export default {
  name: 'ChartHeatmap',
  mixins: [ChartBaseMixins],
  props: {
    pieces: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    dataset () {
      const res = { xData: [], yData: [], data: [] }
      if (!this.noData) {
        res.xData = this.chartData.slice(1).map(d => d[0])
        res.yData = this.chartData[0].slice(1)
        res.data = this.chartData.slice(1).reduce((r, xd, xi) => {
          res.yData.forEach((yd, yi) => {
            r.push([xi, yi, xd[yi + 1]])
          })
          return r
        }, [])
      }
      return res
    },
    options () {
      return {
        textStyle: this.textStyle,
        grid: {
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          containLabel: true
        },
        tooltip: {
          textStyle: {
            fontSize: +this.fontSize_,
            lineHeight: +this.fontSize_ * 1.15
          }
        },
        xAxis: {
          type: 'category',
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitArea: {
            show: true,
            areaStyle: {
              color: 'transparent'
            }
          },
          axisLabel: {
            fontSize: this.fontSize_,
            color: this.labelColor,
            interval: 0
          },
          data: this.dataset.xData
        },
        yAxis: {
          type: 'category',
          inverse: true,
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitArea: {
            show: true,
            areaStyle: {
              color: 'transparent'
            }
          },
          axisLabel: {
            fontSize: this.fontSize_,
            color: this.labelColor,
            interval: 0
          },
          data: this.dataset.yData
        },
        visualMap: {
          show: false,
          type: 'piecewise',
          pieces: this.pieces
        },
        series: [{
          type: 'heatmap',
          label: {
            show: true,
            fontSize: this.fontSize_ * 0.75
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },
          data: this.dataset.data
        }]
      }
    }
  }
}
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
