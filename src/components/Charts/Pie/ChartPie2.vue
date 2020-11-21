<template>
  <div class="v-chart-container">
    <div class="content" :class="legendPosition">
      <div class="chart">
        <v-chart
          ref="chart"
          v-show="!noData"
          :style="{ width: '100%', height: '100%' }"
          :options="options"
          autoresize
          auto-resize
        />
      </div>
      <ul class="legend" v-if="showLegend" :style="{ fontSize: fontSize_ ? fontSize_ + 'px' : '', color: labelColor }">
        <li v-for="(item, index) in source" :key="item[0]" class="text-ellipsis">
          <span class="legend-block" :style="{ backgroundColor: colors[index] || '' }"></span>
          <span v-html="legendFormatter(item)"></span>
        </li>
      </ul>
    </div>
    <p
      class="no-data-tip"
      :style="{ fontSize: fontSize_ ? fontSize_ + 'px' : '' }"
      v-show="noData"
    >暂无数据</p>
  </div>
</template>
<script>
// 含底色，饼图中间显示总数
import ChartBaseMixins from '../mixins/ChartBaseMixins'
import ChartPieMixins from '../mixins/ChartPieAutoMixins'
import { thousandCentimeter } from '../../../utils/tools'
const scssVariables = require('../../../assets/style/var.js')
export default {
  name: 'CharPie',
  mixins: [ChartBaseMixins, ChartPieMixins],
  props: {
    showLegend: {
      type: Boolean,
      default: true
    },
    legendPosition: {
      type: String,
      default: 'right'
    },
    legendFormatter: {
      type: Function,
      default: (item) => {
        return item[0]
      }
    },
    fontSize: {
      type: [String, Number],
      default () {
        return 0.28
      }
    },
    isGragdient: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    chartData: {
      handler () {
        this.reset()
        this.startLoop()
      }
    }
  },
  computed: {
    total () {
      let res = '-'
      if (!this.noData) {
        res = this.chartData.slice(1).reduce((r, item) => {
          r += item[1]
          return r
        }, 0)
      }
      return res
    },
    title () {
      let res = '-'
      if (!this.noData) {
        res = this.chartData[0][0]
      }
      return res
    },
    source () {
      return this.chartData && this.chartData.length > 1 ? this.chartData.slice(1) : []
    },
    options () {
      return {
        textStyle: this.textStyle,
        tooltip: {
          showContent: true,
          triggerOn: 'none',
          // alwaysShowContent: true,
          position: ['50%', '50%'],
          backgroundColor: 'transparent',
          textStyle: {
            color: '#fff',
            fontSize: +this.fontSize_
          },
          extraCssText: 'transform: translate(-50%, -50%); text-align: center; line-height: 1.2;z-index: 1',
          formatter: params => {
            if (params.seriesName === 'default') {
              params = {
                color: scssVariables.textColor3,
                data: [null, this.total],
                name: this.title
              }
            }
            return `
              <p style="font-weight: bold; font-size: ${+this.fontSize_ * 1.5}px">${thousandCentimeter(params.data[1])}</p>
              <p style="color: ${params.color};">${params.name}</p>
            `
          }
        },
        title: {
          show: this.centerText,
          text: thousandCentimeter(this.total),
          subtext: this.title,
          top: '35%',
          left: 'center',
          textStyle: {
            color: '#fff',
            fontWeight: 500,
            fontSize: +this.fontSize_ * 1.5
          },
          subtextStyle: {
            color: scssVariables.textColor3,
            fontSize: this.fontSize_
          }
        },
        series: [
          {
            type: 'pie',
            clockwise: false,
            // silent: true,
            hoverOffset: 10,
            center: ['50%', '50%'],
            radius: ['65%', '85%'],
            label: { show: false },
            labelLine: { show: false },
            itemStyle: {
              borderWidth: 5,
              borderColor: '#032242'
            },
            z: 3
          },
          {
            name: 'default',
            type: 'pie',
            silent: true,
            clockwise: false,
            center: ['50%', '50%'],
            radius: ['0%', '100%'],
            label: { show: false },
            labelLine: { show: false },
            itemStyle: {
              color: '#032242'
            },
            data: [100],
            z: 1
          }
        ],
        dataset: this.chartData && this.chartData.length ? {
          source: this.chartData
        } : [],
        color: this.colors
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.startLoop()
    })
  }
}
</script>
<style lang="scss" scoped>
.v-chart-container {
  position: relative;
  width: 100%;
  height: 100%;
  .content {
    display: flex;
    width: 100%;
    height: 100%;
    align-items: center;
  }
  .right {
    .chart {
      width: 0;
      flex: 3;
      height: 100%;
    }
    .legend {
      width: 0;
      flex: 2;
    }
  }
  .bottom {
    flex-direction: column;
    .chart {
      width: 100%;
      height: 0;
      flex: 1;
    }
    .legend {
      display: flex;
      li {
        margin-bottom: 0 !important;
        margin-right: 0.2rem;
        &:last-child {
          margin-right: 0;
        }
      }
    }
  }
  .legend {
    margin: 0;
    list-style: none;
    overflow: auto;
    max-height: 100%;
    li {
      position: relative;
      display: flex;
      align-items: center;
      line-height: 1;
      margin-bottom: 0.2rem;
      &:last-of-type {
        margin-bottom: 0;
      }
    }
    .legend-block {
      display: inline-block;
      width: 0.16rem;
      height: 0.16rem;
      margin-right: 0.2rem;
    }
  }
  .echarts {
    width: 100%;
    height: 100%;
  }
  .no-data-tip {
    position: absolute;
    margin: 0;
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
