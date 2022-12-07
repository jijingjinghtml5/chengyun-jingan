<template>
  <div class="container">
    <div class="title">
      <p>{{info.name}}</p>
      <div class="line"></div>
    </div>
    <div class="base-info">
        <div class="title">
          <div class="left"><p class="second-title">基本信息</p></div>
          <div class="right" ><span class="iconfont icon-dangqianweizhi" @click="openPoints">[历史轨迹]</span></div>
        </div>
        <div class="item">
          <span>所属区: </span>
          <span style="color:#ffffff;">{{detail.district}}</span>
        </div>
        <div class="item">
          <span>所属街道: </span>
          <span style="color:#ffffff;">{{detail.town}}</span>
        </div>
        <div class="item">
          <span>所属部门: </span>
          <span style="color:#ffffff;">{{detail.department}}</span>
        </div>
        <div class="item">
          <span>当前状态: </span>
          <span class="item-value" :style="{color: detail.status==1 ? '#67c23a':(detail.status ==2 ?  '#4d78a4' : '#f96f4f')}">{{ detail.status | getStatus}}</span>
        </div>
    </div>
    <div class="job-info">
      <div class="sub-title">
        <div class="left"><p class="second-title">案件信息</p></div>
        <div class="right">
          <m-tabs  v-model="currentChartTab" :tabs="chartTabs" activeStyle="color: #80D8FF"></m-tabs>
        </div>
      </div>
      <div class="chart-content" v-if="currentChartTab==='上报'">
        <div class="chart-title">
              <div class="chart-title-item" >{{chartTitle1}}</div>
              <div class="chart-title-item">
                 <m-tabs  v-model="upCaseTab" :tabs="upCaseTabs" activeStyle="color:#80D8FF" @change="handleChangeForTabUp"></m-tabs>
              </div>
        </div>
       <div class="chart-body">
         <chart-line :chartData="upData" :color="'#01D6E8'"></chart-line>
        </div>
      </div>
      <div class="chart-content" v-else>
        <div class="chart-title">
              <div class="chart-title-item" >{{chartTitle2}}</div>
              <div class="chart-title-item">
                <m-tabs  v-model="handlerCaseTab" :tabs="handlerCaseTabs" activeStyle="color: #80D8FF" @change="handleChangeForTabHandler"></m-tabs>
              </div>
        </div>
        <div class="chart-body">
          <chart-line :chartData="handlerData" :color="'#69F0AE'"></chart-line>
        </div>
      </div>
      <div class="statistics">
        <div class="item">
          <div class="item-label">一般流程</div>
          <div class="line"></div>
          <div class="item-value">{{liucheng.normal | thousandCentimeter}}</div>
        </div>
        <div class="item">
          <div class="item-label">简易流程</div>
          <div class="line"></div>
          <div class="item-value">{{liucheng.simple | thousandCentimeter}}</div>
        </div>
      </div>
      <div class="case-types" v-if="caseTypes.length>0">
        <div>案件分类统计</div>
        <div class="type-body">
          <div class="item" v-for="(item,index) in caseTypes" :key="index">
            <span class="label">{{item.district_eventType}}:</span>
            <span class="value">{{item.count | thousandCentimeter}}</span>
          </div>
        </div>
      </div>
      <component v-bind:is="soldierComponent" :data="soldierData"></component>
    </div>
  </div>
</template>
<script>
import mTabs from './component/MTabs'
import chartLine from './component/chart/ChartLine'
import { getStatus } from '@res/constant'
import { getTrendData, getDetailData } from './api'

import { getDate, formatterDate } from '@res/utils/tools'

export default {
  name: 'workerPopup',
  components: {
    mTabs,
    chartLine
  },
  inject: ['getGlobalConfig'],
  props: {
    info: {
      type: Object,
      default: () => {
        return {
        }
      }
    }
  },
  filters: { getStatus },
  watch: {
    info: {
      handler (nv) {
        this.getDetail()
        this.upCaseTab = '日'
        this.handlerCaseTab = '日'
        this.personId = this.getIDString(nv.primeID)
        this.getTrendData('find', this.personId, 'today', 'openTS.hour')
        this.getTrendData('done', this.personId, 'today', 'openTS.hour')
      },
      immediate: true,
      deep: true
    }
  },
  computed: {
    detail () {
      return {
        ...this.info,
        ...this.detailData
      }
    },
    chartTitle1 () {
      switch (this.upCaseTab) {
        case '月':
          return '当月上报案件趋势'
        case '周':
          return '当周上报案件趋势'
        default:
          return '当日上报案件趋势'
      }
    },
    chartTitle2 () {
      switch (this.handlerCaseTab) {
        case '月':
          return '当月处置案件趋势'
        case '周':
          return '当周处置案件趋势'
        default:
          return '当日处置案件趋势'
      }
    },
    caseTypes () {
      if (this.currentChartTab === '上报') {
        return this.upCaseTypes
      } else {
        return this.handleCaseTypes
      }
    },
    liucheng () {
      if (this.currentChartTab === '上报') {
        return this.upStatistics
      } else {
        return this.handleStatistics
      }
    },
    soldierData () {
      return {
        rawData: this.info,
        info: this.info
      }
    }
  },
  data () {
    return {
      btnType: '',
      personId: '159178',
      personIdString: '',
      soldierComponent: '',
      info1: {
        name: '张珊',
        district: '静安区'
      },
      upCaseTabs: [
        { label: '日', value: '日' },
        { label: '周', value: '周' },
        { label: '月', value: '月' }
      ],
      upCaseTab: '日',
      handlerCaseTabs: [
        { label: '日', value: '日' },
        { label: '周', value: '周' },
        { label: '月', value: '月' }
      ],
      currentChartTab: '上报',
      chartTabs: [
        { label: '上报', value: '上报' },
        { label: '处置', value: '处置' }
      ],
      handlerCaseTab: '日',
      upData: [
        ['时间', '数量'],
        ['11-20', 150],
        ['2', 250],
        ['3', 200],
        ['4', 100],
        ['5', 100],
        ['6', 50],
        ['7', 150],
        ['11-28', 100]
      ],
      upStatistics: {
        normal: '-',
        simple: '-'
      },
      handlerData: [
        ['时间', '数量'],
        ['1', 150],
        ['2', 250],
        ['3', 200],
        ['4', 100],
        ['5', 100],
        ['6', 50],
        ['7', 150],
        ['8', 100]
      ],
      handleStatistics: {
        normal: '-',
        simple: '-'
      },
      upCaseTypes: [
      ],
      handleCaseTypes: [],
      hourData: [],
      dayData: [],
      detailData: {}
    }
  },
  created () {

  },
  methods: {
    openPoints () {
      this.$emit('addNewPopup', {
        key: 'pointsList',
        componentName: 'PointsList',
        showClose: true,
        mapData: this.info
      })
    },
    pathOptmize (data) {
      // 按照时间排序 然后相邻的两个点如果一样删除
      const arr = []
      let lastPoint = null
      data.forEach(item => {
        if (lastPoint) {
          if (lastPoint.lat !== item.lat || lastPoint.lon !== item.lon) {
            arr.push(item)
            lastPoint = item
          }
        } else {
          arr.push(item)
          lastPoint = item
        }
      })
      return arr
    },
    getDetail () {
      if (this.info.primeID) {
        getDetailData(this.info.primeID).then(res => {
          this.detailData = res.detail
        })
      }
    },
    getIDString (idString) {
      const ids = idString.split('.')
      return ids[ids.length - 1]
    },
    getTrendData (type, personId, time, groupBy) {
      getTrendData(type, personId, time, groupBy).then(res => {
        // console.log(res)
        let times = []
        let formatter = null
        const dateFmt = 'yyyy-MM-dd'
        switch (time) {
          case 'today':
            times = new Array(24).fill(0).map((v, index) => {
              return index.toString().padStart(2, '0')
            })
            break
          case 'currentWeek':
            times = getDate('currentWeek', { containToday: true, dataConfig: { dateFmt: dateFmt } }).map(item => {
              return item[0]
            })
            formatter = date => {
              return formatterDate(date, 'MM.dd')
            }
            break
          case 'currentMonth':
            times = getDate('currentMonth', { containToday: true, dataConfig: { dateFmt: dateFmt } }).map(item => {
              return item[0]
            })
            formatter = date => {
              return formatterDate(date, 'MM.dd')
            }
            break
        }
        // console.log(times, formatter)
        const dataDict = {}
        res.data.aggResults[groupBy].map(item => {
          let time = item.time_fm
          if (groupBy === 'openTS.hour') {
            time = time.substr(-2)
          }
          dataDict[time] = item.count
        })
        const currentHour = new Date().getHours().toString().padStart(2, '0')
        const today = formatterDate(new Date(), dateFmt)
        let _tmp = []
        _tmp = times.map(t => {
          let val = dataDict[t] || 0
          switch (time) {
            case 'today':
              if (t > currentHour) {
                val = '-'
              }
              break
            case 'currentWeek':
            case 'currentMonth':
              if (t > today) {
                val = '-'
              }
              break
          }
          return [formatter ? formatter(t) : t, val]
        })
        if (type === 'find') {
          this.upStatistics.normal = res.data.aggResults.normal_process[0].count
          this.upStatistics.simple = res.data.aggResults.easy_process[0].count
          this.upCaseTypes = res.data.aggResults['district_eventType.1']
          this.upData = [
            ['时间', '数量'],
            ..._tmp
          ]
        } else {
          this.handleStatistics.normal = res.data.aggResults.normal_process[0].count
          this.handleStatistics.simple = res.data.aggResults.easy_process[0].count
          this.handleCaseTypes = res.data.aggResults['district_eventType.1']
          this.handlerData = [
            ['时间', '数量'],
            ..._tmp
          ]
        }
      })
    },
    handleChangeForTabUp () {
      switch (this.upCaseTab) {
        case '日':
          this.getTrendData('find', this.personId, 'today', 'openTS.hour')
          break
        case '周':
          this.getTrendData('find', this.personId, 'currentWeek', 'openTS.day')
          break
        case '月':
          this.getTrendData('find', this.personId, 'currentMonth', 'openTS.day')
          break
      }
    },
    handleChangeForTabHandler () {
      switch (this.handlerCaseTab) {
        case '日':
          this.getTrendData('done', this.personId, 'today', 'openTS.hour')
          break
        case '周':
          this.getTrendData('done', this.personId, 'currentWeek', 'openTS.day')
          break
        case '月':
          this.getTrendData('done', this.personId, 'currentMonth', 'openTS.day')
          break
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.container{
    width: 7rem;
    height: 18rem;
    background-color: rgba(9, 36, 71, 0.6);
    box-sizing: border-box;
    padding: 0.2rem 0.2rem;
    .title {
      margin-top:0.2rem;
      line-height: 0.6rem;
      color:#F9FEA5 ;
      P{
         margin-bottom:0.2rem;
        font-size: 0.46rem;
      }
    }
    .second-title{
     line-height: 0.5rem;
      font-size: 0.38rem;
      color:#ffffff ;
    }
    .base-info{
      margin-top:0.3rem;
      font-size: 0.32rem;
      border-bottom:2px dashed #448AFF;

      .title{
        display: flex;
        justify-content: space-between;
        .right{
          color: #80D8FF;
          cursor: pointer;
          &:hover{
            color: #fff;
          }
        }
      }
    }
    .item{
      margin: 0.2rem 0;
      color:#80D8FF;
    }
    .job-info{
      margin-top:0.3rem;
      font-size: 0.32rem;
      width: 100%;
      .chart-content{
        width: 100%;
        .chart-body{
          height: 3rem;
        }
      }
      .chart-title{
        margin:0.2rem 0;
        color:#80D8FF;
        .chart-title-item{
          display: inline;
          width: 50%;
        }
      }
      .statistics{
        display: flex;
        justify-content: space-between;
        .item{
          width: 49%;
          display: inline-table;
          background: linear-gradient(180deg, rgba(8, 49, 84, 0) 0%, #083154 100%);
          padding: 0.2rem;
          text-align: center;
          .item-label{
            font-size: 0.32rem;
            line-height: 0.72rem;
          }
          .item-value{
            color: #fff;
            font-size: 0.48rem;
            font-weight: bold;
            line-height: 0.8rem;
          }
        }
      }
      .case-types{
        .type-body{
          display: flex;
          flex-wrap: wrap;

          .item{
            width: 50%;
            margin: 10px 0;
            display: flex;
            .label{
              width: 160px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            .value{
              flex: 1;
              width: 0;
              color: #fff;
            }
          }
        }

      }
    }
    .line {
      height: 4px;
      background: linear-gradient(90deg, rgba(116, 228, 255, 0) 0%, rgb(64, 196, 255) 49%, rgba(64, 196, 255, 0) 100%);
    }
}
.sub-title{
  display: flex;
  .left{
    width: 50%;
  }
  .right{
    flex:1
  }
}

</style>
