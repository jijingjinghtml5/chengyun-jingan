<template>
  <div class="MapTitleContainer">
    <div class="tilte">上海市静安区城市运行管理平台</div>
    <div class="map-tab">
      <header-menu
        :mapControlItem="mapControlItem"
        :checkItems="checkItems"
        :mapControlItemData="mapControlItemData"
        :formatMethod="formatMethods"
      ></header-menu>
    </div>
  </div>
</template>
<script>
import HeaderMenu from "@/lib/MapHeader/HeaderMenu";
import { getCaseTownCount, getPeopleStatistic, getNeuronData } from "./api";
import { thousandCentimeter, getUrl } from "@/utils/tools";
import partClassData from "./data/partsClass";
import pipelineData from "./data/pipelineLength";
import neuronData from "./data/data";

export default {
  name: "MapTitle",
  components: {
    HeaderMenu

  },
  data() {
    return {
      formatMethods: {

      },
     mapControlItem: [
        { name: "人(万人)", iconClass: "icon-renqunjuji", attr: "people", isExpand: true, columns: 2, radio: true },
        { name: "地(个)", iconClass: "icon-bangonglouyu", attr: "area", isExpand: true, columns: 2 },
        { name: "物(台)", iconClass: "icon-wulianganzhi1", attr: "thing", isExpand: true, columns: 2, radio: true },
        { name: "事(个)", iconClass: "icon-jinriguanzhu", attr: "event", isExpand: true, radio: true, columns: 2 },
        { name: "情(件)", iconClass: "icon-wu", attr: "situation", isExpand: true, columns: 2, disable: true },
        { name: "组织(个)", iconClass: "icon-luchangzhi", attr: "organization", isExpand: true, radio: true, columns: 2, disable: true }
      ],
      mapControlItemData: {
        people: "820",
        area: "171",
        thing: "3433",
        event: "89",
        situation: "901",
        organization: "121"
      },
      checkItems: {
        people: [
              {
                name: "户籍人员",
                nameKey: "name",
                type: "people",
                checked: false
              },
              {
                name: "来沪人员",
                nameKey: "name",
                 type: "people",
                checked: false
              },
              {
                name: "境外人员",
                nameKey: "name",
                 type: "people",
                checked: false
              }
              // {
              //   name: "特殊人群",
              //   nameKey: "name",
              //   checked: false
              // }
        ],
        thing: [
          {
            name: "城市部件",
            nameKey: "name",
            children: [],
            childKey: "children"
          },
          {
            name: "地下管线",
            nameKey: "name",
            children: [],
            childKey: "children"
          },
          {
            name: "神经元传感器",
            nameKey: "name",
            // type: "neuron",
            children: [],
            childKey: "children"
          }
        ],
        area: [
              {
                name: "公共设施",
                nameKey: "name",
                children: [
                  {
                    name: "学校",
                    nameKey: "name",
                    type: "baseLayer",
                    checked: false
                  },
                  {
                    name: "医院",
                    nameKey: "name",
                    type: "baseLayer",
                    checked: false
                  },
                  {
                    name: "养老院",
                    nameKey: "name",
                    type: "baseLayer",
                    checked: false
                  }
                ],
                childKey: "children"
              },
              {
                name: "基础设施",
                nameKey: "name",
                children: [
                    {
                      name: "公共绿地",
                      nameKey: "name",
                      type: "baseLayer",
                      checked: false
                    },
                    {
                      name: "小区绿化",
                      nameKey: "name",
                      type: "baseLayer",
                      checked: false
                    },
                    {
                      name: "行道树",
                      nameKey: "name",
                      type: "baseLayer",
                      checked: false
                    },
                    {
                      name: "花架花钵",
                      nameKey: "name",
                      type: "baseLayer",
                      checked: false
                    },
                    {
                      name: "街头座椅",
                      nameKey: "name",
                      type: "baseLayer",
                      checked: false
                    },
                    {
                      name: "单位绿化",
                      nameKey: "name",
                      type: "baseLayer",
                      checked: false
                    },
                    {
                      name: "雕塑",
                      nameKey: "name",
                      type: "baseLayer",
                      checked: false
                    },
                    {
                      name: "河道绿化",
                      nameKey: "name",
                      type: "baseLayer",
                      checked: false
                    }
                ],
                childKey: "children"
              }
              // {
              //   name: "商业楼宇",
              //   nameKey: "name",
              //   checked: false
              // },
              // {
              //   name: "休闲购物广场",
              //   nameKey: "name",
              //   checked: false
              // }
        ],
        event: [
              {
                name: "主动发现",
                type: "event",
                nameKey: "name",
                checked: false
              },
              {
                name: "被动发现",
                 type: "event",
                nameKey: "name",
                checked: false
              },
              {
                name: "自动发现",
                 type: "event",
                nameKey: "name",
                checked: false
              }
        ],
        situation: [
              {
                name: "舆情",
                nameKey: "name",
                checked: false
              },
              {
                name: "火情",
                nameKey: "name",
                checked: false
              },
              {
                name: "警情",
                nameKey: "name",
                checked: false
              }
        ],
        organization: [
              {
                name: "工商组织",
                nameKey: "name",
                checked: false
              },
              {
                name: "公益组织",
                nameKey: "name",
                checked: false
              }
        ]
      }

    };
  },
  computed: {

  },
  methods: {
  mapHeaderItemChoose(data) {
    console.log(data, "mapHeaderItemChoose--------------");
    this.$_mapProxy.map._closePopup();
    this.$bus.$emit("map-close-model", {});
    this.$bus.$emit("map-full-extent", {});
    switch (data.item.type) {
      case "event":
        this.handlerEvent(data.item);
        break;
      case "people":
        this.handlerPeople(data.item);
        break;
      case "baseLayer":
        this.tabLayer(data.item.name, data.item.checked);
        break;
      case "neuron":
        this.handlerNeuron(data.item);
        break;
    }
  },
  handlerNeuron(item) {
    if (item.checked) {
      getNeuronData(item.name).then(res => {
              this.thingsPerceptionLayer.setParameters({
                "data": {
                  "content": res.data,
                  "parsegeometry": "function(item){return {x:item.lng, y:item.lat}}"
                }
              }).open();
      });
    } else {
        this.thingsPerceptionLayer.close();
    }
  },
  tabLayer(layerName, visible) {
      let cmd = {
        "ActionName": "LayerVisible",
        "Parameters": [
          {
            "name": layerName,
            "visible": visible,
            popupEnabled: false,
            legendVisible: false
          }
        ]
      };
     window.bridge.Invoke(cmd);
  },
  handlerPeople(item) {
    if (item.checked) {
      getPeopleStatistic(item.name).then(res => {
      let peopleTownData = [];
      res.data.forEach((e, i) => {
        let item = {};
        item.count = thousandCentimeter(e.count);
        item.name = e.town;
        item.typeValue = 4 - Math.ceil((i + 1) / 5);
        peopleTownData.push(item);
      });
      this.addTownPeople(peopleTownData);
    });
    } else {
      this.removeLayer("townPeopleLayer");
    }
  },
  handlerEvent(item) {
        if (item.checked) {
          getCaseTownCount("静安区", item.name).then(res => {
            if (res.data.length > 0) {
               this.addTownArea(this.classifyCase(res.data), "静安区");
            }
          });
        } else {
            this.removeLayer("townLayer");
            this.removeLayer("townCasePointLayer");
            this.removeLayer("townLocationLayer");
        }
     },
   removeLayer (layerName) {
      const commandParams = {
        ActionName: "doRemoveShowData",
        Parameters: JSON.stringify([
          layerName
        ])
      };
      window.bridge.Invoke(commandParams);
  },
  classifyCase (data) {
      const classifyData = [];
      data.forEach(d => {
        const item = {};
        item.name = d.areaName;
        const rate = d.value / d.total;
        if (rate === 0) {
          item.typeValue = 6;
        } else if (rate > 0 && rate < 0.6) {
          item.typeValue = 5;
        } else if (rate >= 0.6 && rate < 0.7) {
          item.typeValue = 4;
        } else if (rate >= 0.7 && rate < 0.8) {
          item.typeValue = 3;
        } else if (rate >= 0.8 && rate < 0.9) {
          item.typeValue = 2;
        } else {
          item.typeValue = 1;
        }
        classifyData.push(item);
      });
      return classifyData;
    },
      // 街镇案件分类图
    addTownArea (data, district, layerName, legendVisible) {
      let layerNameN = "townLayer";
      if (layerName) {
        layerNameN = layerName;
      }
      let legendVisibleBool = true;
      if (legendVisible) {
        legendVisibleBool = false;
      }
      const cmd = {
        ActionName: "ShowData",
        Parameters: {
          name: layerNameN,
          type: "layer",
          legendVisible: legendVisibleBool,
          popupEnabled: false,
          isLocate: true,
          data: {
            content: data,
            layers: {
              name: "街道乡镇",
              where: "所属区县='" + district + "'"
            },
            join: "街道名称=name"
          },
          labels: [
            {
              fields: [
                "#.街道名称"
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
                family: "fangsong",
                weight: "normal"
              }
            }
          ],
          renderer: {
            type: "unique-value",
            field: "typeValue",
            uniqueValueInfos: [
              {
                value: 1,
                label: "90%以上",
                symbol: {
                  type: "simple-fill",
                  color: [105, 240, 174, 0.5],
                  style: "solid",
                  outline: {
                    color: [105, 240, 174, 1],
                    width: 1
                  }
                }
              },
              {
                value: 2,
                label: "80% ~ 90%",
                symbol: {
                  type: "simple-fill",
                  color: [132, 255, 255, 0.5],
                  style: "solid",
                  outline: {
                    color: [132, 255, 255, 1],
                    width: 1
                  }
                }
              },
              {
                value: 3,
                label: "70% ~ 80%",
                symbol: {
                  type: "simple-fill",
                  color: [253, 204, 132, 0.5],
                  style: "solid",
                  outline: {
                    color: [253, 204, 132, 1],
                    width: 1
                  }
                }
              },
              {
                value: 4,
                label: "60% ~ 70%",
                symbol: {
                  type: "simple-fill",
                  color: [234, 128, 252, 0.5],
                  style: "solid",
                  outline: {
                    color: [234, 128, 252, 1],
                    width: 1
                  }
                }
              },
              {
                value: 5,
                label: "60%以下",
                symbol: {
                  type: "simple-fill",
                  color: [255, 138, 128, 0.5],
                  style: "solid",
                  outline: {
                    color: [255, 138, 128, 1],
                    width: 1
                  }
                }
              },
              {
                value: 6,
                label: "无结案",
                symbol: {
                  type: "simple-fill",
                  color: [100, 100, 100, 0.5],
                  style: "solid",
                  outline: {
                    color: [100, 100, 100, 1],
                    width: 1
                  }
                }
              }
            ]
          }
        }
      };
      window.bridge.Invoke(cmd);
    },
      // 街镇案件分类图
    addTownPeople (data) {
      const cmd = {
        ActionName: "ShowData",
        Parameters: {
          name: "townPeopleLayer",
          type: "layer",
          legendVisible: false,
          popupEnabled: false,
          isLocate: true,
          data: {
            content: data,
            layers: {
              name: "街道乡镇",
              where: "所属区县='静安区'"
            },
            join: "街道名称=name"
          },
          labels: [
            {
              fields: [
                "#.街道名称",
                 "#.count"
              ],
              color: [
                255,
                255,
                255,
                1
              ],
              size: 20,
              font: {
                family: "fangsong",
                weight: "normal"
              }
            }
          ],
          renderer: {
            type: "unique-value",
            field: "typeValue",
            uniqueValueInfos: [
              {
                value: 1,
                symbol: {
                  type: "simple-fill",
                  color: [105, 240, 174, 0.5],
                  style: "solid",
                  outline: {
                    color: [105, 240, 174, 1],
                    width: 1
                  }
                }
              },
              {
                value: 2,
                symbol: {
                  type: "simple-fill",
                  color: [132, 255, 255, 0.5],
                  style: "solid",
                  outline: {
                    color: [132, 255, 255, 1],
                    width: 1
                  }
                }
              },
              {
                value: 3,
                symbol: {
                  type: "simple-fill",
                  color: [253, 204, 132, 0.5],
                  style: "solid",
                  outline: {
                    color: [253, 204, 132, 1],
                    width: 1
                  }
                }
              },
              {
                value: 4,
                symbol: {
                  type: "simple-fill",
                  color: [234, 128, 252, 0.5],
                  style: "solid",
                  outline: {
                    color: [234, 128, 252, 1],
                    width: 1
                  }
                }
              },
              {
                value: 5,
                symbol: {
                  type: "simple-fill",
                  color: [255, 138, 128, 0.5],
                  style: "solid",
                  outline: {
                    color: [255, 138, 128, 1],
                    width: 1
                  }
                }
              },
              {
                value: 6,
                symbol: {
                  type: "simple-fill",
                  color: [100, 100, 100, 0.5],
                  style: "solid",
                  outline: {
                    color: [100, 100, 100, 1],
                    width: 1
                  }
                }
              }
            ]
          }
        }
      };
      window.bridge.Invoke(cmd);
    },
  registerPointLayer() {
      // 地图撒点图层
      this.pointLayer = this.$_mapProxy.registerLayer("HeaderPointLayer", "单个撒点图层")
      .setParameters({
        "name": "HeaderPointLayer",
        "type": "point",
        "mode": "replace",
        "data": {
          "content": [],
          "parsegeometry": "function(item){return {x:item.lng, y:item.lat}}"
        },
        "legendVisible": false,
        "popupEnabled": false,
        "isFiltered": true,
        "isLocate": false,
        "renderer": {
          type: "simple",
          symbol: {
            type: "simple-marker",
            size: 20,
            color: [0, 255, 244],
            outline: {
              color: "#ffffff",
              width: "1px"
            }
          }
        }
      });
     },
    registerThingsPerceptionLayer() {
    this.thingsPerceptionLayer = this.$_mapProxy.registerLayer("thingsPerceptionLayer", "神经元图层").setParameters({
      "name": "thingsPerceptionLayer",
      "type": "point",
      "mode": "replace",
      "data": {
        "content": [],
        "parsegeometry": "function(item){return {x:item.lng, y:item.lat}}"
      },
      "legendVisible": false,
      "popupEnabled": false,
      "isFiltered": true,
      "isLocate": false,
      "renderer": {
          "type": "simple",
           symbol: {
            type: "picture-marker",
            url: getUrl("/mapIcon/neuron/WellCoverSensor.png"),
            width: "50px",
            height: "50px"
           }
        }
      });
     }
  },
  created() {
    this.registerPointLayer();
    this.registerThingsPerceptionLayer();
    partClassData.list[0].subclass.forEach(e => {
      let item = {
        name: e.name,
        nameKey: "name",
        checked: false,
        type: "baseLayer"
      };
      this.checkItems.thing[0].children.push(item);
    });
    pipelineData.list[0].subclass.forEach(e => {
      let item = {
        name: e.name,
        nameKey: "name",
        checked: false,
        type: "baseLayer"
      };
      this.checkItems.thing[1].children.push(item);
    });
    neuronData.forEach(e => {
        let item = {
        name: e.key,
        nameKey: "name",
        checked: false,
        type: "neuron"
      };
      this.checkItems.thing[2].children.push(item);
    });
  },
  mounted() {
      this.$bus.$on("map-header-menu-choose", res => {
        console.log(res, "res-----------------");
      });

      this.$bus.$on("map-header-item-choose", this.mapHeaderItemChoose);
   }

};
</script>
<style lang="scss" scoped>
.MapTitleContainer {
  user-select: none;
  position: absolute;
  background-image:url(./img/MapBG.png);
  background-size: contain;
  // background-repeat:no-repeat;
  width: 100%;
  height:  3rem;
}
.tilte {
  user-select: none;
  position: relative;
  width: 100%;
  height:  1.5rem;
  line-height: 1.5rem;
  text-align: center;
  font-size: 0.96rem;
  color: #ffffff;
  font-weight: bold;

}
.map-tab{
  position: relative;

  margin: 0.23rem auto 0 auto;
  width: 85%;

}
</style>
