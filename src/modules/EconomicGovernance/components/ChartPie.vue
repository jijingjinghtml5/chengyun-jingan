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
          <slot name="li" :item="item">
            <span v-html="legendFormatter(item)"></span>
          </slot>
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
import ChartBaseMixins from "@/components/Charts/mixins/ChartBaseMixins";
import ChartPieMixins from "@/components/Charts/mixins/ChartPieAutoMixins";
import { thousandCentimeter } from "@/utils/tools";
// const scssVariables = require("@/style/var.js");
export default {
  name: "CharPie",
  mixins: [ChartBaseMixins, ChartPieMixins],
  props: {
    showLegend: {
      type: Boolean,
      default: true
    },
    legendPosition: {
      type: String,
      default: "right"
    },
    legendFormatter: {
      type: Function,
      default: (item) => {
        return item[0];
      }
    },
    fontSize: {
      type: [String, Number],
      default () {
        return 0.28;
      }
    },
    isGragdient: {
      type: Boolean,
      default: true
    },
    upColor: {
      type: String,
      default: "#6CCB73"
    },
    upIcon: {
      type: String,
      default: "icon-shangla"
    },
    unchangeColor: {
      type: String,
      default: "#A8C7F9"
    },
    unchangeIcon: {
      type: String,
      default: "icon-stable"
    },
    downColor: {
      type: String,
      default: "#E64C3B"
    },
    downIcon: {
      type: String,
      default: "icon-arrow-down"
    }
  },
  watch: {
    chartData: {
      handler () {
        this.reset();
        this.startLoop();
      }
    }
  },
  computed: {
    source () {
      return this.chartData && this.chartData.length > 1 ? this.chartData.slice(1) : [];
    },
    options () {
      return {
        textStyle: this.textStyle,
        tooltip: {
          showContent: true,
          triggerOn: "none",
          // alwaysShowContent: true,
          position: ["50%", "50%"],
          backgroundColor: "transparent",
          textStyle: {
            color: "#fff",
            fontSize: +this.fontSize_
          },
          extraCssText: "transform: translate(-50%, -50%); text-align: center; line-height: 1.5;z-index: 1;width: 40%; padding: 0;",
          formatter: params => {
            let increase = "";
            const prefix = this.getPrefix(params.data[2]);
            if (prefix) {
              increase = `
                <p style="font-size: ${+this.fontSize_}px;color:#fff">
                  <i class="iconfont ${this[prefix + "Icon"]}" style="color:${this[prefix + "Color"]}"></i>
                  ${params.data[2]}%
                </p
              `;
            }
            return `
              <p style="font-size: ${+this.fontSize_}px;color:#fff;text-overflow:ellipsis;overflow:hidden;white-space:nowrap;">${params.name}</p>
              <p style="color: #4FCFD5;font-size: ${+this.fontSize_ * 1.5}px;">${thousandCentimeter(params.data[1])}<sub style="font-size: ${+this.fontSize_}px;bottom:0;">${this.unit || ""}</sub></p>
            ` + increase;
          }
        },
        series: [
          {
            name: "selected",
            type: "pie",
            silent: true,
            clockwise: true,
            hoverOffset: 4,
            center: ["50%", "50%"],
            radius: ["65%", "65%"],
            label: { show: false },
            labelLine: { show: false },
            itemStyle: {
              color: "#4FCFD5"
            },
            z: 2
          },
          {
            type: "pie",
            clockwise: true,
            hoverOffset: 0,
            center: ["50%", "50%"],
            radius: ["70%", "100%"],
            label: { show: false },
            labelLine: { show: false },
            z: 3
          }
        ],
        dataset: this.chartData && this.chartData.length ? {
          source: this.chartData
        } : [],
        color: this.colors
      };
    }
  },
  methods: {
    getPrefix(value) {
      let res = "";
      if (value > 0) {
        res = "up";
      } else if (value === 0) {
        res = "unchange";
      } else if (value < 0) {
        res = "down";
      }
      return res;
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.startLoop();
    });
  }
};
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
      flex: 4;
      height: 100%;
    }
    .legend {
      width: 0;
      flex: 3;
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
      align-items: flex-start;
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
