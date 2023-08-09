<template>
  <div class="popupWrap" :style='stylePopup'>
    <case-detail v-if="componentName === 'case'" :channelParams="mapData.channelParams" :caseId="mapData.caseId_" :info="mapData.caseDefaultInfo_" @open="openDragContainer_" @close="handleCaseDetailClose_"></case-detail>
    <component v-else v-bind:is="currentComponent" :info="mapData" :data="mapData" :items="items" v-bind="$attrs" v-on="$listeners" @show-loading="showLoading" @hide-loading="hideLoading"></component>
    <drag-container  appendDom="#MapContainer" :dialogShow.sync="dragShow_" :type="dragType_" :urls="dragUrl_" :initial-index="initialIndex_"></drag-container>
    <div v-show="showClose" class = "closeBtn" @click="closePopup">×</div>
    <div v-show="loading" class="loading">
      <p>{{loadingMsg}}</p>
    </div>
  </div>
</template>
<script>
// eslint-disable-next-line no-unused-vars
// 案件
import caseDetailMixin from '@/components/caseDetail-px/index.js'
import workerPopup from './workerPopup'
import PointsList from './workerPopup/points.vue'

export default {
  components: {
    RiskAlertPopup: () => import('./RiskAlertPopup'),
    BasicPopup: () => import('./page1/BasicPopup'),
    gridPopup: () => import('./page1/gridPopup'),
    juweiPopup: () => import('./page1/juweiPopup'),
    townPopup: () => import('./page1/townPopup'),
    neuronPopup: () => import('./page1/neuronPopup'),
    singleBuildingPopup: () => import('./page1/singleBuildingPopup'),
    shopPopup: () => import('./page1/shopPopup'),
    ParkLotPopup: () => import('./page1/ParkLotPopup'),
    PubliceTransportPopup: () => import('./page1/PubliceTransportPopup'),
    EventPopup: () => import('./page1/EventPopup'),
    PowerPopup: () => import('./page1/PowerPopup'),
    SubwayPopup: () => import('./page1/SubwayPopup'),
    PubliceTransportDetail: () => import('./page1/PublicTransportDetail'),
    workerPopup,
    PointsList,
    DangPopup: () => import('./page1/DangPopup'),
    BikePopup: () => import('./page1/BikePopup'),
    unitPopup: () => import('./page1/unitPopup'),
    JaCodePopup: () => import('./page1/JaCodePopup'),
    caseDetailPopup: () => import('./page1/caseDetailPopup')
  },
  inject: ['getGlobalConfig'],
  mixins: [caseDetailMixin],
  inheritAttrs: false,
  props: {
    mapData: {
      type: Object,
      default: () => {
        return {}
      }
    },
    items: {
      type: [Array, Object],
      default: () => []
    },
    componentName: {
      type: String,
      default: null
    },
    stylePopup: {
      type: Object,
      default: () => {
        return {
          left: '0px',
          top: '0px'
        }
      }
    },
    showClose: {
      type: Boolean,
      default: true
    }
  },
  name: 'Popup',
  data () {
    return {
      loading: false,
      loadingMsg: '加载中...'
    }
  },
  computed: {
    currentComponent () {
      switch (this.componentName) {
        case 'soldier':
          const vendorConfig = this.getGlobalConfig().soldierVendor
          const vendor = vendorConfig ? vendorConfig['vendor'] : null
          // console.log(vendor, "vendor");
          switch (vendor) {
            case 'shuguo':
              return 'SoldierEquipment'
            case 'qpwg':
              return 'QingpuSoldier'
            case 'hytera':
              return 'Hytera'
            case 'chinaunicom':
              return 'ChinaUnicom'
            default:
              return 'DefaultSoldierEquipment'
          }
        case 'case':
          return 'caseDetail'
        default:
          return this.componentName
      }
    }
  },
  methods: {
    closePopup () {
      this.$emit('close')
    },
    showLoading (msg) {
      this.loading = true
      if (msg) {
        this.loadingMsg = msg
      }
    },
    hideLoading () {
      this.loading = false
      this.loadingMsg = '加载中...'
    }
  },
  mounted () {},
  beforeDestroy () {
    if (this.componentName === 'case') {
      this.dragShow_ = false
    }
  }
}
</script>
<style lang="scss" scoped>
.popupWrap {
  position: absolute;
  background-color: rgba(#0f2e60, 1);
  z-index:9999;
  max-height: 1810px;
  overflow-y: auto;
}
.closeBtn {
  position: absolute;
  right: 20px;
  top:10px;
  font-size: 80px;
  color: #fff;
  position: absolute;
  right: 20px;
  top: 0px;
  cursor: pointer;
}
.closeBtn:hover {
  cursor: pointer;
}
.loading{
  display: table;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(77,120,164,0.8);
  font-size: 18px;
  color: #fff;
  line-height: 24px;
  text-align: center;
  z-index: 2;
  p {
    display: table-cell;
    vertical-align: middle;
  }
}
</style>
