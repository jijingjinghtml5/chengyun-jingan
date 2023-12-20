<template>
  <wrap-title class="gradient-bg" icon="icon-dihezhongdianquyu">
    <m-tabs slot="level-title" v-model="firstTab" ref="mainTab" :tabs="tabs" @change="handleChangeForTabItem" :autoChange="false"></m-tabs>
    <m-tabs-body :tab="secondTab">
      <m-tabs-body-item name="today" class="today-overview" @mouseenter.native="handleMouse('mainTab', 'enter')" @mouseleave.native="handleMouse('mainTab', 'leave')">
        <m-row>
          <m-column >
            <weather-item v-bind="todayItems[0]" customClass="style2" :dataset="itemsData['气象预警']" :qxzs="dataset.qxzs && dataset.qxzs.value || '-'"></weather-item>
          </m-column>
          <m-column  v-for="item in todayItems.filter((item,index)=>{return index>0})" :key="item.name">
            <overview-item v-bind="item" customClass="style2" :dataset="itemsData[item.name] || dataset[item.prop]"></overview-item>
          </m-column>
        </m-row>
      </m-tabs-body-item>
      <m-tabs-body-item name="district">
        <m-row>
          <m-column  v-for="item in districtItems" :key="item.name">
            <overview-item
              v-bind="item"
              :nameUnit="itemsData[item.name] ? `(${itemsData[item.name].unit})` : ''"
              :dataset="itemsData[item.name] || dataset[item.prop]"
              :showIncrease="false"
             ></overview-item>
          </m-column>
        </m-row>
      </m-tabs-body-item>
      <m-tabs-body-item v-for="item in todayItems" :key="item.prop" :name="item.prop" class="today-overview">
        {{item}}
        <overview-item v-bind="item" customClass="style2" :dataset="dataset.prop" @click.native="handleClickForCloseLayer(item)"></overview-item>
      </m-tabs-body-item>
    </m-tabs-body>
  </wrap-title>
</template>
<script>
import WrapTitle from '@/components/MTitle/WrapTitle'
import MTabs from '@/components/MTabs'
import MRow from '@/components/Layout/MRow'
import MColumn from '@/components/Layout/MColumn'
import OverviewItem from '@/components/OverviewItem/index'
import WeatherItem from './weather'
import MTabsBody from '@/components/MTabsBody/MTabsBody'
import MTabsBodyItem from '@/components/MTabsBody/MTabsBodyItem'
import { getData, getCount } from './api'
export default {
  name: 'OverView',
  components: {
    WrapTitle,
    MTabs,
    MRow,
    MColumn,
    OverviewItem,
    WeatherItem,
    MTabsBody,
    MTabsBodyItem
  },
  inheritAttrs: false,
  data () {
    return {
      tabs: Object.freeze([
        { label: '今日概况', value: 'today' },
        { label: '全区概览', value: 'district' }
      ]),
      todayItems: Object.freeze([
        { icon: 'icon-tianqi', name: '气象预警', showIncrease: false, valueColor: '#6CCB73', prop: 'qxzs' },
        { icon: 'icon-huoqing', name: '火险指数', showIncrease: false, prop: 'hxzs' },
        { icon: 'icon-jiaotongyongdu1', name: '交通拥堵指数', showIncrease: false, prop: 'jtydzs' },
        { icon: 'icon-yuqing', name: '舆情热点数', showIncrease: false, prop: 'yqrds' },
        { icon: 'icon-huodong', name: '重大活动', showIncrease: false, prop: 'zdhd' }
      ]),
      districtItems: Object.freeze([
        { icon: 'icon-renkouku', name: '实有人口', nameUnit: '（万人）', showIncrease: false, prop: 'syrk', customClass: 'style2' },
        { icon: 'icon-shichang', name: '实有法人', nameUnit: '（万个）', showIncrease: false, prop: 'syfr', customClass: 'style2' },
        { icon: 'icon-GDP', name: 'GDP', nameUnit: '（万元）', prop: 'gdp', customClass: 'style2' },
        { icon: 'icon-chuzu', name: '企业总产值', nameUnit: '（万元）', prop: 'qyzcz', customClass: 'style2' },
        { icon: 'icon-shichang', name: '税收总收入', nameUnit: '（万元）', prop: 'sszsr', customClass: 'style2' }
      ]),
      firstTab: 'today',
      secondTab: 'today',
      dataset: {
        qxzs: {
          value: '-'
        },
        hxzs: {
          value: '-'
        },
        jtydzs: {
          value: '-'
        },
        zngzyjs: {
          value: '-'
        },
        yqrds: {
          value: '-'
        },
        zdhds: {
          value: '-'
        },
        syrk: { value: '-' },
        syfr: { value: '-' },
        gdp: { value: '-' },
        qyzcz: { value: '-' },
        sszsr: { value: '-' }
      },
      itemsData: {}
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
    handleClickForOpenLayer (item) {
      this.secondTab = item.prop
      const layerName = `${item.prop}Layer`
      this[layerName].setParameters({
        'data': {
          'content': [{ 'x': -1733, 'y': -917 }],
          'parsegeometry': 'function(item){return {x:item.x, y:item.y}}'
        }
      }).open()
    },
    handleClickForCloseLayer (item) {
      this.secondTab = this.tabs[0].value
      this[`${item.prop}Layer`].close()
    },
    handleChangeForTabItem (val) {
      this.secondTab = val
    },
    registerLayersForTodayOverview () {
      this.todayItems.forEach(item => {
        const key = `${item.prop}Layer`
        this[key] = this.$_mapProxy
          .registerLayer(key, item.name.slice(0, 4) + '图层')
          .setParameters({
            'name': key,
            'type': 'point',
            'mode': 'replace',
            'legendVisible': false,
            'popupEnabled': false,
            'isFiltered': true,
            'isLocate': false,
            'renderer': {
              type: 'simple',
              symbol: {
                type: 'simple-marker',
                size: 20,
                color: [0, 255, 244],
                outline: {
                  color: '#ffffff',
                  width: '1px'
                }
              }
            }
          })
      })
    },
    async getData () {
      const [{ tag }, res] = await Promise.all([getCount(), getData()])
      this.dataset.yqrds = {
        value: tag.num
      }
      if (res.api) {
        this.dataset.jtydzs = {
          value: Math.round((res.api.traffic_index || 0) * 100) / 100
        }
        this.dataset.zngzyj = {
          value: Math.round(res.api.device_online_percent * 100) / 100
        }
      }
      if (res.items) {
        let tmp = {};
        (res.items || []).map(item => {
          if (item.name === '舆情热点数') {
            return
          }
          tmp[item.name] = item
        })
        this.itemsData = tmp
      }
      if (res.db && res.db[0]) {
        this.dataset.qxzs = { value: res.db[0].qxzs }
        this.dataset.hxzs = { value: res.db[0].hxzs }
        this.dataset.zdhd = { value: res.db[0].zdhd }
      }

      if (res.district && res.district[0]) {
        this.dataset.syrk.value = res.district[0].syrk
        this.dataset.syfr.value = res.district[0].syfr
        this.dataset.gdp.value = res.district[0].gdp
        this.dataset.qyzcz.value = res.district[0].qyzcz
        this.dataset.sszsr.value = res.district[0].sszsr
      }
    }
  },
  created () {
    this.registerLayersForTodayOverview()
    this.$timer.register(this.getData, this)
  }
}
</script>
<style lang="scss" scoped>
.m-tabs-body__item {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.today-overview {
  .overview-item {
    cursor: pointer;
    height: 100%;
    align-items: flex-start;
    /deep/ {
      .overview-item__icon {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
      }
      // .overview-item__content {
      //   height: 100%;
      //   display: flex;
      //   flex-direction: column;
      // }
      // .overview-item__value {
      //   flex: 1;
      //   display: flex;
      //   flex-direction: column;
      //   justify-content: center;
      // }
    }
  }
}
</style>
