export default {
  name: "ChartPieAutoMixins",
  data () {
    return {
      timer: null,
      centerText: true
    };
  },
  methods: {
    startLoop () {
      if (!this.$refs.chart) return false;
      if (this.noData) return false;
      this.centerText = true;
      let index = 0;
      const len = this.chartData.length - 1;
      this.timer = setInterval(() => {
        this.centerText && (this.centerText = false);
        index = index % len;
        this.toggleTip(index, this.chartData[index + 1][0]);
        index++;
        if (len < 2) {
          clearInterval(this.timer);
          this.timer = null;
        }
      }, 3000);
    },
    reset () {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
      this.toggleTip();
    },
    toggleTip (index, name) {
      if (!this.$refs.chart) return false;
      if (index || index === 0) {
        this.$refs.chart.dispatchAction({
          type: "downplay"
        });
        this.$refs.chart.dispatchAction({
          type: "showTip",
          seriesIndex: 0,
          dataIndex: index
        });
        this.$refs.chart.dispatchAction({
          type: "highlight",
          seriesIndex: 0,
          name: name
        });
      } else {
        this.$refs.chart.dispatchAction({
          type: "downplay"
        });
        this.$refs.chart.dispatchAction({
          type: "hideTip"
        });
      }
    }
  },
  beforeDestroy () {
    this.reset();
  }
};
