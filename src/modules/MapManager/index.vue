<template>
  <div class="MapContainer" id="MapContainer" @click.stop @mousedown.stop>
    <maptitle></maptitle>
    <citymap ref='Map'></citymap>
    <maptool></maptool>
    <videomap></videomap>
        <!---左侧通用弹窗容器-->
    <popup-container :mapData="popupMapData" :componentName="popupComponentName" :popupBool.sync="popupBool" @closePopup='_closePopup'
    :stylePopup='stylePopup' ></popup-container>
  </div>
</template>
<script>
import popupContainer from "@/components/popups/popupContainer.vue";
import citymap from "@/components/citymap";
import maptitle from "./components/MapTitle";
import maptool from "./components/MapTool";
import videomap from "./components/video";
import { thousandCentimeter } from "@/utils/tools";
import { getCaseTownList } from "./api";
export default {
  name: "MapManager",
  data() {
    return {
      // 弹窗

      stylePopup: {
         left: "10px",
         top: "300px"
      },
      popupMapData: {},
      popupComponentName: "",
      popupBool: false

    };
  },
  components: {
    maptitle,
    citymap,
    maptool,
    videomap,
    popupContainer

  },
  computed: {
  },
  methods: {
        // 打开弹窗
    _openPopup(type, data) {
      switch (type) {
        case "video":
          this.videoShow = true;
          this.videoData = data;
          break;
        default:
          this.popupBool = true;
          this.popupComponentName = type;
          this.popupMapData = data;
      }
    },
    // 关闭左侧弹窗
    _closePopup() {
    //   console.log('close popup')
     //  this.addComuteingRoute([], "delete");
      this.popupBool = false;
    },
        // 街镇案件点
    addTownCasePoint (data) {
      const dataCmd = {
        name: "townCasePointLayer",
        type: "point",
        mode: "replace",
        data: {
          content: data,
          parsegeometry: "function(item){return {x:item.lng, y:item.lat}}"
        },
        legendVisible: false,
        popupEnabled: false,
        isFiltered: false,
        isLocate: false,
        renderer: {
          type: "simple",
          label: "案件点",
          symbol: {
            type: "picture-marker",
            url: this.rootUrl + "mapIcon/case.png",
            width: "48px",
            height: "65px"
          }
        }
      };
      const commandParams = {
        ActionName: "ShowData",
        Parameters: JSON.stringify(dataCmd)
      };
      window.bridge.Invoke(commandParams);
    },

    mapClickHandle (data) {
      console.log(data, "data-------------");
      if (data.townLayer) {
        getCaseTownList(data.townLayer[0].name).then(res => {
          this.addTownCasePoint(res.data);
          this.goToTown(data.townLayer[0].name);
          setTimeout(() => {
            this.removeLayer("townLayer");
          }, 1500);
        });
      }
      if (data.townCasePointLayer) {
        this._openPopup("case", {
          caseId_: data.townCasePointLayer[0].id,
          caseDefaultInfo_: data.townCasePointLayer[0]
        });
       }
      },
      goToTown (name) {
      const cmd = {
        name: "townLocationLayer",
        type: "layer",
        isLocate: true,
        legendVisible: false,
        popupEnabled: false,
        data: {
          layers: {
            name: "街道乡镇",
            where: "街道名称='" + name + "'"
          }
        },
        labels: [
          {
            fields: [
              "#.街道名称"
            ],
            color: [
              255,
              255,
              255,
              1
            ],
            size: 36,
            font: {
              family: "fangsong",
              weight: "bold"
            }
          }
        ],
        renderer: {
          type: "simple",
          symbol: {
            type: "line-3d",
            label: "街道",
            symbolLayers: [
              {
                type: "line",
                size: 5,
                material: {
                  color: [0, 255, 255, 1]
                }
              }
            ]
          }
        }
      };
      const commandParams = {
        ActionName: "ShowData",
        Parameters: JSON.stringify(cmd)
      };
      window.bridge.Invoke(commandParams);
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
    onMapReady() {

    }

  },
  created() {
    const urlString = window.location.href;
    let subIndex = urlString.lastIndexOf(".html");
    const urlStringSub = urlString.substring(0, subIndex + 1);
    subIndex = urlStringSub.lastIndexOf("/");
    this.rootUrl = urlStringSub.substring(0, subIndex + 1);
  },
  mounted() {
    // 地图点击事件
    this.$bus.$on("citymap-click", this.mapClickHandle);
    // 地图加载完毕
    this.$bus.$on("citymap-ready", this.onMapReady);
    // 注册地图代理组件
    this.$_mapProxy.setMap(this);
  }
};
</script>
<style lang="scss" scoped>
.MapContainer {
  position: relative;
  // border: 0.02rem solid #4e78a4;
  width: 100%;
  height: 100%;
}

</style>
