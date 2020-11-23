const scssVariables = require("../../../style/var.js");
export default {
  name: "ChartMixins",
  data () {
    return {
      scssVariables: Object.freeze(scssVariables)
    };
  },
  inject: {
    createFnForCalcRealPx: {
      from: "createFnForCalcRealPx",
      default: val => val
    }
  },
  props: {
    colors: {
      type: Array,
      default: () => []
    },
    chartData: {
      type: Array,
      default: () => {
        return [];
      }
    },
    showLegend: {
      type: Boolean,
      default: false
    },
    legendConfig: {
      type: Object,
      default: () => {
        return {
          top: 0,
          right: 0
        };
      }
    },
    isGradient: {
      type: Boolean,
      default: false
    },
    gradientBySelf: {
      type: Boolean,
      default: false
    },
    gradientDir: {
      type: String,
      default: "y"
    },
    isCustom: {
      type: Boolean,
      default: false
    },
    fontSize: {
      type: [String, Number],
      default () {
        return 0.24;
      }
    },
    labelColor: {
      type: String,
      default: () => {
        return scssVariables.chartLableColor;
      }
    },
    unit: {
      type: String,
      default: null
    }
  },
  computed: {
    noData () {
      return !(this.chartData && this.chartData.length > 1);
    },
    textStyle () {
      return {
        fontFamily: ["DIN", "Microsoft YaHei"],
        fontSize: +this.fontSize
      };
    },
    fontSize_ () {
      return this.createFnForCalcRealPx(this.fontSize);
    }
  },
  methods: {
    getColor (i) {
      let res = this.colors[i % this.colors.length];
      if (this.isCustom) {
        res = params => {
          return !this.isGradient ? this.colors[params.dataIndex % this.colors.length] : this.getGradientColor(params.dataIndex);
        };
      } else {
        this.isGradient && (res = this.getGradientColor(i));
      }
      return res;
    },
    getGradientColor (i) {
      return {
        type: "linear",
        x: this.gradientDir === "x" ? 1 : 0,
        y: 0,
        x2: 0,
        y2: this.gradientDir === "y" ? 1 : 0,
        colorStops: [{
          offset: 0, color: this.gradientBySelf ? this.colors[i] + "ff" : this.colors[2 * i] // 0% 处的颜色
        }, {
          offset: 1, color: this.gradientBySelf ? this.colors[i] + "00" : this.colors[2 * i + 1] // 100% 处的颜色
        }],
        global: false // 缺省为 false
      };
    }
  }
};
