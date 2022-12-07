<template>
  <div class="container">
    <div class="title">
      <p>历史轨迹</p>
      <div class="line"></div>
      <el-date-picker
        v-model="day"
        type="date"
        :clearable="false"
        value-format="timestamp"
        placeholder="选择日期">
      </el-date-picker>
      <div style="height: 8rem">
        <m-list :headers="headers" :dataset="list" height="8rem" @rowClick="pointLocation" >
          <template v-slot:opt>
            <div>
              <span class="opt-btn iconfont icon-dangqianweizhi"></span>
            </div>
          </template>
        </m-list>
      </div>
      <p>相关案件</p>
      <div style="height: 5rem">
        <m-list :headers="headers1" :dataset="caseList" height="5rem" row-key="uuid" @rowClick="pointLocationCase" >
        </m-list>
      </div>

    </div>
  </div>
</template>
<script>
import { getDataBy145, getPeopleDayCase } from './api'
import MList from '@/components/MList'
import { getUrl } from '@res/utils/tools'

export default {
  props: {
    info: {
      type: Object,
      default: () => {
        return {
        }
      }
    }
  },
  components: { MList },
  data () {
    return {
      day: new Date().getTime(),
      list: [],
      headers: [
        {
          label: '时间',
          prop: 'timestamp',
          type: 'date',
          isSecond: true,
          ratio: 2
        },
        {
          label: '操作',
          prop: 'id',
          type: 'slot',
          slot: 'opt'
        }
      ],
      headers1: [
        {
          label: '名称',
          prop: 'eventName'
        },
        {
          label: '上报时间',
          prop: 'openTS',
          type: 'date',
          isSecond: true
        }

      ],
      caseList: [],
      caseLayer: null,
      pointLayer: null

    }
  },
  watch: {
    day: {
      immediate: true,
      handler () {
        if (!this.caseLayer) {
          this.registerLayer()
        }
        this.getData()
      }
    }
  },
  methods: {
    getParamsTime () {
      const time = new Date(this.day).setHours(0, 0, 0, 0) / 1000
      return [time, time + 86400].join('~')
    },
    getData () {
      const id = this.info.primeID
      // id = "paidan.682";
      const params = {
        filter: `primeID.primeID=${id}&time=${this.getParamsTime()}`
      }
      // 轨迹数据
      getDataBy145(params).then(res => {
        this.list = res.data
        // 画轨迹
        this.$bus.$emit('show-histroy-line', {
          status: 1,
          data: this.list
        })
      })
      // 案件
      const params1 = {
        filter: `args.chs_userId_21=eq.${id.replace('paidan.', '')}&openTS=${this.getParamsTime()}`
      }
      getPeopleDayCase(params1).then(res => {
        this.caseList = res.list || []
        this.caseLayer.setParameters({
          data: {
            content: this.caseList,
            parsegeometry: 'function(item){return {x:item.lng, y:item.lat}}'
          }
        }).open()
      })
    },
    pointLocation (row) {
      if (!row) {
        this.$_mapProxy.resetPointLocation()
        this.$_mapProxy.fullExtent()
      } else {
        this.pointLayer = this.$_mapProxy.pointLocation({
          lat: row.lat,
          lng: row.lon,
          ...row
        }, '/mapIcon/isolationPoint.png', 'manual', false, false, false)
      }
    },
    pointLocationCase (row) {
      if (!row) {
        this.$_mapProxy.resetPointLocation()
        this.$_mapProxy.fullExtent()
      } else {
        this.pointLayer = this.$_mapProxy.pointLocation(row, '/mapIcon/allAndAdmin.png', 'manual', false, false, false)
      }
    },
    registerLayer () {
      this.caseLayer = this.$_mapProxy
        .registerLayer(
          'PowerCaseLayer',
          '工作力量天案件',
          this.$_mapProxy.MANUAL_GROUP
        )
        .setParameters({
          name: 'PowerCaseLayer',
          type: 'point',
          mode: 'replace',
          data: {
            content: [],
            parsegeometry: 'function(item){return {x:item.lng, y:item.lat}}'
          },
          legendVisible: false,
          popupEnabled: false,
          isFiltered: false,
          isLocate: false,
          renderer: {
            type: 'simple',
            symbol: {
              type: 'picture-marker',
              url: getUrl('/mapIcon/allAndGrid.png'),
              width: '50px',
              height: '50px'
            }
          }
        })
        .onClick(data => {
          this.$emit('addNewPopup', {
            key: 'case1',
            componentName: 'case',
            showClose: true,
            mapData: {
              caseId_: data.uuid
            }
          })
        }, 'power_case_click')
    },
    clearMap () {
      this.$bus.$emit('show-histroy-line', {
        status: 0
      })
      if (this.caseLayer) {
        this.caseLayer.close()
        this.caseLayer = null
      }
      if (this.pointLayer) {
        // todo
        this.$_mapProxy.resetPointLocation()
        this.$_mapProxy.fullExtent()
      }
    }
  },
  beforeDestroy () {
    this.clearMap()
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
    .line {
      height: 4px;
      background: linear-gradient(90deg, rgba(116, 228, 255, 0) 0%, rgb(64, 196, 255) 49%, rgba(64, 196, 255, 0) 100%);
    }

    .opt-btn{
      cursor:pointer;
      color: #80D8FF;
    }

}
    /deep/ {
      .el-date-editor.el-input, .el-date-editor.el-input__inner {
          width: 100%;
      }
      .el-input--prefix .el-input__inner {
          padding-left: 60px;
      }
      .el-input__icon {
          height: 100%;
          width: 50px;
          text-align: center;
          -webkit-transition: all .3s;
          transition: all .3s;
          line-height: 78px;
      }
    }
</style>
<style lang="scss">
.el-date-picker {
    width: 6.6rem !important;
}
    .el-date-picker .el-picker-panel__content {
          width: 6.2rem !important;
    }
    .el-picker-panel__icon-btn {
      font-size: 24px !important;
      color: #fff !important;
      margin-top: 14px !important;
  }
  .el-date-picker__header{
    font-size: 32px !important;
  }
  .el-picker-panel__content{
    font-size: 24px !important;
  }
  .el-date-picker__header-label {
      font-size: 32px !important;
      line-height: 50px !important;
  }
  .el-picker-panel {
      line-height: 50px !important;
  }
  .el-date-table {
      font-size: 24px !important;
  }
  .el-date-table td span {
      width: 36px !important;
      height: 36px !important;
      display: block;
      margin: 0 auto;
      line-height: 36px !important;
      position: absolute;
      left: 50%;
      -webkit-transform: translateX(-50%);
      transform: translateX(-50%);
      border-radius: 50%;
  }
</style>
