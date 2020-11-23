<template>
  <div ref='videoContainer' class="videoContainer">
    <grid-layout v-if="config" class="gridLayout"
        ref="gridLayout"
        v-bind="configData"
        :layout="layout"
        :is-draggable="false"
        :is-resizable="false"
        :is-mirrored="false"
        :vertical-compact="true"
        :use-css-transforms="false"
    >
      <grid-item class="gridItem"
          v-for="(item,index) in layout"
          :x="item.x"
          :y="item.y"
          :w="item.w"
          :h="item.h"
          :i="item.i"
          :key="videos[index]? videos[index].id :index">
        <component :is="videos[index] && videos[index].player || 'qv-player'" :videoSrc="videos[index]"/>

      </grid-item>
    </grid-layout>
  </div>
</template>
<script>
import qvPlayer from "@/components/Video/qvPlayer";
import VueGridLayout from "vue-grid-layout";

// 单个策略组的播放
export default {
  name: "VideoMode",
  inject: ["createFnForCalcRealPx"],
  components: {
    gridLayout: VueGridLayout.GridLayout,
    gridItem: VueGridLayout.GridItem,
    qvPlayer
  },
  props: {
    config: {
      type: Object || null,
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
        this.caculateConfig();
      }
    }
  },
  data() {
    return {
      configData: {
        colNum: 48,
        rowHeight: 10,
        margin: [10, 10]
      },
      layout: []
    };
  },
  mounted() {
    this.caculateConfig();
  },
  methods: {
    caculateConfig() {
      this.configData = null;
      this.layout = this.config.layout;

      // const height = this.createFnForCalcRealPx(this.$refs["videoContainer"].getBoundingClientRect().height / 100 + "rem");
      const height = this.createFnForCalcRealPx(this.$refs["videoContainer"].clientHeight / 100 + "rem");

      const marginX = this.createFnForCalcRealPx(this.config.config.marginVertical / 100 + "rem");
      const marginY = this.createFnForCalcRealPx(this.config.config.marginHorizontal / 100 + "rem");

      let maxH = 0;
      this.layout.map(d => {
        let h = d.y + d.h;
        maxH = maxH > h ? maxH : h;
      });

      this.configData = {
        colNum: this.config.config.colNum,
        rowHeight: (height - (maxH + 1) * marginY) / maxH,
        margin: [marginX, marginY]
      };
    },
    videoChange (src, i) {
      if (src === null) return;
      if (i > 0) {
        let firstArr = this.videos.splice(0, 1, src);
        this.videos.splice(i, 1, firstArr[0]);
      }
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
