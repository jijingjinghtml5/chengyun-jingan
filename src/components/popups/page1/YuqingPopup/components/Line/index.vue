<template>
  <v-chart style="width: 100%;" v-if="chartData.length" class="chart" ref="chartRef" :options="option" auto-size />
</template>

<script>
export default {
  name: "ChartLine",
  props: {
    chartData: {
      data: Array,
      default: () => []
    }
  },
  computed: {
    option() {
      let series = this.chartData.length ? this.chartData[0].slice(1).map(item => {
        return {
          type: 'line',
          symbol: 'none',
          smooth: true
        }
      }) : [];
      return {
        color: [
          '#24A8F5',
          '#FF7A45',
          '#C5D8FF',
          '#0F71FD',
          '#47D1B9',
          '#FCE466',
          '#C566FC'
        ],
        dataset: {
          source: this.chartData
        },
        tooltip: {
          trigger: "axis",
          textStyle: {
            fontSize: 30
          }
        },
        legend: {
          textStyle: {
            color: "#fff",
            fontSize: 30
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            axisTick: { show: false },
            axisLine: {
              lineStyle: {
                type: 'dashed',
                color: 'rgba(255, 255, 255)'
              }
            },
            axisLabel: {
              color: "#ffffff",
              fontSize: 30
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            axisLabel: {
              color: "#ffffff",
              fontSize: 30
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: 'rgba(255, 255, 255, 0.2)'
              }
            }
          }
        ],
        series
      };
    }
  }
};
</script>
