<template>
  <div class="MapContainer" id="MapContainer" @click.stop @mousedown.stop>
    <maptitle @titleClick="handleReportView"></maptitle>
    <openLayerMap v-show="showSatelliteBaseMap"></openLayerMap>
    <citymap ref='Map' v-show="!showSatelliteBaseMap"></citymap>
    <maptool :class="{collapsed: isCollapsed}"></maptool>
    <videomap @collapsedChange="handleCollapseChange"></videomap>
        <!---左侧通用弹窗容器-->
    <popup-container :mapData="popupMapData" :componentName="popupComponentName" :popupBool.sync="popupBool" @closePopup='_closePopup'
    :stylePopup='stylePopup' ></popup-container>
    <YuqingPopup v-if="showYuqingPopup" @close="showYuqingPopup = false"></YuqingPopup>

    <m-dialog
      :dialog-visible.sync="visible"
      append-dom="#MapContainer"
      :destroy-after-close="true"
    >
      <m-pdf
        v-if="pdfUrl"
        :src="pdfUrl"
        mode="ppt"
      />
    </m-dialog>
  </div>
</template>
<script>
import popupContainer from '@/components/popups/popupContainer.vue'
import citymap from '@/components/citymap'
import maptitle from './components/MapTitle'
import maptool from './components/MapTool'
import videomap from './components/video'
import { getCaseTownList, getHotlineData } from './api'

import MPdf from '@/components/MPDF'
import MDialog from '@/components/MDialog'
import openLayerMap from '@/components/openLayer'
import YuqingPopup from '@/components/popups/page1/YuqingPopup/index'

export default {
  name: 'MapManager',
  data () {
    return {
      visible: false,
      pdfUrl: '',
      // 弹窗
      isCollapsed: false,
      stylePopup: {
        left: '10px',
        top: '300px'
      },
      popupMapData: {},
      popupComponentName: '',
      popupBool: false,
      showSatelliteBaseMap: false,
      showYuqingPopup: false
    }
  },
  components: {
    maptitle,
    citymap,
    maptool,
    videomap,
    popupContainer,
    MDialog,
    MPdf,
    openLayerMap,
    YuqingPopup
  },
  computed: {
  },
  methods: {
    // 打开弹窗
    _openPopup (type, data) {
      switch (type) {
        case 'video':
          this.videoShow = true
          this.videoData = data
          break
        default:
          this.popupBool = true
          this.popupComponentName = type
          this.popupMapData = data
      }
    },
    // 关闭左侧弹窗
    _closePopup () {
      this.popupBool = false
    },
    // 街镇案件点
    addTownCasePoint (data) {
      const dataCmd = {
        name: 'townCasePointLayer',
        type: 'point',
        mode: 'replace',
        data: {
          content: data,
          parsegeometry: 'function(item){return {x:item.lng, y:item.lat}}'
        },
        legendVisible: false,
        popupEnabled: false,
        isFiltered: false,
        isLocate: false,
        renderer: {
          type: 'simple',
          label: '案件点',
          symbol: {
            type: 'picture-marker',
            url: this.rootUrl + 'mapIcon/case.png',
            width: '48px',
            height: '65px'
          }
        }
      }
      const commandParams = {
        ActionName: 'ShowData',
        Parameters: JSON.stringify(dataCmd)
      }
      window.bridge.Invoke(commandParams)
    },
    addTownHotlineCasePoint (data) {
      const dataCmd = {
        name: 'townHotlineCasePointLayer',
        type: 'point',
        mode: 'replace',
        data: {
          content: data,
          parsegeometry: 'function(item){return {x:item.lng, y:item.lat}}'
        },
        legendVisible: false,
        popupEnabled: false,
        isFiltered: false,
        isLocate: false,
        renderer: {
          type: 'simple',
          label: '案件点',
          symbol: {
            type: 'picture-marker',
            url: this.rootUrl + 'mapIcon/case.png',
            width: '48px',
            height: '65px'
          }
        }
      }
      const commandParams = {
        ActionName: 'ShowData',
        Parameters: JSON.stringify(dataCmd)
      }
      window.bridge.Invoke(commandParams)
    },

    showStreetCasePoint(data) {
      this.addTownHotlineCasePoint(data)
    },

    mapClickHandle (data) {
      console.log(data, 'data-------------')
      if (data.hotlineEvent) {
        getHotlineData({
          filter: `openTS=-604800%26is_delete=neq.1%26polygon=${data.hotlineEvent[0].name}`,
          transform: 'messages[*].{id:data.eventID, lng: data.location.longitude, lat: data.location.latitude, uuid: data.uuid }',
          group_by: '',
          limit: 100000
        }).then(res => {
          this.addTownHotlineCasePoint(res.data)
          this.goToTown(data.hotlineEvent[0].name)
          setTimeout(() => {
            this.removeLayer('hotlineEvent')
          }, 1500)
        })
        return
      }
      if (data.townLayer) {
        getCaseTownList(data.townLayer[0].name).then(res => {
          this.addTownCasePoint(res.data)
          this.goToTown(data.townLayer[0].name)
          setTimeout(() => {
            this.removeLayer('townLayer')
          }, 1500)
        })
        return
      }
      if (data.townHotlineCasePointLayer) {
        if (data.townHotlineCasePointLayer[0].sourceType) {
          this._openPopup('case', {
            caseId_: data.townHotlineCasePointLayer[0].uuid,
            sourceType: data.townHotlineCasePointLayer[0].sourceType,
            channelParams: data.townHotlineCasePointLayer[0].sourceType === 'grid' ? 'paidan' : 'sangao',
            caseDefaultInfo_: data.townHotlineCasePointLayer[0]
          })
        } else {
          this._openPopup('case', {
            caseId_: data.townHotlineCasePointLayer[0].id,
            channelParams: 'sangao',
            caseDefaultInfo_: data.townHotlineCasePointLayer[0]
          })
        }
        return
      }
      if (data.townCasePointLayer) {
        this._openPopup('case', {
          caseId_: data.townCasePointLayer[0].id,
          caseDefaultInfo_: data.townCasePointLayer[0]
        })
        return
      }
      if (data.townPeopleLayer) {
        return
      }

      if (data.juweiBoundaryLayer) {
        this._openPopup('juweiPopup', data.juweiBoundaryLayer[0])
        return
      }
      if (data.townBoundaryLayer) {
        this._openPopup('townPopup', data.townBoundaryLayer[0])
        return
      }
      if (data.gridBoundaryLayer) {
        this._openPopup('gridPopup', data.gridBoundaryLayer[0])
        return
      }
      if (data.thingsPerceptionLayer) {
        this._openPopup('neuronPopup', data.thingsPerceptionLayer[0])
        return
      }
      if (data.publicDeviceLayer && data.publicDeviceLayer[0] && data.publicDeviceLayer[0].messageType &&
      ['学校', '医院', '医院1', '养老院'].includes(data.publicDeviceLayer[0].messageType)) {
        this._openPopup('gonggongBuildPopup', data.publicDeviceLayer[0])
        return
      }
      if (data) {
        let len = Object.keys(data).length
        if (len === 1) {
          return
        }
        this._openPopup('basicPopup', data)
      }
    },
    goToTown (name) {
      const cmd = {
        name: 'townLocationLayer',
        type: 'layer',
        isLocate: true,
        legendVisible: false,
        popupEnabled: false,
        data: {
          layers: {
            name: '街道乡镇',
            where: "街道名称='" + name + "'"
          }
        },
        labels: [
          {
            fields: [
              '#.街道名称'
            ],
            color: [
              255,
              255,
              255,
              1
            ],
            size: 36,
            font: {
              family: 'fangsong',
              weight: 'bold'
            }
          }
        ],
        renderer: {
          type: 'simple',
          symbol: {
            type: 'line-3d',
            label: '街道',
            symbolLayers: [
              {
                type: 'line',
                size: 5,
                material: {
                  color: [0, 255, 255, 1]
                }
              }
            ]
          }
        }
      }
      const commandParams = {
        ActionName: 'ShowData',
        Parameters: JSON.stringify(cmd)
      }
      window.bridge.Invoke(commandParams)
    },
    removeLayer (layerName) {
      const commandParams = {
        ActionName: 'doRemoveShowData',
        Parameters: JSON.stringify([
          layerName
        ])
      }
      window.bridge.Invoke(commandParams)
    },
    onMapReady () {
      let dataCmd = {
        ActionName: 'ShowData',
        Parameters: {
          name: 'filterLayer',
          type: 'layer',
          filterMode: 'all',
          legendVisible: false,
          data: {
            layers: {
              name: '区县边界'
            }
          },
          renderer: {
            type: 'simple',
            symbol: {
              type: 'line-3d',
              symbolLayers: [
                {
                  type: 'line',
                  size: 5,
                  material: {
                    color: [0, 0, 0, 0]
                  }
                }
              ]
            }
          }
        }
      }
      window.bridge.Invoke(dataCmd)
    },
    handleCollapseChange (val) {
      this.isCollapsed = val
    },
    handleReportView () {
      this.visible = true
      this.pdfUrl = this.rootUrl + '/pdf/report.pdf'
    },
    clickSatelliteBaseMap() {
      this.showSatelliteBaseMap = !this.showSatelliteBaseMap
    }
  },
  created () {
    const urlString = window.location.href
    let subIndex = urlString.lastIndexOf('.html')
    const urlStringSub = urlString.substring(0, subIndex + 1)
    subIndex = urlStringSub.lastIndexOf('/')
    this.rootUrl = urlStringSub.substring(0, subIndex + 1)
  },
  mounted () {
    // 地图点击事件
    this.$bus.$on('citymap-click', this.mapClickHandle)
    // 地图加载完毕
    this.$bus.$on('citymap-ready', this.onMapReady)
    // 注册地图代理组件
    this.$_mapProxy.setMap(this)
    // 查看卫星底图
    this.$bus.$on('click-satellite-basemap', this.clickSatelliteBaseMap)
    // 监听运行动态
    this.$bus.$on('show-street-case-point', this.showStreetCasePoint)
    this.$bus.$on('watchYuq', () => {
      this.showYuqingPopup = true
    })
    this.$bus.$on('openHuoqingCaseDetailPopup', (data) => {
      this._openPopup('huoqingCaseDetailPopup', data)
    })
  }
}
</script>
<style lang="scss" scoped>
.MapContainer {
  position: relative;
  // border: 0.02rem solid #4e78a4;
  width: 100%;
  height: 100%;

  .collapsed{
    right: 0.2rem;
  }
}

</style>
