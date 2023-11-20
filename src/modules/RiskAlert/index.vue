<template>
<div class="container gradient-bg">
    <wrap-title txt="风险预警" :level="1" icon="icon-ditanshijiancha">
      <div class="list">
        <list-item v-for="(item, index) in items" :key="index" :item="item" :dataset="dataset" :itemsData="itemsData">
        </list-item>
      </div>
    </wrap-title>
</div>
</template>

<script>
import WrapTitle from '@/components/MTitle/WrapTitle'

import ListItem from './ListItem.vue'

import { getLowCodeData, getData, getCurrYdRoad, getMetroFlow, getHotlineData } from './api'

export default {
  name: 'RiskAlert',
  inject: ['createFnForCalcRealPx'],
  components: { WrapTitle, ListItem },
  data () {
    return {
      activeItem: null,
      onMap: false,
      activeIndex: -1,
      total: 12,
      dataset: {},
      items: [
        {
          icon: 'icon-yiqingfangkong',
          title: '热线<br/>预警预判',
          color: '#D0021B',
          update_time: '今日8:00',
          slot: 'yq',
          metrics: [
            {
              label: '一人多诉',
              count: 1,
              key: 'health_stats_total',
              color: '#F23470'
            },
            {
              label: '多人一诉',
              count: 2,
              key: 'health_stats_isolation_add',
              color: '#F96F4F'
            },
            {
              label: '群发',
              count: 2,
              key: 'health_stats_isolation_remove',
              color: '#6CCB73'
            },
            {
              label: '多发',
              count: 78,
              key: 'health_stats_home_add',
              color: '#F96F4F'
            },
            {
              label: '突发',
              count: 78,
              key: 'health_stats_home_tu',
              color: '#6CCB73'
            }
          ]
        },
        {
          icon: 'icon-jiaotongyongdu',
          title: '交通拥堵',
          color: '#F96F4F',
          update_time: '今日8:00',
          metrics: [
            {
              label: '道路拥堵(条)',
              count: 78,
              key: 'crowd_road_count',
              color: '#4FCFD5'
            },
            {
              label: '地铁大客流进',
              count: 80,
              color: '#F23470'
            },
            {
              label: '地铁大客流出',
              count: 80,
              color: '#F23470'
            },
            {
              label: '地铁故障',
              count: 2,
              color: '#F96F4F'
            }
          ]
        },
        {
          icon: 'icon-richangguanli',
          title: '风险事项',
          color: '#F23470',
          update_time: '今日8:00',
          metrics: [
            // {
            //   label: '24小时热线',
            //   count: 78,
            //   color: '#4FCFD5'
            // },
            {
              label: '舆情监测',
              count: 2,
              color: '#F23470'
            },
            {
              label: '物联感知',
              count: 78,
              key: 'iot_count',
              color: '#4FCFD5'
            },
            {
              label: '火车站滞留旅客',
              count: 0,
              color: '#F23470'
            }
          ]
        }
      ],
      itemsData: {}
    }
  },
  created () {
    this.$timer.register(this.getData, this)
  },
  methods: {
    getData () {
      getHotlineData().then(hotline => {
        console.log(hotline, 2222222222222222222)
        getData().then(res => {
          if (res.data) {
            this.dataset = res.data
            // this.dataset.health_stats_total = 0
            // this.dataset.health_stats_isolation_add = res.data.public_health_stats.isolation_observe_stats.today_add
            // this.dataset.health_stats_isolation_remove = res.data.public_health_stats.isolation_observe_stats.today_remove
            // this.dataset.health_stats_home_add = res.data.public_health_stats.home_observe_stats.today_add
            // this.dataset.health_stats_home_remove = res.data.public_health_stats.home_observe_stats.today_remove
            this.dataset.health_stats_total = hotline.duofa
            this.dataset.health_stats_isolation_add = hotline.qunfa
            this.dataset.health_stats_isolation_remove = hotline.qunfa
            this.dataset.health_stats_home_add = hotline.duofa
            this.dataset.health_stats_home_tu = hotline.tufa
            // hotline.map(item => {
            //   if (item.zhibiao == '一人多诉') {
            //     this.dataset.health_stats_total = item.number
            //   } else if (item.zhibiao == '多人一诉') {
            //     this.dataset.health_stats_isolation_add = item.number
            //   } else if (item.zhibiao == '群发') {
            //     this.dataset.health_stats_isolation_remove = item.number
            //   } else if (item.zhibiao == '多发') {
            //     this.dataset.health_stats_home_add = item.number
            //   } else if (item.zhibiao == '突发') {
            //     this.dataset.health_stats_home_tu = item.number
            //   }
            // })
          }

          let tmp = {}
          this.dataset.items = res.items || [];
          (res.items || []).map(item => {
            tmp[item.name] = item
          })
          this.itemsData = tmp
          getCurrYdRoad().then(res => {
            this.dataset['crowd_road_count'] = res.length
          })
          getMetroFlow().then(res => {
            console.log(res, 1111111111111111111)
            let tmp = JSON.parse(JSON.stringify(this.itemsData))
            tmp['地铁大客流进'] = {
              value: res.fintIn
            }
            tmp['地铁大客流出'] = {
              value: res.fintOut
            }
            this.itemsData = tmp
          })
          getLowCodeData('train_station_passenger').then(res => {
            const { data = [] } = res || {}
            this.itemsData['火车站滞留旅客'] = {
              value: (data[0] && data[0].number) || 0
            }
          })
        })
        
      })
    },
    showDetail (item) {
      this.activeItem = item
    },
    goBack () {
      this.activeItem = null
      this.onMap = false
      this.$_mapProxy.resetPointLocation()
    },
    getIcon (item) {
      let icon = 'iconfont '
      switch (item.type) {
        case '疫情防控':
          icon += 'icon-yiqingfangkong'
          break
        case '道路交通':
          icon += 'icon-jiaotongyongdu'
          break
        case '道路扬尘':
          icon += 'icon-yangchen1'
          break
        case '路面积水':
          icon += 'icon-daolujishui1'
          break
        case '人群聚集':
          icon += 'icon-renqunjuji'
          break
        default:
          icon += 'icon-richangguanli'
      }
      return icon
    },
    showOnMap (item) {
      if (this.onMap) {
        // 移除
        this.onMap = false
        this.$_mapProxy.resetPointLocation()
      } else {
        this.onMap = true
        this.$_mapProxy.pointLocation(item).setPopupConfig({
          component: 'RiskAlertPopup'
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.container{
  height: 100%;
  .title-right{
    color: #ffffff;
  }
  .list{
    margin-top:10px;
  }
}
</style>
