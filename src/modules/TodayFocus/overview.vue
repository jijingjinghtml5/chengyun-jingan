<template>
  <div class="overview">
    <div class="three-public">
        <div class="wall">
          <m-row gutter="10px">
            <m-column v-for="(item, index) in pubilcItems" :key="`public-${index}`">
              <tile :item="item" class="block"  ></tile>
            </m-column>
          </m-row>
        </div>
        <div class="chart">
          <wrap-title :level="2" txt="案件趋势" icon="icon-biaoti">
            <m-tabs slot="level-title" v-model="tab" :tabs="tabs" :autoChange="false"></m-tabs>
            <template v-if="tab === 'jingan-code'">
              <m-row gutter="10px">
                <m-column>
                  <NumStatics></NumStatics>
                </m-column>
                <m-column>
                  <CodeStatics></CodeStatics>
                </m-column>
              </m-row>
              <!-- <line-chart :showLegend="true" :legendConfig="legendConfig" :chartData="chartData" :colors="colors" :showYLabel="true" :pageLen="24" :isGradient="true" :gradientBySelf="true">
              </line-chart> -->
            </template>
            <template v-else-if="tab === 'case'">
              <line-chart :showLegend="true" :legendConfig="legendConfig" :chartData="chartData" :colors="colors" :showYLabel="true" :pageLen="24" :isGradient="true" :gradientBySelf="true">
              </line-chart>
            </template>
            <template v-else>
              <div class="times-tab">
                <p v-for="item in times" :class="{ active: current === item.value }" @click="handleClickTime(item)" :key="item.value">{{ item.name }}</p>
              </div>
              <bar-chart
                :showLegend="true"
                :chartData="newchartData"
                :legendConfig="newlegendConfig"
                :colors="colors"
                :barMaxWidth="0.2"
                :pageLen="6"
                :showYLabel="true"
                unit="%"
                :customTooltip="customTooltip"
              >
              </bar-chart>
            </template>
          </wrap-title>
        </div>
      </div>
      <CaseStatics v-if="tab == 'jingan-code'"></CaseStatics>
      <swiper v-if="tab != 'jingan-code'" :options="swiperOptions">
        <swiper-slide>
          <div class="wall-panel">
            <m-row class="tile-row" gutter="20px" v-for="(chunk , i) in otherItems" :key="`other-chunk-${i}`">
              <MColumn span="5" v-for="(item, index) in chunk" :key="`other-${index}`">
                <tile1 v-if="item.key === '随手拍'" :item="sspData" class="block clickAble" @click="handleClick(sspData)"></tile1>
                <tile1 v-else-if="item.key === '12345热线'" :item="hotlineData" class="block clickAble" @click="handleClick(hotlineData)"></tile1>
                <tile1 v-else :item="item" class="block clickAble" @click="handleClick(item)"></tile1>
              </MColumn>
            </m-row>
          </div>
        </swiper-slide>
        <swiper-slide>
          <div class="wall-panel">
            <m-row class="tile-row" gutter="20px">
              <MColumn width="20%" v-for="(chunk, index) in secondItems" :key="`other-${index}`">
                <tile1 :item="chunk" class="block clickAble" @click="handleClick(chunk)"></tile1>
              </MColumn>
            </m-row>
          </div>
        </swiper-slide>
        <div class="swiper-pagination"  slot="pagination"></div>
      </swiper>
  </div>
</template>
<script>
import WrapTitle from '@/components/MTitle/WrapTitle'
import MRow from '@/components/Layout/MRow'
import MColumn from '@/components/Layout/MColumn'
import LineChart from '@/components/Charts/Line/ChartLine'
import BarChart from '@/components/Charts/Bar/ChartBar'
import Tile from '@/components/Tile/index2'
import Tile1 from '@/components/Tile/index1'
import MTabs from "@/components/MTabs";
import NumStatics from "./numStatics";
import CodeStatics from "./codeStatics";
import CaseStatics from "./caseStatics";
import { getDate, generateKeyValuePair } from '@/utils/tools'
import 'swiper/dist/css/swiper.css'
import { swiper, swiperSlide } from 'vue-awesome-swiper'

import Vue from 'vue'
import { Row, Col } from 'element-ui'
import { getSspListData, getHotlineData, getDuchaDuban, getDuchaData, getDubanData, getDubanTrend, getDuChaTrend } from './api.js'
import dayjs from 'dayjs'
Vue.use(Row)
Vue.use(Col)

export default {
  name: 'TodayFocusOverview',
  components: { WrapTitle, MRow, MColumn, LineChart, Tile, Tile1, swiperSlide, swiper, MTabs, BarChart, NumStatics, CodeStatics, CaseStatics },
  props: {
    dataset: {
      type: Object,
      default () {
        return {
          trendData: [],
          stats: {},
          gridData: {
            today: '-',
            yesterday: '-'
          },
          itemsData: {}
        }
      }
    }
  },
  computed: {
    otherItems () {
      let items = [...this.items].map(item => {
        return {
          ...item,
          ...(this.dataset.stats[item.key] || this.dataset.itemsData[item.key] || {})
        }
      })
      const length = items.length
      if (length < this.chunkSize) {
        return items
      }
      let chunks = []
      for (let i = 0; i < length; i += this.chunkSize) {
        chunks.push(items.splice(0, this.chunkSize))
      }
      console.log(chunks, 'chunks')
      return chunks
    },
    pubilcItems () {
      const grid = this.dataset.gridData
      let gridRate = grid.yesterday ? Math.floor(((grid.today - grid.yesterday) / grid.yesterday) * 10000) / 100 : '-'
      let total = 0
      this.otherItems.forEach(item => {
        item.forEach(data => {
          if (isNaN(Number(data.value || data.count))) {
            total = total + 0
          } else {
            total = total + Number(data.value || data.count)
          }
        })
      })
      return [
        {
          label: '一网统管',
          count: total,
          rate: this.dataset.itemsData['一网通办'] && this.dataset.itemsData['一网统管'] ? this.dataset.itemsData['一网统管'].rate : '-',
          color: gridRate > 0 ? '#4FCFD5' : (gridRate < 0 ? '#E64C3B' : '#2E9BCF')
        },
        {
          icon: 'icon-biaoti',
          label: '一网通办',
          count: this.dataset.itemsData['一网通办'] ? this.dataset.itemsData['一网通办'].value : '-',
          rate: this.dataset.itemsData['一网通办'] ? this.dataset.itemsData['一网通办'].rate : '-',
          color: '#2E9BCF'
        }
      ]
    },
    chartData () {
      const grid = generateKeyValuePair('time_fm', 'count', this.dataset.trendData['网格'])
      const zhongzhi = generateKeyValuePair('time_fm', 'count', this.dataset.trendData['综治'])
      const shichang = generateKeyValuePair('time_fm', 'count', this.dataset.trendData['市场监管'])
      const feijingqing = generateKeyValuePair('time_fm', 'count', this.dataset.trendData['110非警情'])

      return [
        ['时间', '网格', '综治', '市场监管', '110非警情'],
        ...getDate(7, { dataConfig: { dateFmt: 'yyyy-MM-dd' }, containToday: true }).map((v, index) => {
          let time = v[0]
          return [
            this.$f.formatterDate(v[0], 'MM.dd'),
            grid[time] || 0,
            zhongzhi[time] || 0,
            shichang[time] || 0,
            feijingqing[time] || 0
          ]
        })
      ]
    },
  },
  data () {
    return {
      newchartData: [],
      tab: 'case',
      tabs: Object.freeze([
        { label: "案件趋势", value: "case" },
        { label: "特定案件分析", value: "special" },
        { label: "静安码", value: "jingan-code" }
      ]),
      times: [
        { name: '日', value: 'day' },
        { name: '周', value: 'week' },
        { name: '月', value: 'month' }
      ],
      current: 'month',
      timeObj: {
        day: {
          start: dayjs().startOf('day').unix(),
          end: dayjs().unix()
        },
        week: {
          start: dayjs().subtract(7, 'day').unix(),
          end: dayjs().unix()
        },
        month: {
          start: dayjs().subtract(30, 'day').unix(),
          end: dayjs().unix()
        }
      },
      swiperOptions: {
        autoHeight: true,
        pagination: {
          el: '.swiper-pagination'
        }
      },
      hotlineData: {
        label: '12345热线',
        count: '-',
        key: '12345热线',
        rate: '-',
        unit: '件'
      },
      sspData: {
        label: '随手拍',
        count: '-',
        key: '随手拍',
        rate: '-',
        unit: '件'
      },
      legendConfig: {
        icon: 'rect',
        itemWidth: 20,
        itemHeight: 6,
        top: 0,
        right: 250
      },
      newlegendConfig: {
        icon: 'rect',
        itemWidth: 20,
        itemHeight: 6,
      },
      secondItems: [
        {
          label: '矛盾纠纷',
          count: '-',
          key: '矛盾纠纷',
          rate: '-',
          unit: '件'
        },
        {
          label: '重点案件',
          count: '-',
          key: '重点案件',
          rate: '-',
          unit: '件'
        },
        {
          label: '热点案件',
          count: '-',
          key: '热点案件',
          rate: '-',
          unit: '件'
        }
      ],
      items: [
        {
          label: '12345热线',
          count: '-',
          key: '12345热线',
          rate: '-',
          unit: '件'
        },
        {
          label: '110',
          count: '-',
          key: '110',
          rate: '-',
          unit: '件'
        },
        {
          label: '119',
          count: '-',
          key: '119',
          rate: '-',
          unit: '件'
        },
        {
          label: '120',
          count: '-',
          key: '120',
          rate: '-',
          unit: '件'
        },
        {
          label: '962121',
          count: '-',
          key: '962121',
          rate: '-',
          unit: '件'
        },
        {
          label: '网格巡查',
          count: '-',
          key: '网格',
          rate: '-',
          unit: '件'
        },
        {
          label: '市场监管',
          count: '-',
          key: '市场监管',
          rate: '-',
          unit: '件'
        },
        {
          label: '110非警情',
          count: '-',
          key: '110非警情',
          rate: '-',
          unit: '件'
        },
        {
          label: '综治',
          count: '-',
          key: '综治',
          rate: '-',
          unit: '件'
        },
        {
          label: '随手拍',
          count: '-',
          key: '随手拍',
          rate: '-',
          unit: '件'
        }
      ],
      chunkSize: 5,
      colors: ['#1ABC9C', '#679DF4', '#F96F4F', '#BE6CCC', '#D0021B'],
      customTooltip: {
        formatter: function (params) {
          return `<div>
            <p>${params[0].axisValueLabel}</p>
            <p style="padding: 5px 0;"><span style="display: inline-block; border-radius: 50%; background-color: #1ABC9C;width: 20px;height: 20px"></span> ${params[0].seriesName}: ${params[0].value[1]}%</p>
            <p style="padding: 5px 0;"><span style="display: inline-block; border-radius: 50%; background-color: #679DF4;width: 20px;height: 20px"></span> ${params[1].seriesName}: ${params[0].value[2]}%</p>
            <p style="padding: 5px 0;"><span style="display: inline-block; border-radius: 50%; background-color: #F96F4F;width: 20px;height: 20px"></span> ${params[2].seriesName}: ${params[0].value[3]}%</p>
          </div>`
        }
      }
    }
  },
  methods: {
    handleClickTime(item) {
      this.current = item.value
      this.getSpecialTrend()
    },
    getSpecialTrend() {
      let type = this.current === 'day' ? 'hour' : 'day'
      let range = this.timeObj[this.current]
      getDubanTrend({
        filter: `openTS=${range.start}~${range.end}`
      }).then(res => {
        let result = res.messages || []
        getDuChaTrend({
          filter: `openTS=${range.start}~${range.end}`
        }).then(response => {
          let duchaList = response.data.messages.info || []
          this.newchartData = [
            ['时间', '发现率', '解决率', '结案率'],
            ...result.map((item, index) => {
              let ducha = duchaList.filter(data => data.chs_superviseStreetName === item.town)[0]
              return [item.town, ducha.first_discover_rate * 100, item.solve_rate, item.fnish_rate]
            })
          ]
        })
      })
    },
    getData () {
      this.getSpecialTrend()
      getDuchaDuban().then(res => {
        let result = res.data || {}
        this.secondItems[1].count = result.dc_today
        this.secondItems[1].rate = result.dc_yesterday ? Math.floor(((result.dc_today - result.dc_yesterday) / result.dc_yesterday) * 10000) / 100 : '-'
        this.secondItems[2].count = result.db_today
        this.secondItems[2].rate = result.db_yesterday ? Math.floor(((result.db_today - result.db_yesterday) / result.db_yesterday) * 10000) / 100 : '-'
      })
      getSspListData().then(res => {
        let result = res.data || {}
        let rate = result.yesterday ? Math.floor(((result.today - result.yesterday) / result.yesterday) * 10000) / 100 : '-'
        this.sspData = {
          label: '随手拍',
          count: result.today || '-',
          key: '随手拍',
          rate,
          unit: '件'
        }
      })
      getHotlineData().then(res => {
        let result = res.data || {}
        let rate = result.yesterday ? Math.floor(((result.today - result.yesterday) / result.yesterday) * 10000) / 100 : '-'
        this.hotlineData = {
          label: '12345热线',
          count: result.today || '-',
          key: '12345热线',
          rate,
          unit: '件'
        }
      })
    },
    handleClick (item) {
      let component = 'dashboard'
      if (['公共安全案件数', '公共管理案件数', '公共服务案件数'].indexOf(item.label) === -1) {
        component = 'list'
      }
      this.$emit('click', component, item)
    }
  },
  created () {
    this.$timer.register(this.getData, this)
  }
}
</script>

<style type="text/css">
.swiper-container-horizontal > .swiper-pagination-bullets {
  bottom: -0.05rem;
}
.swiper-pagination-bullet {
  width: 0.2rem;
  height: 0.2rem;
}
</style>
<style lang="scss" scoped>
.overview{
  width: 100%;
  height: 100%;

  .three-public{
    .wall{
      .block{
        height: 2.1rem;
      }
    }
    .chart{
      padding: 0.1rem 0;
      height: 4rem;
      position: relative;
      .times-tab {
        position: absolute;
        display: flex;
        align-items: center;
        top: 0.2rem;
        right: 0.1rem;
        color: #92B9F7;
        & > p {
          font-size: 0.36rem;
          cursor: pointer;
          & + p {
            margin-left: 0.2rem;
          }
          &.active {
            color: #FFFFFF;
          }
        }
      }
    }
  }
  .wall-panel{
    height: 4.3rem;
    .tile-row{
      padding: 0.25rem 0;
    }
    .el-col, .m-column {
      border-right: 1px dashed #4E78A4;
      &:last-child{
        border: 0;
      }
    }
  }
}
</style>
