<template>
  <div id="ShopFestival">
    <header>
      <p>静安区”五.五购物节”运行态势监测模块</p>
      <img src="./close.png" @click="$bus.$emit('closeFestival')">
    </header>
    <section>
      <div class="left">
        <div class="select-wrap">
          <el-select v-model="selectshop" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </div>
        <p class="title">商圈信息</p>
        <p class="chart-title">近7日客流</p>
        <div style="height: 80%;">
          <bar-chart
            :showLegend="true"
            :chartData="newchartData"
            :colors="colors"
            :barMaxWidth="1"
            :showYLabel="true"
            unit="人次"
          >
          </bar-chart>
        </div>
      </div>
      <div class="right">
        <p class="title">活动信息</p>
        <CustomTable tableType="活动信息" :tableData="activities"></CustomTable>
      </div>
    </section>
    <section class="center-section">
      <div class="left">
        <div class="select-wrap">
          <el-select v-model="selectPark" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </div>
        <p class="title">停车车位</p>
        <div class="total-wrap">
          <div class="total-wrap-item">
            <p>总车位数</p>
            <p class="value">{{ totalCars }}<span>个</span></p>
          </div>
          <div class="total-wrap-item">
            <p>剩余车位数</p>
            <p class="value">{{ residueCars }}<span>个</span></p>
          </div>
        </div>
        <div style="height: 4.2rem;">
          <line-chart :chartData="carChart" :colors="colors">
          </line-chart>
        </div>
      </div>
      <div class="right">
        <div class="right_left" style="width: 3rem;">
          <p class="title">投诉信息</p>
          <CustomTable tableType="投诉信息" :tableData="caseList"></CustomTable>
        </div>
        <div class="right_right">
          <p class="title">商圈舆情</p>
          <div style="height: 80%;">
            <PieChart :chartData="pieChartData" :colors="colors"></PieChart>
          </div>
        </div>
      </div>
    </section>
    <section class="bottom-section">
      <div class="left">
        <div class="left_left">
          <p class="title">周边路况</p>
          <CustomTable tableType="周边路况" :tableData="roadInfo"></CustomTable>
        </div>
        <div class="left_right">
          <p class="title">累计交易金额(万元)</p>
          <div class="money-wrap" style="background-color: #072D73;">
            <p>交易总金额</p>
            <p class="value" style="color: #0E72FC;">{{ money.accumulate | thousandCentimeter }}</p>
          </div>
          <div class="wrap">
            <div class="money-wrap" style="background-color: #173373;">
              <p>南京西路商圈</p>
              <p class="value" style="color: #ADC4EB;">{{ money.nanjing_west | thousandCentimeter }}</p>
            </div>
            <div class="money-wrap" style="background-color: #11366B;">
              <p>苏河湾商圈</p>
              <p class="value" style="color: #57BB8C;">{{ money.suhewan | thousandCentimeter }}</p>
            </div>
          </div>
          <div class="wrap">
            <div class="money-wrap" style="background-color: #1A3668;">
              <p>大宁商圈</p>
              <p class="value" style="color: #F77E4B;">{{ money.daning | thousandCentimeter }}</p>
            </div>
            <div class="money-wrap" style="background-color: #0A3176;">
              <p>静安寺商圈</p>
              <p class="value" style="color: #2798E2;">{{ money.jingansi | thousandCentimeter }}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="right">
        <p class="title">周边视频</p>
        <CustomVideo></CustomVideo>
      </div>
    </section>
  </div>
</template>

<script>
import BarChart from '@/components/Charts/Bar/ChartBar.vue'
import LineChart from './ChartLine.vue'
import PieChart from './ChartPie.vue'
import CustomTable from './CustomTable.vue'
import CustomVideo from './video.vue'
import { getCount, getCase, getRoadInfo, getPark } from './api.js'
import dayjs from 'dayjs'
export default {
  name: 'ShopFestival',
  components: {
    BarChart,
    LineChart,
    CustomTable,
    PieChart,
    CustomVideo
  },
  watch: {
    selectshop(newValue, oldValue) {
      this.getShopChart()
    },
    selectPark(newValue, oldValue) {
      this.getParkChart()
    }
  },
  data() {
    return {
      selectshop: '久光百货',
      selectPark: '兴业太古汇',
      activities: [],
      caseList: [],
      roadInfo: [],
      totalCars: 0,
      residueCars: 0,
      options: [
        '兴业太古汇',
        '久光百货',
        '梅龙镇广场',
        '上海恒隆广场',
        '中信泰富广场',
        '静安大悦城',
        '上海久光中心',
        '静安大融城',
        '晶品购物商场',
        '芮欧百货',
        '静安嘉里中心'
      ],
      colors: ['#1ABC9C', '#679DF4', '#F96F4F', '#BE6CCC', '#D0021B'],
      newchartData: [],
      carChart: [
        ['时间', '客流']
      ],
      pieChartData: [
        ['类型', '数量']
      ],
      money: {
        jingansi: 0,
        daning: 0,
        suhewan: 0,
        nanjing_west: 0,
        accumulate: 0
      },
      points: [
        '121.4586,31.23069',
        '121.441,31.22612',
        '121.4525,31.23021',
        '121.4494,31.22928',
        '121.4511,31.23004',
        '121.4673,31.24641',
        '121.4476,31.2777',
        '121.4212,31.28178',
        '121.4433,31.2254',
        '121.4417,31.2276',
        '121.4452,31.22605'
      ]
    }
  },
  created() {
    this.getShopChart()
    this.getParkChart()
    getRoadInfo().then(res => {
      this.roadInfo = res.data || []
    })
    let filter = this.points.reduce((acc, item) => {
      acc.push(`distance=${item},500m`)
      return acc
    }, []).join('|')
    getCase({
      filter: `(${filter})%26is_delete=neq.1%26openTS=-604800`
    }).then(res => {
      this.caseList = (res.data || []).map(item => {
        return {
          ...item,
          openTS: dayjs(item.openTS * 1000).format('YYYY-MM-DD')
        }
      })
    })
    getCount({
      table: 'activities'
    }).then(res => {
      this.activities = res.data || []
    })
    getCount({
      table: 'transaction_amount',
      response_type: 'map'
    }).then(res => {
      let result = res.data || {}
      this.money = {
        jingansi: result.jingansi,
        daning: result.daning,
        suhewan: result.suhewan,
        nanjing_west: result.nanjing_west,
        accumulate: result.accumulate
      }
    })
    getCount({
      table: 'business_opinion',
      response_type: 'map'
    }).then(res => {
      let result = res.data || {}
      this.pieChartData = [
        ['类型', '数量'],
        ['正面', Number(result.front)],
        ['中性', Number(result.neutral)],
        ['负面', Number(result.negative)],
      ]
    })
  },
  methods: {
    getShopChart() {
      getCount({
        table: 'passenger_flow',
        query_name: "business_district",
        query_value: this.selectshop,
        query_operation: "eq"
      }).then(res => {
        let result = res.data || []
        this.newchartData = [
          ['时间', '客流'],
          ...result.map(item => {
            return [item.data, item.number]
          })
        ]
      })
    },
    getParkChart() {
      getPark({
        name: this.selectPark
      }).then(res => {
        this.carChart = [
          ['时间', '剩余车位'],
          ...res.data.map(item => {
            return [item.time, item.free]
          })
        ]
        let nowData = res.data.slice(-1)[0]
        this.totalCars = nowData.total
        this.residueCars = nowData.free
      })
    }
  },
}
</script>
<style type="text/css">
#ShopFestival {
  .el-select {
    .el-input {
      &.is-focus {
        .el-input__inner {
          border: none;
        }
      }
      .el-select__caret {
        font-size: 0.24rem;
      }
    }
    .el-input__inner {
      padding-right: 0.4rem;
      border: none;
      background-color: #073D96;
    }
    &:hover {
      .el-input__inner {
        border: none;
      }
    }
  }
}
</style>
<style scoped lang="scss">
#ShopFestival {
  position: absolute;
  left: 24.1rem;
  top: 1.8rem;
  width: 28.53rem;
  height: 19.5rem;
  z-index: 2000;
  background-color: #04225C;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.15rem;
  header {
    background: url(title_bg.png) center center no-repeat;
    background-size: 100% 100%;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    position: relative;
    width: 100%;
    height: 1.2rem;
    & > p {
      color: #FFFFFF;
      font-size: 0.7rem;
    }
    & > img {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      right: 0.15rem;
      width: 0.8rem;
      cursor: pointer;
    }
  }
  section {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 6rem;
    &.center-section {
      .left {
        .total-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
          &-item {
            display: flex;
            align-items: center;
            padding: 0.2rem 0;
            & + .total-wrap-item {
              margin-left: 20%;
            }
            & > p {
              font-size: 0.32rem;
            }
            .value {
              color: #2595D8;
              font-weight: bold;
              font-size: 0.4rem;
              margin: 0 0.1rem;
              span {
                font-size: 0.32rem;
                font-weight: normal;
              }
            }
          }
        }
      }
      .right {
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
        background-color: transparent;
        & > div {
          padding: 0.15rem;
          background-color: #062468;
          height: 100%;
          flex: 1;
          & + div {
            margin-left: 0.15rem;
          }
        }
      }
    }
    &.bottom-section {
      .left {
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
        background-color: transparent;
        &_right {
          .wrap {
            margin-top: 0.3rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
            & > div {
              flex: 1;
            }
          }
          .money-wrap {
            & + .money-wrap {
              margin-left: 0.3rem;
            }
            padding: 0.15rem;
            & > p {
              font-size: 0.3rem;
            }
            .value {
              font-size: 0.5rem;
              text-align: center;
              padding: 0.15rem 0;
              font-weight: bold;
            }
          }
        }
        & > div {
          padding: 0.15rem;
          background-color: #062468;
          height: 100%;
          flex: 1;
          & + div {
            margin-left: 0.15rem;
          }
        }
      }
    }
    & + section {
      margin-top: 0.2rem;
    }
    & > div {
      background-color: #062468;
      height: 100%;
      flex: 0 0 50%;
      padding: 0.15rem;
      position: relative;
      .title {
        font-size: 0.4rem;
        padding: 0.15rem 0;
      }
      .chart-title {
        text-align: center;
        font-size: 0.35rem;
      }
      .select-wrap {
        position: absolute;
        right: 0.15rem;
        top: 0.15rem;
      }
      & + div {
        margin-left: 0.2rem;
      }
    }
  }
}
</style>
