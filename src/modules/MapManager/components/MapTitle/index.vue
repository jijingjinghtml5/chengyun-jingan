<template>
  <div class="MapTitleContainer">
    <div class="tilte" @click="handeClick">上海市静安区城市运行管理平台</div>
    <div class="map-tab">
      <header-menu :mapControlItem="mapControlItem" :checkItems="checkItems" :mapControlItemData="mapControlItemData"
        :formatMethod="formatMethods"></header-menu>
    </div>
  </div>
</template>
<script>
import HeaderMenu from '@/lib/MapHeader/HeaderMenu'
import SHcoordinateUtils from '@/lib/MapProxy/coordUtils/SHcoordinateUtils'
import {
  getCaseTownCount,
  getPeopleStatistic,
  getNeuronData,
  getSingleBuildingData,
  getShopList,
  getEventList,
  getOrgs,
  getHotlineData,
  getSubway,
  getHujiPeople,
  getYwym,
  getJinganCode,
  getPeopleCount,
  getPublicDevice,
  getCodeNum
} from './api'
import {
  thousandCentimeter,
  getUrl
} from '@/utils/tools'
import partClassData from './data/partsClass'
import pipelineData from './data/pipelineLength'
import neuronData from './data/data'

export default {
  name: 'MapTitle',
  components: {
    HeaderMenu
  },
  data () {
    return {
      codeList: [],
      formatMethods: {
        'thing': (item) => {
          return item.total || ''
        }
      },
      mapControlItem: [
        {
          name: '人',
          iconClass: 'icon-renqunjuji',
          attr: 'people',
          isExpand: true,
          columns: 2,
          radio: true
        },
        {
          name: '地',
          iconClass: 'icon-bangonglouyu',
          attr: 'area',
          isExpand: true,
          radio: true,
          columns: 2
        },
        {
          name: '物',
          iconClass: 'icon-wulianganzhi1',
          attr: 'thing',
          isExpand: true,
          columns: 3,
          radio: true
        },
        {
          name: '事',
          iconClass: 'icon-jinriguanzhu',
          attr: 'event',
          isExpand: true,
          radio: true,
          columns: 2
        },
        {
          name: '情',
          iconClass: 'icon-wu',
          attr: 'situation',
          isExpand: true,
          columns: 2
        },
        {
          name: '组织',
          iconClass: 'icon-luchangzhi',
          attr: 'organization',
          isExpand: true,
          radio: true,
          columns: 2
        }
      ],
      mapControlItemData: {
        people: '820',
        area: '171',
        thing: '3433',
        event: '89',
        situation: '901',
        organization: '121'
      },
      shopListData: [],
      eventListData: [],
      organizationData: {
        '党群组织列表': [],
        '党群人员统计': [],
        '民族宗教信息': []
      },
      shopLayer: null,
      subwayLayer: null,
      thing0: [],
      thing1: [],
      thing2: []
      // area0: [],
      // area1: []
    }
  },
  computed: {
    checkItems () {
      const codeList = this.codeList.map(item => {
        return {
          name: item.type,
          nameKey: 'name',
          type: 'ywym',
          code: item.type,
          checked: false,
          total: item.total
        }
      })
      return {
        people: [
          {
            name: '户籍人员',
            nameKey: 'name',
            type: 'people',
            checked: false
          },
          {
            name: '来沪人员',
            nameKey: 'name',
            type: 'people',
            checked: false
          },
          {
            name: '境外人员',
            nameKey: 'name',
            type: 'people',
            checked: false
          }
        ],
        thing: [
          {
            name: '城市部件',
            nameKey: 'name',
            children: [...this.thing0],
            childKey: 'children'
          },
          {
            name: '地下管线',
            nameKey: 'name',
            children: [...this.thing1],
            childKey: 'children'
          },
          {
            name: '神经元传感器',
            nameKey: 'name',
            children: [...this.thing2],
            childKey: 'children'
          },
          {
            name: '静安码',
            nameKey: 'name',
            children: [
              {
                name: '部件码',
                nameKey: 'name',
                type: 'ywym',
                childKey: 'children',
                children: [
                  ...codeList
                ]
              },
              {
                name: '彭浦码',
                nameKey: 'name',
                type: 'jingan-code',
                street: '彭浦新村街道',
                typeName: '商户码、小区码、楼组码',
                checked: false
              },
              {
                name: '曹家渡码',
                nameKey: 'name',
                type: 'jingan-code',
                street: '曹家渡街道',
                typeName: '门责码',
                checked: false
              }
            ],
            childKey: 'children'
          }
        ],
        area: [
          {
            name: '公共设施',
            nameKey: 'name',
            children: [{
              name: '学校',
              nameKey: 'name',
              type: 'publicLayer',
              checked: false
            },
            {
              name: '医院',
              nameKey: 'name',
              type: 'publicLayer',
              checked: false
            },
            {
              name: '养老院',
              nameKey: 'name',
              type: 'publicLayer',
              checked: false
            }
            ],
            childKey: 'children'
          },
          {
            name: '基础设施',
            nameKey: 'name',
            children: [{
              name: '公共绿地',
              nameKey: 'name',
              type: 'baseLayer',
              checked: false
            },
            {
              name: '小区绿化',
              nameKey: 'name',
              type: 'baseLayer',
              checked: false
            },
            {
              name: '行道树',
              nameKey: 'name',
              type: 'baseLayer',
              checked: false
            },
            {
              name: '花架花钵',
              nameKey: 'name',
              type: 'baseLayer',
              checked: false
            },
            {
              name: '街头座椅',
              nameKey: 'name',
              type: 'baseLayer',
              checked: false
            },
            {
              name: '单位绿化',
              nameKey: 'name',
              type: 'baseLayer',
              checked: false
            },
            {
              name: '雕塑',
              nameKey: 'name',
              type: 'baseLayer',
              checked: false
            },
            {
              name: '河道绿化',
              nameKey: 'name',
              type: 'baseLayer',
              checked: false
            },
            {
              name: '地铁站点',
              nameKey: 'name',
              type: 'baseLayer',
              checked: false
            }
            ],
            childKey: 'children'
          },
          {
            name: '多用途单体建筑',
            nameKey: 'name',
            children: [{
              name: '全部',
              nameKey: 'name',
              checked: false,
              type: 'singleBuilding'
            }],
            childKey: 'children'
          },
          {
            name: ' 沿街商铺餐饮户',
            nameKey: 'name',
            children: [{
              name: '全部',
              nameKey: 'name',
              checked: false,
              type: 'shop'
            }],
            childKey: 'children'
          }
        ],
        event: [
          {
            name: '主动发现',
            type: 'event',
            nameKey: 'name',
            checked: false
          },
          {
            name: '被动发现',
            type: 'event',
            nameKey: 'name',
            checked: false
          },
          {
            name: '自动发现',
            type: 'event',
            nameKey: 'name',
            checked: false
          }
        ],
        situation: [
          {
            name: '火情案件',
            nameKey: 'name',
            type: 'situation',
            checked: false
          },
          {
            name: '警情案件',
            nameKey: 'name',
            type: 'situation',
            checked: false
          },
          {
            name: '灾情案件',
            nameKey: 'name',
            type: 'situation',
            checked: false
          }
        ],
        organization: [
          {
            name: '党群组织列表',
            nameKey: 'name',
            checked: false,
            type: 'organization'
          },
          {
            name: '党群人员统计',
            nameKey: 'name',
            checked: false,
            type: 'organization'
          },
          {
            name: '民族宗教信息',
            nameKey: 'name',
            checked: false,
            type: 'organization'
          }
        ]
      }
    } 
  },
  methods: {
    handeClick () {
      this.$emit('titleClick')
    },
    mapHeaderItemChoose (data) {
      console.log(data, 'mapHeaderItemChoose--------------')
      this.$_mapProxy.map._closePopup()
      this.$bus.$emit('map-close-model', {})
      this.$bus.$emit('map-full-extent', {})
      switch (data.item.type) {
        case 'organization':
          if (data.item.checked) {
            this.$_mapProxy.getMap()._openPopup('DangPopup', {
              name: data.item.name,
              list: this.organizationData[data.item.name]
            })
          } else {
            this.$_mapProxy.getMap()._closePopup()
          }
          break
        case 'situation':
          if (data.item.checked) {
            let type = ''
            if (data.item.name === '火情案件') type = '火灾事故'
            if (data.item.name === '警情案件') type = '事故灾难'
            if (data.item.name === '灾情案件') type = '道路交通事故'
            this.$_mapProxy.getMap()._openPopup('EventPopup', {
              name: data.item.name,
              list: this.eventListData.filter(item => item.event_type_name === type)
            })
          } else {
            this.$_mapProxy.getMap()._closePopup()
          }
          break
        case 'event':
          this.handlerEvent(data.item)
          break
        case 'people':
          this.handlerPeople(data.item)
          break
        case 'publicLayer':
          this.handlerPublic(data.item)
          break
        case 'baseLayer':
          if (data.item.name === '地铁站点') {
            if (data.item.checked) {
              getSubway().then(res => {
                this.subwayLayer.setParameters({
                  'data': {
                    'content': (res.data.messages || []).map(item => {
                      return {
                        ...item,
                        name: item.data.housingEstate.areaName
                      }
                    }),
                    'parsegeometry': 'function(item){return {rings:item.data.polygons[0].points}}'
                  }
                }).setPopupConfig({
                  component: 'SubwayPopup'
                }).open()
              })
            } else {
              this.removeLayer('SubwayLayer')
            }
          } else {
            this.tabLayer(data.item.name, data.item.checked)
          }
          break
        case 'neuron':
          this.handlerNeuron(data.item)
          break
        case 'singleBuilding':
          this.handlerSingleBuilding(data.item)
          break
        case 'shop':
          this.handlerShop(data.item)
          break
        case 'ywym':
          this.handleYwym(data.item)
          break
        case 'jingan-code':
          this.handleJinganCode(data.item)
          break
      }
    },
    async handleJinganCode (item) {
      if (item.checked) {
        if (item.street) {
          getJinganCode(item.street).then(res => {
            res = res.map(item => {
              let coord = SHcoordinateUtils.WGStoSH([item.longitude, item.latitude])
              return {
                ...item,
                x: coord[0],
                y: coord[1]
              }
            })
            this.pointLayer.setParameters({
              'data': {
                'content': (res || []),
                'parsegeometry': 'function(item){return {x:item.x, y:item.y}}'
              },
              'renderer': {
                'type': 'simple',
                symbol: {
                  type: 'picture-marker',
                  url: getUrl('/mapIcon/unit.png'),
                  width: '40px',
                  height: '58px'
                }
              }
            }).setPopupConfig({
              component: 'JaCodePopup'
            }).open()
          })
          return
        }
        this.pointLayer.setParameters({
          'data': {
            'content': [],
            'parsegeometry': 'function(item){return {x:item.data.coordx, y:item.data.coordy}}'
          }
        }).setPopupConfig({
          component: 'JaCodePopup'
        }).open()
      } else {
        this.pointLayer.close()
      }
    },
    async handleYwym (item) {
      if (item.checked) {
        if (item.name) {
          let name = item.name
          if (item.name == '消火栓(专业)') {
            name = '消火栓"("专业")",消火栓'
          }
          getYwym(name).then(res => {
            this.pointLayer.setParameters({
              'data': {
                'content': (res.data.messages || []),
                'parsegeometry': 'function(item){return {x:item.data.coordx, y:item.data.coordy}}'
              },
              'renderer': {
                'type': 'simple',
                symbol: {
                  type: 'picture-marker',
                  url: getUrl('/mapIcon/unit.png'),
                  width: '40px',
                  height: '58px'
                }
              }
            }).setPopupConfig({
              component: 'unitPopup'
            }).open()
          })
          return
        }
        this.pointLayer.setParameters({
          'data': {
            'content': [],
            'parsegeometry': 'function(item){return {x:item.data.coordx, y:item.data.coordy}}'
          }
        }).setPopupConfig({
          component: 'unitPopup'
        }).open()
      } else {
        this.pointLayer.close()
      }
    },
    handlerShop (item) {
      // todo
      if (item.checked) {
        let data = this.shopListData.filter(e => {
          return item.name === '全部' || e.street_name === item.name
        })
        this.shopLayer.setParameters({
          'data': {
            'content': data,
            'parsegeometry': 'function(item){return {x:item.x, y:item.y}}'
          }
        }).setPopupConfig({
          component: 'shopPopup'
        }).open()
      } else {
        this.shopLayer.close()
      }
    },
    handlerSingleBuilding (item) {
      if (item.checked) {
        if (item.name === '全部') {
          this.singleBuildingLayer.setParameters({
            'data': {
              'content': this.singleBuildingData,
              'parsegeometry': 'function(item){return {x:item.x, y:item.y}}'
            }
          }).setPopupConfig({
            component: 'singleBuildingPopup'
          }).open()
          return
        }
        let data = this.singleBuildingData.filter(e => {
          return e.street_name === item.name
        })
        this.singleBuildingLayer.setParameters({
          'data': {
            'content': data,
            'parsegeometry': 'function(item){return {x:item.x, y:item.y}}'
          }
        }).setPopupConfig({
          component: 'singleBuildingPopup'
        }).open()
      } else {
        this.singleBuildingLayer.close()
      }
    },
    handlerNeuron (item) {
      if (item.checked) {
        getNeuronData(item.name).then(res => {
          this.thingsPerceptionLayer.setParameters({
            'data': {
              'content': res.data,
              'parsegeometry': 'function(item){return {x:item.lng, y:item.lat}}'
            }
          }).open()
        })
      } else {
        this.thingsPerceptionLayer.close()
      }
    },
    tabLayer (layerName, visible) {
      let cmd = {
        'ActionName': 'LayerVisible',
        'Parameters': [{
          'name': layerName,
          'visible': visible,
          popupEnabled: false,
          legendVisible: false
        }]
      }
      window.bridge.Invoke(cmd)
    },
    handlerPublic (item) {
      if (item.checked) {
        if (item.name) {
          let name = item.name
          getPublicDevice(name).then(res => {
            this.publicDeviceLayer.setParameters({
              'data': {
                'content': (res.data.messages || []),
                'parsegeometry': 'function(item){return {x:item.data.coordx, y:item.data.coordy}}'
              },
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
            }).open()
          })
          return
        }
        this.publicDeviceLayer.setParameters({
          'data': {
            'content': [],
            'parsegeometry': 'function(item){return {x:item.data.coordx, y:item.data.coordy}}'
          }
        }).open()
      } else {
        this.publicDeviceLayer.close()
      }
    },
    handlerPeople (item) {
      if (item.checked) {
        let field = 'actual_popu'
        if (item.name === '来沪人员') {
          field = 'nonlocal_popu'
        }
        if (item.name === '境外人员') {
          field = 'overseas_popu'
        }
        getPeopleCount().then(res => {
          let peopleTownData = []
          res.data.forEach((e, i) => {
            if (e.area !== '静安区') {
              let obj = {}
              obj.count = thousandCentimeter(e[field])
              obj.name = e.area
              obj.typeValue = 4 - Math.ceil((i + 1) / 5)
              peopleTownData.push(obj)
            }
          })
          this.addTownPeople(peopleTownData)
        })
      } else {
        this.removeLayer('townPeopleLayer')
      }
    },
    handlerEvent (item) {
      if (item.checked) {
        if (item.name === '被动发现') {
          getHotlineData({
            transform: 'aggResults',
            filter: 'openTS=-604800&is_delete=neq.1',
            group_by: 'simple.messageClass(filter.today:openTS=today)(filter.yesterday:openTS=yesterday),town.areaName(filter.value:closeTS=ex.true)'
          }).then(res => {
            console.log(res, '被动发现')
            let result = res.data['town.areaName'].map(item => {
              return {
                ...item,
                total: item.count,
                areaName: item['town.areaName']
              }
            })
            this.addTownArea(this.classifyCase(result), '静安区', 'hotlineEvent')
          })
        } else {
          getCaseTownCount('静安区', item.name).then(res => {
            if (res.data.length > 0) {
              this.addTownArea(this.classifyCase(res.data), '静安区')
            } else {
              this.$message({
                message: '该条件下，暂无案件！',
                type: 'warning'
              })
            }
          })
        }
      } else {
        this.removeLayer('townLayer')
        this.removeLayer('townCasePointLayer')
        this.removeLayer('townHotlineCasePointLayer')
        this.removeLayer('townLocationLayer')
        this.removeLayer('hotlineEvent')
      }
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
    classifyCase (data) {
      const classifyData = []
      data.forEach(d => {
        const item = {}
        item.name = d.areaName
        const rate = d.value / d.total
        if (rate === 0) {
          item.typeValue = 6
        } else if (rate > 0 && rate < 0.6) {
          item.typeValue = 5
        } else if (rate >= 0.6 && rate < 0.7) {
          item.typeValue = 4
        } else if (rate >= 0.7 && rate < 0.8) {
          item.typeValue = 3
        } else if (rate >= 0.8 && rate < 0.9) {
          item.typeValue = 2
        } else {
          item.typeValue = 1
        }
        classifyData.push(item)
      })
      return classifyData
    },
    // 街镇案件分类图
    addTownArea (data, district, layerName, legendVisible) {
      let layerNameN = 'townLayer'
      if (layerName) {
        layerNameN = layerName
      }
      let legendVisibleBool = true
      if (legendVisible) {
        legendVisibleBool = false
      }
      const cmd = {
        ActionName: 'ShowData',
        Parameters: {
          name: layerNameN,
          type: 'layer',
          legendVisible: legendVisibleBool,
          popupEnabled: false,
          isLocate: true,
          data: {
            content: data,
            layers: {
              name: '街道乡镇',
              where: "所属区县='" + district + "'"
            },
            join: '街道名称=name'
          },
          labels: [{
            fields: [
              '#.街道名称'
              // '#.count'
            ],
            color: [
              255,
              255,
              255,
              1
            ],
            size: 20,
            font: {
              family: 'fangsong',
              weight: 'normal'
            }
          }],
          renderer: {
            type: 'unique-value',
            field: 'typeValue',
            uniqueValueInfos: [{
              value: 1,
              label: '90%以上',
              symbol: {
                type: 'simple-fill',
                color: [105, 240, 174, 0.5],
                style: 'solid',
                outline: {
                  color: [105, 240, 174, 1],
                  width: 1
                }
              }
            },
            {
              value: 2,
              label: '80% ~ 90%',
              symbol: {
                type: 'simple-fill',
                color: [132, 255, 255, 0.5],
                style: 'solid',
                outline: {
                  color: [132, 255, 255, 1],
                  width: 1
                }
              }
            },
            {
              value: 3,
              label: '70% ~ 80%',
              symbol: {
                type: 'simple-fill',
                color: [253, 204, 132, 0.5],
                style: 'solid',
                outline: {
                  color: [253, 204, 132, 1],
                  width: 1
                }
              }
            },
            {
              value: 4,
              label: '60% ~ 70%',
              symbol: {
                type: 'simple-fill',
                color: [234, 128, 252, 0.5],
                style: 'solid',
                outline: {
                  color: [234, 128, 252, 1],
                  width: 1
                }
              }
            },
            {
              value: 5,
              label: '60%以下',
              symbol: {
                type: 'simple-fill',
                color: [255, 138, 128, 0.5],
                style: 'solid',
                outline: {
                  color: [255, 138, 128, 1],
                  width: 1
                }
              }
            },
            {
              value: 6,
              label: '无结案',
              symbol: {
                type: 'simple-fill',
                color: [100, 100, 100, 0.5],
                style: 'solid',
                outline: {
                  color: [100, 100, 100, 1],
                  width: 1
                }
              }
            }
            ]
          }
        }
      }
      window.bridge.Invoke(cmd)
    },
    // 街镇案件分类图
    addTownPeople (data) {
      const cmd = {
        ActionName: 'ShowData',
        Parameters: {
          name: 'townPeopleLayer',
          type: 'layer',
          legendVisible: false,
          popupEnabled: false,
          isLocate: true,
          data: {
            content: data,
            layers: {
              name: '街道乡镇',
              where: "所属区县='静安区'"
            },
            join: '街道名称=name'
          },
          labels: [{
            fields: [
              '#.街道名称',
              '#.count'
            ],
            color: [
              255,
              255,
              255,
              1
            ],
            size: 20,
            font: {
              family: 'fangsong',
              weight: 'normal'
            }
          }],
          renderer: {
            type: 'unique-value',
            field: 'typeValue',
            uniqueValueInfos: [{
              value: 1,
              symbol: {
                type: 'simple-fill',
                color: [105, 240, 174, 0.5],
                style: 'solid',
                outline: {
                  color: [105, 240, 174, 1],
                  width: 1
                }
              }
            },
            {
              value: 2,
              symbol: {
                type: 'simple-fill',
                color: [132, 255, 255, 0.5],
                style: 'solid',
                outline: {
                  color: [132, 255, 255, 1],
                  width: 1
                }
              }
            },
            {
              value: 3,
              symbol: {
                type: 'simple-fill',
                color: [253, 204, 132, 0.5],
                style: 'solid',
                outline: {
                  color: [253, 204, 132, 1],
                  width: 1
                }
              }
            },
            {
              value: 4,
              symbol: {
                type: 'simple-fill',
                color: [234, 128, 252, 0.5],
                style: 'solid',
                outline: {
                  color: [234, 128, 252, 1],
                  width: 1
                }
              }
            },
            {
              value: 5,
              symbol: {
                type: 'simple-fill',
                color: [255, 138, 128, 0.5],
                style: 'solid',
                outline: {
                  color: [255, 138, 128, 1],
                  width: 1
                }
              }
            },
            {
              value: 6,
              symbol: {
                type: 'simple-fill',
                color: [100, 100, 100, 0.5],
                style: 'solid',
                outline: {
                  color: [100, 100, 100, 1],
                  width: 1
                }
              }
            }
            ]
          }
        }
      }
      window.bridge.Invoke(cmd)
    },
    registerSubwayLayer () {
      let dataCmd = {
        'name': 'SubwayLayer',
        'type': 'polygon',
        'mode': 'replace',
        'popupEnabled': false,
        'legendVisible': false,
        'isLocate': false,
        'data': {
          'content': [],
          'parsegeometry': 'function(item){return {rings:item.data.polygons[0].points}}'
        },
        labels: [{
          fields: [
            '#.name'
          ],
          color: [
            255,
            255,
            255,
            1
          ],
          size: 20,
          font: {
            family: 'fangsong',
            weight: 'normal'
          }
        }],
        'renderer': {
          'type': 'polygon-3d',
          'symbolLayers': [
            {
              'type': 'fill',
              'material': {
                'color': '#c7f0b3'
              }
            }
          ]
        }
      }
      this.subwayLayer = this.$_mapProxy.registerLayer('SubwayLayer', '单个撒点图层')
        .setParameters(dataCmd)
    },
    registerPointLayer () {
      // 地图撒点图层
      this.pointLayer = this.$_mapProxy.registerLayer('HeaderPointLayer', '单个撒点图层')
        .setParameters({
          'name': 'HeaderPointLayer',
          'type': 'point',
          'mode': 'replace',
          'data': {
            'content': [],
            'parsegeometry': 'function(item){return {x:item.lng, y:item.lat}}'
          },
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
    },
    registerPublicLayer () {
      this.publicDeviceLayer = this.$_mapProxy.registerLayer('publicDeviceLayer', '学校')
        .setParameters({
          'name': 'publicDeviceLayer',
          'type': 'point',
          'mode': 'replace',
          'data': {
            'content': [],
            'parsegeometry': 'function(item){return {x:item.lng, y:item.lat}}'
          },
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
    },
    registerShopLayer () {
      this.shopLayer = this.$_mapProxy.registerLayer('shopLayer', '沿街商铺餐饮户图层').setParameters({
        'name': 'shopLayer',
        'type': 'point',
        'mode': 'replace',
        'data': {
          'content': [],
          'parsegeometry': 'function(item){return {x:item.x, y:item.y}}'
        },
        'legendVisible': false,
        'popupEnabled': false,
        'isFiltered': false,
        'isLocate': false,
        'renderer': {
          'type': 'simple',
          symbol: {
            type: 'picture-marker',
            url: getUrl('/mapIcon/shop.png'),
            width: '57px',
            height: '50px'
          }
        }
      })
    },
    registerSingleBuildingLayer () {
      this.singleBuildingLayer = this.$_mapProxy.registerLayer('singleBuildingLayer', '单体建筑图层').setParameters({
        'name': 'singleBuildingLayer',
        'type': 'point',
        'mode': 'replace',
        'data': {
          'content': [],
          'parsegeometry': 'function(item){return {x:item.x, y:item.y}}'
        },
        'legendVisible': false,
        'popupEnabled': false,
        'isFiltered': false,
        'isLocate': false,
        'labels': [{
          fields: [
            '#.名称'
            // '#.count'
          ],
          color: [
            255,
            255,
            255,
            1
          ],
          size: 22,
          font: {
            family: 'fangsong',
            weight: 'normal'
          }
        }],
        'renderer': {
          'type': 'simple',
          symbol: {
            type: 'picture-marker',
            url: getUrl('/mapIcon/singleBuilding.png'),
            width: '57px',
            height: '50px'
          }
        }
      })
    },
    registerThingsPerceptionLayer () {
      this.thingsPerceptionLayer = this.$_mapProxy.registerLayer('thingsPerceptionLayer', '神经元图层').setParameters({
        'name': 'thingsPerceptionLayer',
        'type': 'point',
        'mode': 'replace',
        'data': {
          'content': [],
          'parsegeometry': 'function(item){return {x:item.lng, y:item.lat}}'
        },
        'legendVisible': false,
        'popupEnabled': false,
        'isFiltered': true,
        'isLocate': false,
        'renderer': {
          'type': 'simple',
          symbol: {
            type: 'picture-marker',
            url: getUrl('/mapIcon/neuron/WellCoverSensor.png'),
            width: '50px',
            height: '50px'
          }
        }
      })
    },
    createSingleBuildingMenu () {
      getSingleBuildingData().then(res => {
        let townSet = new Set()
        res.raw_data.forEach(e => {
          let lon = parseFloat(e.longitude)
          let lat = parseFloat(e.latitude)
          let coord = SHcoordinateUtils.GCJtoSH([lon, lat])
          e.x = coord[0]
          e.y = coord[1]
          townSet.add(e.street_name)
        })
        this.singleBuildingData = res.raw_data
        townSet.forEach(s => {
          let item = {
            name: s,
            nameKey: 'name',
            type: 'singleBuilding',
            checked: false
          }
          this.checkItems.area[2].children.push(item)
        })
      })
    },
    getShopListData () {
      getShopList().then(res => {
        let townSet = new Set()
        res.raw_data.forEach(e => {
          let lon = parseFloat(e.longitude)
          let lat = parseFloat(e.latitude)
          let coord = SHcoordinateUtils.GCJtoSH([lon, lat])
          e.x = coord[0]
          e.y = coord[1]
          townSet.add(e.street_name)
        })
        this.shopListData = res.raw_data
        townSet.forEach(s => {
          let item = {
            name: s,
            nameKey: 'name',
            type: 'shop',
            checked: false
          }
          this.checkItems.area[3].children.push(item)
        })
      })
    }
  },
  created () {
    this.registerSingleBuildingLayer()
    this.registerPointLayer()
    this.registerPublicLayer()
    this.registerThingsPerceptionLayer()
    this.registerShopLayer()
    this.registerSubwayLayer()

    this.createSingleBuildingMenu()
    this.getShopListData()
    getCodeNum().then(res => {
      const list = (res.data && res.data.agg) || []
      const obj = {}
      list.map(item => {
        obj[item.type] = item.count
      })
      if (obj['消火栓(专业)']) {
        obj['消火栓(专业)'] = (obj['消火栓(专业)'] || 0) + (obj['消火栓'] || 0)
      }
      delete obj['消火栓']
      const newArr = []
      for (let i in obj) {
        if (i != '消火栓') {
          newArr.push({
            type: i,
            total: obj[i]
          })
        }
      }
      this.codeList = newArr
    })
    getEventList().then(res => {
      this.eventListData = res.data.data_list.results
    })
    getOrgs().then(res => {
      this.organizationData = {
        '党群组织列表': res.data.filter(item => item.type === 'dqzz'),
        '党群人员统计': [],
        '民族宗教信息': res.data.filter(item => item.type === 'mzzj')
      }
    })
    let thing0 = []
    let thing1 = []
    let thing2 = []
    partClassData.list[0].subclass.forEach(e => {
      let item = {
        name: e.name,
        nameKey: 'name',
        checked: false,
        type: 'baseLayer'
      }
      thing0.push(item)
      // this.checkItems.thing[0].children.push(item)
    })
    this.thing0 = [...thing0]
    pipelineData.list[0].subclass.forEach(e => {
      let item = {
        name: e.name,
        nameKey: 'name',
        checked: false,
        type: 'baseLayer'
      }
      thing1.push(item)
      // this.checkItems.thing[1].children.push(item)
    })
    this.thing1 = thing1
    neuronData.forEach(e => {
      let item = {
        name: e.key,
        nameKey: 'name',
        checked: false,
        type: 'neuron'
      }
      this.neuronData = neuronData
      thing2.push(item)
      // this.checkItems.thing[2].children.push(item)
    })
    this.thing2 = [...thing2]
  },
  mounted () {
    this.$bus.$on('map-header-menu-choose', res => {
      console.log(res, 'res-----------------')
    })

    this.$bus.$on('map-header-item-choose', this.mapHeaderItemChoose)
  }
}
</script>
<style lang="scss" scoped>
  .MapTitleContainer {
    user-select: none;
    position: absolute;
    background-image: url(./img/MapBG.png);
    background-size: contain;
    // background-repeat:no-repeat;
    width: 100%;
    height: 3rem;
  }

  .tilte {
    user-select: none;
    position: relative;
    width: 100%;
    height: 1.5rem;
    line-height: 1.5rem;
    text-align: center;
    font-size: 0.96rem;
    color: #ffffff;
    font-weight: bold;

  }

  .map-tab {
    position: relative;

    margin: 0.23rem auto 0 auto;
    width: 85%;

  }
</style>
