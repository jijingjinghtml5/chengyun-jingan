<template>
<div class="main-body">
  <div
    class="layout"
    v-if="config"
    :style="{
      width: `${config.width}px`,
      height: `${config.height}px`
    }">
    <grid-layout
      :layout.sync="config.layout"
      :is-draggable="false"
      :is-resizable="false"
      :autoSize="false"
      :is-mirrored="false"
      :vertical-compact="true"
      :use-css-transforms="false"
      v-bind="config.settings"
    >
      <grid-item
        v-for="item in config.layout"
        :x="item.x"
        :y="item.y"
        :w="item.w"
        :h="item.h"
        :i="item.i"
        :key="item.i"
      >
        <component
          :is="item.component || ''"
          :data="data||{}"
        ></component>
      </grid-item>
    </grid-layout>
    <popup-iframe></popup-iframe>
  </div>
</div>

</template>
<script>
import VueGridLayout from "vue-grid-layout";
import LeftHeader from "@/modules/LeftHeader";
import Overview from "@/modules/Overview";
import UrbanSecurity from "@/modules/UrbanSecurity";

import { getLayoutConfig } from "@/http/api/index";
import { setCode } from "@/utils/code";
import { getParams } from "@/utils/";

export default {
  name: "Layout",
  data() {
    return {
      designWidth: (window.$config && window.$config.designWidth) || 7680,
      config: null,
      htmlFontSize: null,
      data: {},
      globalConfig: {},
      displayScreenSlider: false,
      urlParams: getParams() || {},
      chosenScreenUrl: undefined,
      gridCodeMapping: {},
      client: null
    };
  },
  components: {
    GridLayout: VueGridLayout.GridLayout,
    GridItem: VueGridLayout.GridItem,
    MapManager: () => import("@/modules/MapManager"),
    TodayFocus: () => import("@/modules/TodayFocus"),
    RiskAlert: () => import("@/modules/RiskAlert"),
    LeftHeader,
    Overview,
    UrbanSecurity,
    test: () => import("@/modules/test")
  },
  provide() {
    return {
      createFnForCalcRealPx: this.createFnForCalcRealPx,
      gridCodeMapping: this.gridCodeMapping,
      getGlobalConfig: () => this.globalConfig,
      getClient: () => this.client
    };
  },
  methods: {
    // 初始化Html fontsize
    initHtmlFontSize(config) {
      let { width } = config;
      if (width && this.designWidth) {
        let htmlFontSize = (100 * width) / this.designWidth;
        this.htmlFontSize = htmlFontSize;
        document.documentElement.style.fontSize = htmlFontSize + "px";
        this.$once("hook:beforeDestroy", () => {
          document.documentElement.style.fontSize = null;
        });
      }
    },
    // 提供rem转px
    createFnForCalcRealPx(rem) {
      let r = parseFloat(rem || 0);
      if (this.htmlFontSize !== null && r) {
        return r * this.htmlFontSize;
      } else {
        return rem;
      }
    },
    // 获取布局数据
    async getLayoutConfig() {
      let code = this.urlParams["code"] || "";
      let token = this.urlParams["token"] || "";
      if (!code && !token) {
        window.location.href = window.$config.noAuthPage;
        return;
      }
      setCode(code);
      try {
        let apiRes = await getLayoutConfig(token);
        this.globalConfig = {
          ...(apiRes || {})
        };
        setCode(this.globalConfig.screenConfig.uuid);
        let config = {
          width: 7680,
          height: 2160,
          settings: {
            colNum: 48,
            margin: [20, 20],
            rowHeight: 0
          },
          layout: [
            {
              x: 0,
              y: 0,
              w: 15,
              h: 8,
              i: 1,
              component: "LeftHeader",
              moved: false
            },
            {
              x: 33,
              y: 0,
              w: 15,
              h: 8,
              i: 3,
              component: "test",
              moved: false
            },
            {
              x: 15,
              y: 0,
              w: 18,
              h: 94,
              i: 2,
              component: "MapManager",
              moved: false
            },

            {
              x: 0,
              y: 8,
              w: 15,
              h: 18,
              i: 11,
              component: "Overview",
              moved: false
            },
            {
              x: 0,
              y: 26,
              w: 15,
              h: 19,
              i: 12,
              component: "UrbanSecurity",
              moved: false
            },
            {
              x: 0,
              y: 45,
              w: 5,
              h: 62,
              i: 131,
              component: "test",
              moved: false
            },
            {
              x: 5,
              y: 45,
              w: 5,
              h: 62,
              i: 132,
              component: "test",
              moved: false
            },
            {
              x: 10,
              y: 45,
              w: 5,
              h: 62,
              i: 133,
              component: "test",
              moved: false
            },

            {
              x: 15,
              y: 94,
              w: 18,
              h: 13,
              i: 21,
              component: "test",
              moved: false
            },

            {
              x: 33,
              y: 8,
              w: 8,
              h: 59,
              i: 31,
              component: "TodayFocus",
              moved: false
            },
            {
              x: 33,
              y: 68,
              w: 8,
              h: 40,
              i: 32,
              component: "RiskAlert",
              moved: false
            },
            {
              x: 41,
              y: 68,
              w: 7,
              h: 99,
              i: 33,
              component: "test",
              moved: false
            }
          ]
        };
        this.initHtmlFontSize(config);
        this.config = Object.assign({}, config);
      } catch (error) {
        console.log(error);
      }
    }
  },
  created() {
    this.getLayoutConfig();
  }
};
</script>
<style lang="scss" scoped>
.layout {
  position: relative;
  overflow: hidden;
  > .vue-grid-layout {
    width: 100%;
    height: 100%;
    background: #0a1b21;
    z-index: 10;
    .vue-grid-item {
      transition: none;
      background-color: transparent;
      box-sizing: border-box;
    }
  }
}
</style>
