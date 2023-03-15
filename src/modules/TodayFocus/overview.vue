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
            <line-chart :showLegend="true" :legendConfig="legendConfig" :chartData="chartData" :colors="colors" :showYLabel="true" :pageLen="24" :isGradient="true" :gradientBySelf="true">
            </line-chart>
          </wrap-title>
        </div>
      </div>
      <swiper :options="swiperOptions">
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
            <m-row class="tile-row" gutter="20px" v-for="(chunk , i) in secondItems" :key="`second-chunk-${i}`">
                <MColumn width="20%" :key="`other-${i}`">
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
import Tile from '@/components/Tile/index2'
import Tile1 from '@/components/Tile/index1'

import { getDate, generateKeyValuePair } from '@/utils/tools'
import 'swiper/dist/css/swiper.css'
import { swiper, swiperSlide } from 'vue-awesome-swiper'

import Vue from 'vue'
import { Row, Col } from 'element-ui'
import { getSspListData, getHotlineData } from './api.js'
Vue.use(Row)
Vue.use(Col)

export default {
  name: 'TodayFocusOverview',
  components: { WrapTitle, MRow, MColumn, LineChart, Tile, Tile1, swiperSlide, swiper },
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
          rate: this.dataset.itemsData['一网通办'] ? this.dataset.itemsData['一网统管'].rate : '-',
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
    }
  },
  data () {
    return {
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
      secondItems: [
        {
          label: '矛盾纠纷',
          count: '-',
          key: '矛盾纠纷',
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
      colors: ['#1ABC9C', '#679DF4', '#F96F4F', '#BE6CCC', '#D0021B']
    }
  },

  methods: {
    getData () {
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
