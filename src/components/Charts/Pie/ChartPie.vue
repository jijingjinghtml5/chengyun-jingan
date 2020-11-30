<template>
  <div class="v-chart-container">
    <v-chart
      :style="{ width: '100%', height: '100%' }"
      :options="options"
      autoresize
      auto-resize
    />
  </div>
</template>
<script>
// 渐变圆环
import ChartBaseMixins from "../mixins/ChartBaseMixins";
export default {
  name: "CharPie",
  mixins: [ChartBaseMixins],
  props: {
    percent: {
      type: [Number, String],
      default: "-"
    },
    fontSize: {
      type: [String, Number],
      default () {
        return 0.48;
      }
    },
    isGragdient: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    options () {
      const percent = isNaN(this.percent) ? 0 : this.percent;
      return {
        textStyle: this.textStyle,
        title: {
          text: this.percent + "%",
          top: "center",
          left: "center",
          textStyle: {
            color: "#fff",
            fontWeight: 500,
            fontFamily: "DIN",
            fontSize: +this.fontSize_,
            lineHeight: 1
          }
        },
        series: [
          {
            name: "文字背景",
            type: "pie",
            silent: true,
            center: ["50%", "50%"],
            clockwise: false,
            radius: [0, "75%"],
            label: { show: false },
            labelLine: { show: false },
            itemStyle: {
              color: "#001837"
            },
            data: [100],
            z: 2
          },
          {
            name: "底部圆环",
            type: "pie",
            silent: true,
            clockwise: false,
            center: ["50%", "50%"],
            radius: ["92.5%", "97.5%"],
            label: { show: false },
            labelLine: { show: false },
            itemStyle: {
              color: "#001837"
            },
            data: [100],
            z: 1
          },
          {
            name: "环",
            type: "pie",
            silent: true,
            clockwise: false,
            center: ["50%", "50%"],
            radius: ["90%", "100%"],
            label: { show: false },
            labelLine: { show: false },
            data: [
              {
                value: Math.min(percent, 100),
                itemStyle: {
                  color: this.isGragdient ? {
                    colorStops: this.getGradientColor(0).colorStops
                  } : this.getGradientColor(0)
                }
              },
              {
                value: Math.max(100 - percent, 0),
                itemStyle: {
                  color: "transparent"
                }
              }
            ],
            z: 3
          }
        ]
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
}
</style>
