<template>
  <wrap-title class="gradient-bg" icon="icon-chengshizhili" txt="城市治理">
    <level-title :level="2" icon="icon-biaoti" txt="城市建设"></level-title>
    <m-row>
      <m-column v-for="(item, index) in chengshijiansheList" :key="`js-${index}`" width="33.3%">
        <overview-item2
          :name="item.field_name"
          :nameUnit="''"
          :value="item.numerical_value || '-'"
          :increase="item.growth_ratio || null"
          customClass="style6">
        </overview-item2>
      </m-column>
      <!-- <m-column v-for="(item, index) in jsItems" :key="`js-${index}`" :width="item.width">
        <overview-item2
          :name="`${item.key}`"
          :nameUnit="itemsData[item.key] ? itemsData[item.key].unit : ''"
          :value="itemsData[item.key]?itemsData[item.key].value:'-'"
          :increase="itemsData[item.key]?itemsData[item.key].rate: null"
          customClass="style6">
        </overview-item2>
      </m-column> -->
    </m-row>
    <level-title :level="2" icon="icon-biaoti" txt="城市发展"></level-title>
    <div>
      <m-row>
        <m-column v-for="(item, index) in chengshifazhanList" :key="`fz-${index}`" :width="item.width">
          <overview-item2
            :name="item.field_name"
            :nameUnit="''"
            :value="item.numerical_value || '-'"
            :showIncrease="false"
            customClass="style6">
          </overview-item2>
          <div>
            <span>累计: </span>
            <span>{{ getLeiji(item.field_name) }}</span>
          </div>
        </m-column>
      </m-row>
      <m-row style="margin-top:20px;">
        <m-column width="50%">
          <overview-item2
            :name="gudinzichantouziObj.field_name"
            :nameUnit="''"
            :value="gudinzichantouziObj.numerical_value || '-'"
            :increase="gudinzichantouziObj.growth_ratio || null"
            customClass="style6">
          </overview-item2>
        </m-column>
        <m-column width="50%">
          <chart-bar :chartData="chartData" :colors="colors" labelColor="#D1C9C4"></chart-bar>
        </m-column>
      </m-row>
    </div>
    <level-title :level="2" icon="icon-biaoti">
      <m-tabs class="levelt2-select" ref="jiaotong" v-model="tab1" :tabs="tabs1" @change="changeTabs"></m-tabs>
    </level-title>
    <m-tabs-body :tab="tab1">
      <m-tabs-body-item name="城市交通">
        <level-title :level="4" txt="拥堵排行">
        </level-title>
        <!-- <ul class="list">
          <li class="list-item" v-for="(item, index) in dataset[tab]" :key="item.primeID">
            <span class="list-item__id">{{ index + 1 }}</span>
            <div class="list-item__infor">
              <p>{{ item.road }}</p>
              <p>指数：{{ item.score }}</p>
            </div>
            <p class="list-item__status" :style="{ backgroundColor: item.color + '66', borderColor: item.color }">
              <i class="iconfont" :class="item.icon"></i>
              {{ item.text }}
            </p>
          </li>
        </ul> -->
        <m-list
          :headers="headers"
          :dataset="tableData"
        />
      </m-tabs-body-item>
      <m-tabs-body-item name="公共停车场">
        <ParkLot></ParkLot>
      </m-tabs-body-item>
      <m-tabs-body-item name="慢行交通">
        <Bike></Bike>
      </m-tabs-body-item>
      <m-tabs-body-item name="公共交通">
        <PublicTransport></PublicTransport>
      </m-tabs-body-item>
    </m-tabs-body>
  </wrap-title>
</template>
<script>
import WrapTitle from '@/components/MTitle/WrapTitle'
import LevelTitle from '@/components/MTitle/LevelTitle'
import MRow from '@/components/Layout/MRow'
import MColumn from '@/components/Layout/MColumn'
import OverviewItem2 from '@/components/OverviewItem/index2'
import MTabs from '@/components/MTabs'
import ChartBar from '@/components/Charts/BarY/ChartBarY'
import MTabsBody from '@/components/MTabsBody/MTabsBody'
import MTabsBodyItem from '@/components/MTabsBody/MTabsBodyItem'
import MList from '@/components/MList/index.vue'
import ParkLot from './parkLot.vue'
import PublicTransport from './publicTransport.vue'
import Bike from './bike.vue'
import { getData, getTrafficData } from './api'
import requestApi from "@/http/requestApi.js"

export default {
  name: 'UrbanGovernance',
  components: {
    WrapTitle,
    LevelTitle,
    MRow,
    MColumn,
    OverviewItem2,
    MTabs,
    ChartBar,
    MTabsBody,
    MTabsBodyItem,
    ParkLot,
    PublicTransport,
    Bike,
    MList
  },
  computed: {
    chartData () {
      let list = this.lowcodeList.filter(item => {
        return item.field_name === '办公' || item.field_name === '商业' || item.field_name === '住宅' || item.field_name === '基建'
      })
      list = list.sort((a, b) => {
        return Number(a.sort) - Number(b.sort)
      })

      let list2 = list.map(item => {
        return [item.field_name, parseFloat(item.numerical_value)]
      })
      return [
        ['项目', '数值'],
        ...list2
      ]
      /* let tmpArr = this.dataset.items.filter(item => {
        return item.tags === '固定资产图表'
      }).map(item => {
        return [item.name, item.value]
      })

      return [
        ['项目', '数值'],
        ...tmpArr
      ] */
    }
  },
  data () {
    return {
      lowcodeList: [],
      chengshijiansheList: [],
      chengshifazhanList: [],
      chengshifazhanAllList: [],
      gudinzichantouziObj: {},
      options: Object.freeze([
        { label: '今日', value: 'today' },
        { label: '本周', value: 'currentWeek' },
        { label: '本月', value: 'currentMonth' }
      ]),
      tab1: '城市交通',
      tabs1: Object.freeze([
        { label: '城市交通', value: '城市交通' },
        { label: '公共停车场', value: '公共停车场' },
        { label: '慢行交通', value: '慢行交通' },
        { label: '公共交通', value: '公共交通' }
      ]),
      tabs: Object.freeze([
        { label: '快速路', value: 'expressway' },
        { label: '地面道路', value: 'groud_road' }
      ]),
      option: 'today',
      tab: 'expressway',
      dataset: {
        expressway: [],
        groud_road: [],
        statistics: {},
        items: []
      },
      jsItems: [
        {
          key: '绿地建设',
          width: '33.3%'
        },
        {
          key: '住宅施工面积',
          width: '33.3%'
        },
        {
          key: '商品房销售面积',
          width: '33.3%'
        }
      ],
      fzItems: [
        {
          key: 'AQI优良',
          width: '50%'
        },
        {
          key: '动迁及征收',
          width: '50%'
        }
      ],
      itemsData: {},
      colors: ['#4FCFD5'],
      headers: [
        {
          label: '排名',
          prop: 'id',
          width: '13%',
          align: 'center'
        },
        {
          label: '区域名称',
          prop: 'name',
          width: '26%',
          align: 'center'
        },
        {
          label: '当前指数',
          prop: 'curIndex',
          width: '24%',
          align: 'center'
        },
        {
          label: '参考指数',
          prop: 'refIndex',
          width: '25%',
          color: 'rgb(57, 148, 227)',
          align: 'center'
        },
        {
          label: '极值',
          width: '12%',
          prop: 'maxIndex',
          color: 'rgb(254, 22, 25)',
          align: 'center'
        }
      ],
      tableData: []
    }
  },
  created () {
    this.$timer.register(this.getData, this)
  },
  mounted () {
    this.$refs.jiaotong.stopTimer()
  },
  methods: {
    getLeiji(type) {
      let value = 0
      if (type.indexOf('动迁及征收') !== -1) {
        let list = this.chengshifazhanAllList.filter(item => {
          return item.field_name.indexOf('动迁及征收') !== -1 && item.field_name.indexOf('累计') !== -1
        })
        value = list[0] && list[0].numerical_value
      }
      if (type.indexOf('AQI') !== -1) {
        let list = this.chengshifazhanAllList.filter(item => {
          return item.field_name.indexOf('AQI') !== -1 && item.field_name.indexOf('累计') !== -1
        })
        value = list[0] && list[0].numerical_value
      }
      return value || ''
    },
    changeTabs (val) {
      console.log(val)
      if (val === '城市交通') {
        this.$_mapProxy.getMap()._closePopup()
      }
      if (val === '公共停车场') {
        this.$_mapProxy.getMap()._openPopup('ParkLotPopup', {})
      }
      if (val === '公共交通') {
        this.$_mapProxy.getMap()._openPopup('PubliceTransportPopup', {})
      }
      if (val === '慢行交通') {
        this.$_mapProxy.getMap()._openPopup('BikePopup', {})
      }
    },
    async getData () {
      const resLowCode = await requestApi({
        params: {
          table: 'governance_digitization_new'
        }
      })
      let resList = (resLowCode && resLowCode.data) || []
      this.lowcodeList = (resLowCode && resLowCode.data) || []
      let list1 = resList.filter(item => {return item.module_name === '城市建设'})
      list1 = list1.sort((a, b) => {
        return Number(a.sort) - Number(b.sort)
      })
      this.chengshijiansheList = list1
      this.chengshifazhanAllList = resList.filter(item => {return item.module_name === '城市发展'})
      let list2 = resList.filter(item => {return item.module_name === '城市发展' &&
      (item.field_name.indexOf('AQI') !== -1 || item.field_name.indexOf('动迁及征收') !== -1) &&
      item.field_name.indexOf('累计') === -1})
      list2 = list2.sort((a, b) => {
        return Number(a.sort) - Number(b.sort)
      })
      this.chengshifazhanList = list2
      let list3 = resList.filter(item => {return item.field_name.indexOf('固定资产投资') !== -1})
      this.gudinzichantouziObj = list3[0] || {}
      const [res, trafficRes] = await Promise.all([getData(), getTrafficData()])
      if (res.db && res.db[0]) {
        this.dataset.statistics = res.db[0]
      }
      let tmp = {}
      this.dataset.items = res.items || [];
      (res.items || []).map(item => {
        tmp[item.name] = item
      })
      this.itemsData = tmp

      this.tableData = trafficRes.map((item, index) => ({
        ...item,
        id: index + 1
      }))
    },
    convertScore (score) {
      const res = { icon: '', color: '', text: '' }
      if (score >= 70) {
        res.icon = 'icon-qing-ditu'
        res.color = '#F23470'
        res.text = '堵塞'
      } else if (score >= 50) {
        res.icon = 'icon-fengxianshixiang'
        res.color = '#F96F4F'
        res.text = '拥挤'
      } else if (score >= 30) {
        res.icon = 'icon-jiaotongchang'
        res.color = '#FCBF51'
        res.text = '较通畅'
      } else {
        res.icon = 'icon-changtong'
        res.color = '#1ABC9C'
        res.text = '通畅'
      }
      return res
    }
  }
}
</script>
<style lang="scss" scoped>
.m-tabs-body {
  flex: 1;
  overflow: auto;
}
.levelt2-select {
  &.m-tabs {
    color: #4E78A4;
  }
}
.road-select {
  &.m-tabs {
    color: #4E78A4;
  }
  /deep/ {
    .m-tabs__item.is-active {
      color: $titleLevel2;
    }
  }
}
.list {
  overflow-y: auto;
}
.list-item {
  display: flex;
  font-size: 0.24rem;
  color: #fff;
}
.list-item__id {
  width: 0.4rem;
  height: 0.4rem;
  border: 0.02rem solid #2E9BCF;
  text-align: center;
  line-height: 0.36rem;
}
.list-item__infor {
  width: 0;
  flex: 1;
  margin: 0 0.1rem;
  line-height: 1.5;
  > p:first-child {
    font-size: 0.28rem;
  }
}
.list-item__status {
  width: 2rem;
  height: 0.44rem;
  line-height: 0.4rem;
  font-size: 0.24rem;
  color: #fff;
  text-align: center;
  border: 0.02rem solid transparent;
  border-radius: 0.22rem;
}
</style>
