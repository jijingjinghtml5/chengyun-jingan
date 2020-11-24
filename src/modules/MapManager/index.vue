<template>
  <div class="MapContainer" id="MapContainer" @click.stop @mousedown.stop>
    <maptitle></maptitle>
    <citymap ref='Map'></citymap>
    <maptool></maptool>
    <videomap></videomap>
  </div>
</template>
<script>
import citymap from "@/components/citymap";
import maptitle from "./components/MapTitle";
import maptool from "./components/MapTool";
import videomap from "./components/video";
export default {
  name: "MapManager",
  data() {
    return {

    };
  },
  components: {
    maptitle,
    citymap,
    maptool,
    videomap

  },
  computed: {
  },
  methods: {
    mapClickHandle(data) {

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
