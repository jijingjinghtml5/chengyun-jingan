export default {
  name: "ChartMixins",
  props: {
    barMaxWidth: {
      type: [String, Number],
      default () {
        return 0.2;
      }
    },
    pageLen: {
      type: [String, Number],
      default: 10
    },
    showXLabel: {
      type: Boolean,
      default: true
    },
    showYLabel: {
      type: Boolean,
      default: false
    },
    categoryLabelFmt: {
      type: Function,
      default: null
    },
    isArea: {
      type: Boolean,
      default: true
    },
    isSmooth: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    baseOptions () {
      return {
        textStyle: this.textStyle,
        legend: {
          show: this.showLegend,
          itemWidth: this.createFnForCalcRealPx(0.16),
          itemHeight: this.createFnForCalcRealPx(0.16),
          itemGap: 20,
          textStyle: {
            color: this.labelColor,
            fontSize: +this.fontSize_
          },
          ...(this.legendConfig || {})
        },
        grid: {
          top: this.showLegend ? +this.fontSize_ * 1.5 : +this.fontSize_ * 0.5,
          left: 0,
          right: 0,
          bottom: this.dataZoomConfig.show ? this.createFnForCalcRealPx(0.1) : 0,
          containLabel: true
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          },
          appendToBody: true,
          textStyle: {
            fontSize: +this.fontSize_,
            lineHeight: +this.fontSize_ * 1.15
          },
          extraCssText: "text-align: left"
        },
        xAxis: this.xAxis,
        yAxis: this.yAxis,
        dataset: this.chartData && this.chartData.length ? {
          source: this.chartData
        } : [],
        color: this.colors
      };
    },
    dataZoomConfig () {
      const config = {
        show: false,
        end: 100
      };
      const pageLen = +this.pageLen;
      if (pageLen && this.chartData && ((this.chartData.length - 1) > pageLen)) {
        config.show = true;
        config.end = Math.min(100, Math.floor((pageLen / (this.chartData.length)) * 100));
      }
      return config;
    },
    axisLine () {
      return {
        lineStyle: {
          width: this.createFnForCalcRealPx(0.04),
          color: this.scssVariables.chartBorderColor
        }
      };
    },
    dataZoom () {
      return [
        {
          type: "slider",
          xAxisIndex: 0,
          start: 0,
          zoomOnMouseWheel: false,
          moveOnMouseMove: false,
          zoomLock: true,
          fillerColor: this.scssVariables.scrollBarColor,
          height: this.createFnForCalcRealPx(0.1),
          borderColor: this.scssVariables.scrollBarColor,
          showDetail: false,
          bottom: 0,
          ...this.dataZoomConfig
        }
      ];
    },
    xAxis () {
      return {
        type: "category",
        splitLine: { show: false },
        axisLabel: {
          show: this.showXLabel,
          fontSize: +this.fontSize_,
          color: this.labelColor,
          interval: 0,
          formatter: this.categoryLabelFmt
        },
        // inverse: true,
        axisTick: { show: false },
        axisLine: this.axisLine
      };
    },
    yAxis () {
      return {
        type: "value",
        splitNumber: 3,
        splitLine: { show: false },
        axisLabel: {
          show: this.showYLabel,
          fontSize: +this.fontSize_,
          color: this.labelColor,
          showMinLabel: false,
          formatter: "{value}" + (this.unit || "")
        },
        axisTick: { show: false },
        axisLine: { show: false }
      };
    },
    barMaxWidth_ () {
      return this.createFnForCalcRealPx(this.barMaxWidth);
    }
  }
};
