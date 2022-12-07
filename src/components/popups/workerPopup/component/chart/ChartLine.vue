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
export default {
  name: 'ChartLine',
  inject: {
    createFnForCalcRealPx: {
      from: 'createFnForCalcRealPx',
      default: val => val
    }
  },
  props: {
    color: {
      type: String,
      default: '#ffff00'
    },
    chartData: {
      type: Array,
      default: () => {
        return []
      }
    },
    fontSize: {
      type: [String, Number],
      default () {
        return 0.24
      }
    }

  },
  computed: {
    noData () {
      return !(this.chartData && this.chartData.length > 1)
    },

    fontSize_ () {
      return this.createFnForCalcRealPx(this.fontSize)
    },
    options () {
      const xData = []
      const yData = []
      let xLabel = ''
      let yLabel = ''
      this.chartData.forEach((e, i) => {
        if (i === 0) {
          xLabel = e[0]
          yLabel = e[1]
        } else {
          xData.push(e[0])
          yData.push(e[1])
        }
      })
      return {
        grid: {
          top: 40,
          left: 20,
          right: 30,
          bottom: 0,
          containLabel: true
        },
        tooltip: {
          show: true,
          trigger: 'axis',
          textStyle: {
            color: '#ffffff',
            fontSize: 24
          }

        },
        xAxis: [{
          type: 'category',
          name: xLabel,
          axisLine: {
            show: true
          },
          splitArea: {
            // show: true,
            color: '#f00',
            lineStyle: {
              color: '#f00'
            }
          },
          axisLabel: {
            color: '#C0C6C9',
            fontSize: 20,
            interval: 1000,
            showMinLabel: true,
            showMaxLabel: true
          },
          splitLine: {
            show: false
          },
          boundaryGap: false,
          data: xData
        }],
        yAxis: [{
          type: 'value',
          name: yLabel,
          // min: function (value) {
          //   return Math.floor(value.min * 10) / 10
          // },
          // max: 140,
          splitNumber: 3,
          splitLine: {
            show: true,
            lineStyle: {
              color: 'rgba(255,255,255,0.1)'
            }
          },
          axisLine: {
            show: false
          },
          axisLabel: {
            show: true,
            margin: 20,
            showMinLabel: false,
            textStyle: {
              color: '#C0C6C9',
              fontSize: 20
            }
          },
          axisTick: {
            show: false
          }
        }],
        series: [{
          name: yLabel,
          type: 'line',
          smooth: true,
          showAllSymbol: false,
          symbol: 'circle',
          symbolSize: 1,
          lineStyle: {
            normal: {
              color: this.color,
              shadowColor: 'rgba(0, 0, 0, .3)',
              width: 4
            }
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: this.color + '99'
                },
                {
                  offset: 1,
                  color: this.color + '09'
                }
              ]
            }

          },
          itemStyle: {
            color: this.color,
            borderColor: '#fff',
            borderWidth: 0,
            shadowColor: 'rgba(0, 0, 0, .3)',
            shadowBlur: 0,
            shadowOffsetY: 2,
            shadowOffsetX: 2
          },
          tooltip: {
            show: true
          },
          data: yData
        }
        ]
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
