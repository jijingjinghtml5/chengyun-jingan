<template>
<wrap-title :txt="txt" :level="2" icon="icon-biaoti" class="chart-container">
  <chart-line :chartData="chartData"  :colors="colors" :showYLabel="true" :isArea="false" :isSmooth="false" :showLegend="true"></chart-line>
</wrap-title>
</template>
<script>
import WrapTitle from "@/components/MTitle/WrapTitle";
import ChartLine from "../../components/Charts/Line/ChartLine.vue";

export default {
  components: { ChartLine, WrapTitle },
  name: "ChartPanel",
  props: {
    txt: {
      type: String,
      default: ""
    },
    chartData: {
      type: Array,
      default: () => {
        return [];
      }
    },
    colors: {
      type: Array,
      default: () => {
        return [
          "#30BC9B",
          "#4FCFD5",
          "#F96F4F",
          "#FCBF51",
          "#E64C3B",
          "#F23470",
          "#BE6CCC",
          "#989898",
          "#4E78A4",
          "#154FA3",
          "#1D7774",
          "#FB9EA9",
          "#AD7A9F",
          "#A57179",
          "#5458A9",
          "#F18F3A",
          "#E0595C",
          "#76B7B0",
          "#59A055",
          "#B9B1AC"
        ];
      }
    }
  }
};
</script>
<style lang="postcss" scoped>
.chart-container{
  height: 424px;
}
</style>
