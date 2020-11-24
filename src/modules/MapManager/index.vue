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
    mapClickHandle(data) {
      if (data["HeaderPointLayer"]) {
                      this._openPopup("case", {
                  caseId_: "f59f10535b7134eb6367740cbbb62a04",
                  caseDefaultInfo_: {}
                });
      }
    },
    onMapReady() {
      // console.log("map finish -----------------------------");
      // let position = {
      //     "ActionName": "goToPosition",
      //     "Parameters": {
      //       "positon": {
      //         "x": -1733,
      //         "y": -917,
      //         "z": 0
      //       },
      //       "heading": 19,
      //       "tilt": 63,
      //       "hasImg": false,
      //       "zoom": 10,
      //       "isRotation360": false
      //     }
      //   };
      //   window.bridge.Invoke(position);
    }

  },
  create() {

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
