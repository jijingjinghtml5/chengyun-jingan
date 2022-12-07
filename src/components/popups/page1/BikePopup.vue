<template>
  <div  class="panel">
    <div class="category">各街道车辆统计</div>
    <chart-bar :chartData="chartData" :colors="colors" labelColor="#D1C9C4"></chart-bar>
  </div>
</template>
<script>
import { getBikeStreet } from '../api.js'
import ChartBar from '@/components/Charts/BarY/ChartBarY'
export default {
  name: 'BikePopup',
  components: {
    ChartBar
  },
  props: {
    info: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      chartData: [],
      colors: ['#4FCFD5', 'rgb(108, 203, 115)']
    }
  },
  created () {
    getBikeStreet().then(res => {
      console.log(res, 'getBikeStreet')
      this.chartData = [
        ['街道', '骑行次数', '活跃车辆'],
        ...res.map(item => {
          return [item.streetName, item.ride, item.active]
        })
      ]
    })
  }
}
</script>
<style lang="scss" scoped>
.panel{
  width: 6rem;
  height: 15.6rem;
  padding: 0.4rem;
  border: 1px solid #4E78A4;

  font-size: 16*2px;
  color:rgba(146, 185, 247, 1);
  .category{
    width: 100%;
    font-size:22*2px;
    font-family:MicrosoftYaHei;
    color:rgba(146,185,247,1);
  }
}
</style>
