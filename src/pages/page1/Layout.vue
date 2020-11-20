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
import Vue from "vue";
import VueGridLayout from "vue-grid-layout";

import { getLayoutConfig } from "@/http/api/index";
import { setCode } from "@/utils/code";
import { getParams, asyncLoadScripts } from "@/utils/";

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
    GridItem: VueGridLayout.GridItem
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
        let layoutConfig = apiRes.layoutConfig;
        this.initHtmlFontSize(layoutConfig);
        this.initGridCodeMapping(apiRes.gridCenters);
        this.config = Object.assign({}, layoutConfig);
      } catch (error) {
        console.log(error);
      }
    },
    initGridCodeMapping(grids) {
      (grids || []).reduce((mapping, item) => {
        if (item.code) {
          mapping[item.code] = item;
        }
        return mapping;
      }, this.gridCodeMapping);
    }
  },
  created() {
    this.getLayoutConfig();
  },
  mounted() {

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
