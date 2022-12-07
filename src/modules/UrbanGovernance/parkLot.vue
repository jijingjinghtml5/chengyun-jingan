<template>
  <div id="ParkLot">
    <div class="total-wrap">
      <p>
        总车位数：<span>{{ allPark }}</span>
      </p>
      <p>
        剩余车位：<span>{{ surplusPark }}</span>
      </p>
    </div>
    <ChartLine :chartData="chartData"></ChartLine>
  </div>
</template>

<script>
import { getParkLot, getParkLotChart } from './api.js'
import ChartLine from './components/ChartLine.vue'
export default {
  name: 'ParkLot',
  components: {
    ChartLine
  },
  data () {
    return {
      allPark: 0,
      surplusPark: 0,
      chartData: []
    }
  },
  created () {
    getParkLot().then(res => {
      console.log(res, 'getParkLot')
      let result = res.data[0] || {}
      this.allPark = result.totalBerth || 0
      this.surplusPark = result.leftBerth || 0
    })
    getParkLotChart().then(res => {
      this.chartData = [
        ['时间', '进场流量', '出场流量', '周边道路拥堵指数'],
        ...res.map(item => {
          return [item.sTime, item.inValue, item.outValue, item.fflt_index]
        })
      ]
    })
  }
}
</script>

<style lang="scss">
#ParkLot {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .total-wrap {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.15rem 10%;
    & > p {
      font-size: 0.36rem;
      span {
        color: #4FCFD5;
        font-weight: bold;
      }
    }
  }
}
</style>
