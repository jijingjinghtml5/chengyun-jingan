<template>
  <wrap-title class="gradient-bg" icon="icon-shehuizhili" txt="社会治理">
    <level-title :level="2" icon="icon-biaoti">
      <m-tabs class="levelt2-select" v-model="tab" ref="shehui" :tabs="tabs"></m-tabs>
    </level-title>
    <m-tabs-body :tab="tab">
      <m-tabs-body-item name="社会治安" @mouseenter.native="handleMouse('shehui', 'enter')" @mouseleave.native="handleMouse('shehui', 'leave')">
        <m-row>
          <m-column width="50%" v-for="(item, index) in shehuizhianList" :key="index">
            <overview-item
              :name="item.field_name"
              :value="item.numerical_value"
              :increase="item.growth_ratio"
              customClass="style6">
            </overview-item>
          </m-column>
        </m-row>
      </m-tabs-body-item>
      <m-tabs-body-item name="社会救助" @mouseenter.native="handleMouse('shehui', 'enter')" @mouseleave.native="handleMouse('shehui', 'leave')">
        <m-row>
          <m-column :width="index >= 2 ? '33.33%' : '50%'" v-for="(item, index) in shehuijiuzhuList" :key="index">
            <overview-item
            :name="item.field_name"
            :value="item.numerical_value"
            :increase="item.growth_ratio"
            customClass="style6">
            </overview-item>
          </m-column>
        </m-row>
      </m-tabs-body-item>
      <m-tabs-body-item name="社会管理" @mouseenter.native="handleMouse('shehui', 'enter')" @mouseleave.native="handleMouse('shehui', 'leave')">
        <m-row>
          <m-column :width="index >= 2 ? '33.33%' : '50%'" v-for="(item, index) in shehuiguanliList" :key="index">
            <overview-item2
            :name="item.field_name"
            :value="item.numerical_value"
            :increase="item.growth_ratio"
            customClass="style6">
          </overview-item2>
          </m-column>
          <!-- <m-column v-for="(item, index) in shglItems" :key="`shgl-${index}`" :width="item.width">
            <overview-item2
              :name="`${item.key}`"
              :nameUnit="itemsData[item.key] ? itemsData[item.key].unit : ''"
              :value="itemsData[item.key]?itemsData[item.key].value:'-'"
              :increase="itemsData[item.key]?itemsData[item.key].rate: null"
              customClass="style6">
            </overview-item2>
          </m-column> -->
        </m-row>
      </m-tabs-body-item>
    </m-tabs-body>
    <level-title :level="2" icon="icon-biaoti" txt="民生民意"></level-title>
    <m-row>
      <m-column v-for="(item, index) in mingshengmingyiList" :key="index" width="50%">
        <overview-item
          :name="item.field_name"
          :value="item.numerical_value"
          :increase="item.growth_ratio"
          customClass="style6">
        </overview-item>
      </m-column>
    </m-row>
    <level-title :level="2" icon="icon-biaoti" txt="民生保障"></level-title>
    <chart-line class="in-flex" :chartData="dataset.chartData" :colors="colors" :showYLabel="true" :isGradient="true" :gradientBySelf="true" :showLegend="true" :legendConfig="legendConfig"></chart-line>
  </wrap-title>
</template>
<script>
import WrapTitle from '@/components/MTitle/WrapTitle'
import LevelTitle from '@/components/MTitle/LevelTitle'
import MRow from '@/components/Layout/MRow'
import MColumn from '@/components/Layout/MColumn'
import OverviewItem from '@/components/OverviewItem'
import OverviewItem2 from '@/components/OverviewItem/index2'
import MTabs from '@/components/MTabs'
import MTabsBody from '@/components/MTabsBody/MTabsBody'
import MTabsBodyItem from '@/components/MTabsBody/MTabsBodyItem'
import ChartLine from '@/components/Charts/Line/ChartLine'
import { getData, getItemData } from './api'
import requestApi from "@/http/requestApi.js"
export default {
  name: 'SocialGovernance',
  components: {
    WrapTitle,
    LevelTitle,
    MRow,
    MColumn,
    OverviewItem,
    OverviewItem2,
    MTabs,
    MTabsBody,
    MTabsBodyItem,
    ChartLine
  },
  inject: ['createFnForCalcRealPx'],
  data () {
    return {
      shehuizhianList: [],
      shehuijiuzhuList: [],
      shehuiguanliList: [],
      mingshengmingyiList: [],
      colors: Object.freeze(['#1ABC9C', '#679DF4', '#F96F4F', '#D0021B']),
      legendConfig: Object.freeze({
        top: 0,
        left: 'center',
        icon: 'line',
        textStyle: {
          color: '#D1C9C4',
          fontSize: this.createFnForCalcRealPx(0.24)
        }
      }),
      options: Object.freeze([
        { label: '本周', value: 'currentWeek' },
        { label: '本月', value: 'currentMonth' }
      ]),
      tabs: Object.freeze([
        { label: '社会治安', value: '社会治安' },
        { label: '社会救助', value: '社会救助' },
        { label: '社会管理', value: '社会管理' }
      ]),
      option: 'currentWeek',
      tab: '社会治安',
      dataset: {
        chartData: [
          ['民生保障', '肋条肉', '鸡蛋', '草鱼', '青菜']
        ]
      },
      shglItems: [
        {
          key: '食品安全监督检查',
          width: '50%'
        },
        {
          key: '生产安全事故',
          width: '50%'
        },
        {
          key: '劳动仲裁',
          width: '30%'
        },
        {
          key: '消费者投诉办结率',
          width: '35%'
        },
        {
          key: '质量投诉处理率',
          width: '35%'
        }
      ],
      itemsData: {} // 社会管理数据
    }
  },
  methods: {
    handleMouse (ref, mouse) {
      if (mouse === 'enter') {
        this.$refs[ref].stopTimer()
      } else {
        this.$refs[ref].startTimer()
      }
    },
    async getData () {
      const resLowCode = await requestApi({
        params: {
          table: 'digitization_of_life_new'
        }
      })
      let list1 = (resLowCode && resLowCode.data).filter(item => {
        return item.module_name === '社会治安'
      })
      this.shehuizhianList = list1.sort((a, b) => {
        return Number(a.sort) - Number(b.sort)
      })
      let list2 = (resLowCode && resLowCode.data).filter(item => {
        return item.module_name === '社会救助'
      })
      this.shehuijiuzhuList = list2.sort((a, b) => {
        return Number(a.sort) - Number(b.sort)
      })
      let list3 = (resLowCode && resLowCode.data).filter(item => {
        return item.module_name === '社会管理'
      })
      this.shehuiguanliList = list3.sort((a, b) => {
        return Number(a.sort) - Number(b.sort)
      })
      let list4 = (resLowCode && resLowCode.data).filter(item => {
        return item.module_name === '民生民意'
      })
      this.mingshengmingyiList = list4.sort((a, b) => {
        return Number(a.sort) - Number(b.sort)
      })
      const resChartData = await requestApi({
        params: {
          table: 'governance_cairoujia'
        }
      })
      let list5 = (resChartData && resChartData.data) || []
      list5 = list5.sort((a, b) => {
        return Number(a.sort) - Number(b.sort)
      })
      let chartObj = {}
      list5.forEach(item => {
        if (chartObj[item.field_name]) {
          chartObj[item.field_name][item.numerical_value] = item.growth_ratio
        } else {
          chartObj[item.field_name] = {}
          chartObj[item.field_name][item.numerical_value] = item.growth_ratio
        }
      })
      let chartList = [['民生保障', '肋条肉', '鸡蛋', '草鱼', '青菜']]
      for (let key in chartObj) {
        let obj = chartObj[key]
        chartList.push([key, obj['肋条肉'], obj['鸡蛋'], obj['草鱼'], obj['青菜']])
      }
      this.dataset.chartData = chartList
      /* getData().then(res => {
        if (res.statistics_db && res.statistics_db[0]) {
          this.dataset = {
            ...this.dataset,
            ...res.statistics_db[0]
          }
        }
        if (res.chart_db) {
          let dims = this.dataset.chartData.slice(0, 1)
          this.dataset.chartData = [
            ...dims,
            ...(res.chart_db.map(d => {
              return [d.time, parseFloat(d.meat_poultry_eggs_aquatic), parseFloat(d.vegetable_bean), parseFloat(d.rice_flour_grain_oil), parseFloat(d.fruits)]
            }))
          ]
        }
      })

      getItemData().then(res => {
        // console.log(">>>>>>>", res);
        let tmp = {};
        (res.shgl || []).map(item => {
          tmp[item.name] = item
        })
        this.itemsData = tmp
      }) */
    }
  },
  created () {
    this.$timer.register(this.getData, this)
  }
}
</script>
<style lang="scss" scoped>
.m-tabs-body {
  height: auto;
}
.levelt2-select {
  &.m-tabs {
    color: #4E78A4;
  }
}
</style>
