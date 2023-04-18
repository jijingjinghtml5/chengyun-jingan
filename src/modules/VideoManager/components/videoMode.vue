<template>
  <div ref='videoContainer' class="videoContainer">
    <grid-layout v-if="configData" class="gridLayout"
        ref="gridLayout"
        v-bind="configData"
        :is-draggable="false"
        :is-resizable="false"
        :is-mirrored="false"
        :vertical-compact="true"
        :use-css-transforms="false"
    >
      <grid-item class="gridItem"
          v-for="(item,index) in configData.layout"
          :x="item.x"
          :y="item.y"
          :w="item.w"
          :h="item.h"
          :i="item.i"
          :key="index">
        <component :is="'qv-player'" :videoConfig="videos[index]" @reLoading="handleReloading(index,...arguments)" :cancelTokenKey="'getVideoRealUrl-HOC-' + index"/>
      </grid-item>
    </grid-layout>
  </div>
</template>
<script>
import qvPlayer from "@/components/Video/qvPlayer";
import VueGridLayout from "vue-grid-layout";
import { transferAndSendForVideo } from "../hoc.js";


const qv = transferAndSendForVideo(qvPlayer);
// 单个策略组的播放
export default {
  name: "VideoMode",
  inject: ["createFnForCalcRealPx"],
  components: {
    gridLayout: VueGridLayout.GridLayout,
    gridItem: VueGridLayout.GridItem,
    qvPlayer: qv
  },
  props: {
    config: {
      type: Object,
      default: null
    },
    videos: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  watch: {
    config: {
      handler(nv) {
        this.$nextTick(() => {
          this.caculateConfig();
        });
      }
    }
  },
  data() {
    return {
      configData: {
        layout: []
      }
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.caculateConfig();
    });
  },
  methods: {
    caculateConfig() {
      if (!this.config) return false;
      // // 测试
      // this.config.layout = [
      //   { x: 0, y: 0, w: 48, h: 10, i: 0, moved: false },
      //   { x: 0, y: 10, w: 24, h: 10, i: 1, moved: false },
      //   { x: 24, y: 10, w: 24, h: 10, i: 2, moved: false },
      //   { x: 0, y: 20, w: 48, h: 10, i: 3, moved: false }
      // ];

      const layout = this.config.layout;
      const height = this.$refs["videoContainer"].clientHeight;
      const maxH = layout.reduce((r, d) => {
        const sum = d.y + d.h;
        r = r > sum ? r : sum;
        return r;
      }, 0);

      this.configData = {
        colNum: this.config.colNum,
        margin: [this.config.marginHorizontal, this.config.marginVertical],
        rowHeight: Math.max(0, (height - (maxH + 1) * this.config.marginVertical) / maxH),
        layout: this.config.layout
      };
      // console.log("videoMode config", this.configData);
    },
    handleReloading(index, videoSrc) {
      this.videos.splice(index, 1, { ...this.videos[index] });
    }
  }
};
</script>

<style lang="scss" scoped>
.videoContainer {
  width: 100%;
  height: 100%;

  .gridLayout{
    position: relative;
    width: 100%;
    height: 100%;

    .gridItem{
      border: 0.02rem solid #4e78a4;
      box-sizing: border-box;

      .switchVideo {
        position: absolute;
        cursor: pointer;
        top: 0;
        right: 0;
        left: 0;
        bottom: 0;
        z-index: 10;
      }
    }
  }
}

.vue-grid-item{
  transition: none;
}
</style>
