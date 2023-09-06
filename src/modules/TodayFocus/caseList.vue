<template>
<wrap-title :txt="`${item.label}列表`" :level="2" icon="icon-biaoti" class="dashboard">
    <div v-if="withDashboard" slot="right" class="title-right">
    <span @click="handleClick" class="clickAble">[案件概览]</span>
  </div>
  <m-list style="height: 920px;"
   :loading="loading"
    ref="caseList"
    :headers="headers"
    :dataset="tableData"
    @rowClick="handleRowClick"
  >
    <template  v-slot:state="{row}">
      <div :style="`color: ${getStatusColor(row.status)}`">
        <span class="iconfont " :class="getIcon(row.status)"></span>
        <span>{{row.status}}</span>
      </div>
    </template>
  </m-list>
</wrap-title>
</template>
<script>
import WrapTitle from '@/components/MTitle/WrapTitle'
import MList from '@/components/MList/index.vue'
import { CaseSteps } from '@/mapping'
import { getUrl } from '@/utils/tools'

import { getListData, getSspListData, getHotlineData, getDuchaData, getDubanData } from './api'

export default {
  name: 'TodayFocusList',
  components: {
    WrapTitle,
    MList
  },
  props: {
    item: {
      type: Object,
      default: () => {
        return {}
      }
    },
    withDashboard: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    'item.key': {
      handler (nv, old) {
        if (nv === old) return
        this.tableData = []
        this.$bus.$emit('map-close-model', {})
        this.$bus.$emit('map-full-extent', {})
        let filter = ''
        let timestamp = (new Date()).getTime()
        switch (nv) {
          case 'yellow':
            filter = `(openTS=-259200&args.chs_userId_36=ex.false&args.chs_userId_47=ex.false&args.chs_userId_24=ex.false&((closeTS=ex.false&allEndTS=lt.${timestamp})|(closeTS=ex.true&script="doc['data.closeTS'].value.getMillis()>doc['data.allEndTS'].value.getMillis()")))`
            break
          case 'red':
            filter = 'openTS=today&district_eventType.level_2=in.,重大危险源,路面塌陷,自来水管破裂,路面积水、污水冒溢、粪便冒溢,燃气管破裂,占用消防通道违章停车,人员非正常聚集,电梯困人,超期未整改,相关业务,违规装修、改建'
            break
          case '网格':
          case '市场监管':
          case '综治':
          case '110非警情':
            filter = `openTS=today&event_source=eq.${nv}`
            break

          default:
        }
        if (nv === '重点案件') {
          getDuchaData({
            filter: 'args.chs_eventSourceType=eq.区级督查%26area_district.areaName=eq.静安区%26openTS=today%26args.chs_superviseStreetName=ex.true%26args.invalid_result=neq.1',
            transform: 'messages[*].{id:data.eventID, eventName: args.eventName, address: data.address,  town: args.chs_superviseReportStreetName, openTS: data.openTS, status: data.exevt_status, lng: data.location.longitude, lat: data.location.latitude }',
            group_by: '',
            limit: 100000
          }).then(res => {
            this.tableData = res.data || []
          })
          return
        }
        if (nv === '热点案件') {
          getDubanData({
            filter: 'area_district.areaName=eq.静安区%26openTS=today%26((town=ex.true%26args.chs_timestamp_321=ex.true)|(args.chs_superviseStreetName=ex.true%26args.chs_superviseNotFound=ex.true%26args.chs_timestamp_321=ex.false))',
            transform: 'messages[*].{id:data.eventID, eventName: args.eventName, address: data.address,  town: data.town.areaName, openTS: data.openTS, status: data.exevt_status, lng: data.location.longitude, lat: data.location.latitude }',
            group_by: '',
            limit: 100000
          }).then(res => {
            this.tableData = res.data || []
          })
          return
        }
        if (nv === '随手拍') {
          getSspListData({
            filter: 'openTS=today%26is_delete=neq.1%26district_eventType.level_1=eq.随手拍',
            transform: 'messages[*].{id:data.eventID, eventName: args.eventName, address: data.address,  town: data.town.areaName, openTS: data.openTS, status: data.exevt_status, lng: data.location.longitude, lat: data.location.latitude }',
            group_by: '',
            limit: 100000
          }).then(res => {
            this.tableData = res.data || []
          })
          return
        }
        if (nv === '12345热线') {
          getHotlineData({
            filter: 'openTS=today',
            transform: 'messages[*].{id:data.eventID, eventName: args.eventName, address: data.address,  town: data.town.areaName, openTS: data.openTS, status: data.exevt_status, lng: data.location.longitude, lat: data.location.latitude, uuid: data.uuid }',
            group_by: '',
            limit: 100000
          }).then(res => {
            this.tableData = res.data || []
          })
          return
        }
        if (filter) {
          this.getListData(filter)
        }
      },
      deep: true,
      immediate: true
    }
  },
  data () {
    return {
      loading: false,
      filters: {
        name: {
          filters: [
            {
              label: '全部案件',
              rules: []
            }
          ]
        },
        status: {
          filters: CaseSteps.map(d => {
            return {
              label: d,
              rules: [d]
            }
          })
        }
      },
      caseheaders: [
        {
          label: '案件',
          prop: 'eventName',
          width: '280px'
        },
        {
          label: '发生时间',
          prop: 'openTS',
          type: 'date',
          isSecond: true,
          dateFmt: 'MM.dd hh:mm'
        },
        {
          label: '发生位置',
          prop: 'address',
          align: 'left'
        },
        {
          label: '所属街道',
          prop: 'town'
        },
        {
          label: '处置阶段',
          prop: 'status',
          filter: true,
          type: 'slot',
          slot: 'state'
        }
      ],
      headers: [],
      tableData: [],
      caseLayer: null,
      caseAllLayer: null
    }
  },
  created () {
    this.headers = [...this.caseheaders]
    if (this.item.label === '网格巡查') {
      this.headers = [
        ...this.caseheaders,
        {
          label: '是否督导',
          prop: 'chs_superviseDone'
        },
        {
          label: '是否申诉',
          prop: 'chs_timestamp_305'
        }
      ]
    }
    this.registerLayer()
  },
  methods: {
    handleClick () {
      this.$emit('click', 'dashboard', this.item)
    },
    getStatusColor (status) {
      let color = ''
      switch (status) {
        case '发现':
        case '立案':
          color = '#26ffff'
          break
        case '派遣':
        case '处理':
        case '处置':
        case '核查':
          color = '#f1c40f'

          break
        case '结案':
          color = '#6CCB73'
          break
        default:
          color = '#7BABF5'
      }
      return color
    },
    getIcon (status) {
      switch (status) {
        case '发现':
          return 'icon-faxian'
        case '立案':
          return 'icon-lian'
        case '派遣':
          return 'icon-paiqian'
        case '处理':
        case '处置':
          return 'icon-chuzhi'
        case '核查':
          return 'icon-hecha'
        case '结案':
          return 'icon-jiean'
        default:
          return ''
      }
    },
    handleRowClick (row) {
      if (row) {
        this.caseLayer = this.$_mapProxy.pointLocation(row).setPopupConfig({
          component: 'case',
          dataFormat: data => {
            return this.item.key === '12345热线' ? {
              caseId_: data.id,
              channelParams: 'sangao'
            } : {
              caseId_: data.id
            }
          }
        })
      } else {
        this.caseLayer && this.caseLayer.close()
      }
    },
    getMapIconImg () {
      let img = ''
      switch (this.item.key) {
        case 'red':
          img = '/mapIcon/red.png'
          break
        case 'yellow':
          img = '/mapIcon/yellow.png'
          break
        case '网格':
          img = '/mapIcon/allAndGrid.png'
          break
        case '综治':
          img = '/mapIcon/allAndAdmin.png'
          break
        case '110非警情':
          img = '/mapIcon/allAndPolice.png'
          break
        case '市场监管':
          img = '/mapIcon/allAndMarket.png'
          break
        default:
          img = '/mapIcon/default.png'
          break
      }
      return img
    },
    getListData (filter) {
      this.loading = true
      getListData(filter).then(res => {
        this.tableData = (res || []).map(item => {
          return {
            ...item,
            chs_superviseDone: item.chs_superviseDone ? '是' : '否',
            chs_timestamp_305: item.chs_timestamp_305 ? '是' : '否'
          }
        })
        this.loading = false
        this.addPoints()
      }).catch(() => {
        this.loading = false
      })
    },
    addPoints () {
      let img = this.getMapIconImg()
      this.caseAllLayer.setParameters({
        'renderer': {
          type: 'simple',
          label: '案件',
          symbol: {
            type: 'picture-marker',
            url: getUrl(img),
            width: '36px',
            height: '36px'
          }
        },
        'data': {
          'content': this.tableData.map(item => {
            return {
              id: item.id,
              lng: item.lng,
              lat: item.lat,
              uuid: item.uuid
            }
          }),
          'parsegeometry': 'function(item){return {x:item.lng,y:item.lat}}'
        }
      }).setPopupConfig({
        component: 'case',
        dataFormat: data => {
          return this.item.key === '12345热线' ? {
            caseId_: data.id,
            channelParams: 'sangao'
          } : {
            caseId_: data.id
          }
        }
      }).open()
    },
    registerLayer () {
      this.caseAllLayer = this.$_mapProxy.registerLayer('redAndYellowCaseLayer', '红黄灯案件', this.$_mapProxy.MANUAL_GROUP, {
        'name': 'redAndYellowCaseLayer',
        'data': {
          'data': [],
          'parsegeometry': 'function(item){return {x:item.lng,y:item.lat}}'
        },
        'legendVisible': false,
        'popupEnabled': false,
        'isFiltered': true,
        'isLocate': true,
        'renderer': {
          type: 'simple',
          label: '案件',
          symbol: {
            type: 'simple-marker',
            size: 10,
            color: [0, 255, 0],
            outline: {
              color: '#ffffff',
              width: '2px'
            }
          }
        }
      })
    }
  },
  beforeDestroy () {
    if (this.caseLayer) {
      this.caseLayer.close()
      this.caseLayer = null
    }
    if (this.caseAllLayer) {
      this.caseAllLayer.close()
      this.caseAllLayer = null
    }
  }
}
</script>
<style lang="scss" scoped>
  .title-right{
    cursor:pointer;
  }
</style>
