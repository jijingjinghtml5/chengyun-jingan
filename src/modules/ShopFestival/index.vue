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
        <p class="chart-title">今日客流</p>
        <div style="height: 80%;">
          <bar-chart
            :showLegend="true"
            :chartData="newchartData"
            :colors="colors1"
            :barMaxWidth="1"
            :showYLabel="true"
            :pageLen="20"
            unit="人次"
          >
          </bar-chart>
        </div>
      </div>
      <div class="right" style="width: 14rem;">
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
            <p class="value">{{ residueCars }}<span>个</span>（{{ parkText.rate }}%）</p>
          </div>
          <div class="total-wrap-item" :style="{ color: parkText.color }">
            <img :src="require(`./${parkText.text}.png`)" alt="">
            <p>实时：停车位{{ parkText.text }}</p>
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
          <p class="title" @mouseover="showTooltip = true" @mouseout="showTooltip = false">商圈舆情 <img width="36" src="./tooltip.png" ></p>
          <div class="tooltip" v-if="showTooltip">
            <p>正面：是能够对传播涉及到的主体形成正向的、积极的影响的舆情；</p>
            <p>负面：是那些对于涉及的主体从不同角度会形成负面影响的舆情；</p>
            <p>中性：对于涉及的主体一般是中性的描述，无论从哪一方面都既不会造成正面的影响，也不会造成负面的影响。</p>
          </div>
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
          <div class="left_right_top">
            <p class="title">地铁客流</p>
            <CustomTable style="height: 2.7rem;" tableType="地铁客流" :tableData="subwayList"></CustomTable>
          </div>
          <div class="left_right_bottom">
            <p class="title">营商信息</p>
            <div class="money-wrap" style="background-color: #072D73;">
              <p>累计交易金额</p>
              <p class="value" style="color: #0E72FC;">
                {{ money.accumulate | thousandCentimeter }}
              </p>
              <p>万元</p>
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
import { getCount, getCase, getRoadInfo, getPark, getTodayMetroFlow } from './api.js'
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
  computed: {
    parkText() {
      let rate = Math.round(this.residueCars / this.totalCars * 100)
      return {
        text: rate > 50 ? '充足' : (rate > 20 ? '适中' : '紧张'),
        color: rate > 50 ? 'green' : (rate > 20 ? 'yellow' : 'red'),
        rate
      }
    }
  },
  data() {
    return {
      showTooltip: false,
      selectshop: '兴业太古汇',
      selectPark: '兴业太古汇',
      activities: [],
      caseList: [],
      roadInfo: [],
      subwayList: [],
      totalCars: 0,
      residueCars: 0,
      subways: [
        '延长路',
        '昌平路',
        '自然博物馆',
        '武宁路',
        '西藏北路',
        '中兴路',
        '曲阜路',
        '南京西路',
        '静安寺',
        '宝山路',
        '中山北路',
        '汶水路',
        '上海马戏城',
        '彭浦新村',
        '上海火车站',
        '汉中路'
      ],
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
      colors1: ['#F96F4F', '#1ABC9C'],
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
      }
    }
  },
  created() {
    this.$timer.register(() => {
      getRoadInfo().then(res => {
        this.roadInfo = res.data || []
      })
    }, this)
    this.getShopChart()
    this.getParkChart()
    getTodayMetroFlow().then(res => {
      this.subwayList = res.data || []
    })
    getCase().then(res => {
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
      console.log(res, 'business_opinion')
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
        query_name: "data_time,data_time,business_district",
        query_value:dayjs().startOf('day').format('YYYY-MM-DD HH:mm:ss') + ',' + dayjs().format('YYYY-MM-DD HH:mm:ss') + ',' + this.selectshop,
        query_operation: "gte,lte,eq",
        query_match_type: "and"
      }).then(res => {
        let result = res.data || []
        this.newchartData = [
          ['时间', '客流'],
          ...result.map(item => {
            return [item.data_time.split(' ')[1].slice(0, 5), Number(item.number)]
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
              margin-left: 10%;
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
        &_right {
          position: relative;
          .tooltip {
            position: absolute;
            left: 2.5rem;
            top: 0.15rem;
            width: 4rem;
            padding: 0.1rem;
            line-height: 0.4rem;
            z-index: 2;
            background-color: #062468;
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
    &.bottom-section {
      .left {
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
        background-color: transparent;
        &_right {
          background: none;
          & > div {
            background-color: #062468;
            padding: 0.15rem;
            & + div {
              margin-top: 0.2rem;
            }
          }
          .money-wrap {
            padding: 0.15rem;
            display: flex;
            align-items: center;
            justify-content: center;
            & > p {
              font-size: 0.3rem;
            }
            .value {
              font-size: 0.5rem;
              text-align: center;
              padding: 0.15rem 0;
              font-weight: bold;
              margin: 0 0.1rem 0 0.3rem;
            }
          }
        }
        &_left {
          background-color: #062468;
          padding: 0.15rem;
        }
        & > div {
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
