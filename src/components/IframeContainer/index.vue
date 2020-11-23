<template>
  <div class="iframe-container">
    <div class="iframe-loading" v-show="loading">
      <p>{{ loadingMsg }}</p>
    </div>
    <div class="iframe-error" v-show="error">
      <p>{{ errorMsg }}</p>
    </div>
    <div class="iframe-no-url" v-show="!iframeSrc">
      <p>{{ noDataMsg }}</p>
    </div>
    <div class="iframe-wrap" ref="wrap"></div>
  </div>
</template>
<script>
export default {
  name: "iframeContainer",
  data() {
    return {
      timer: null,
      loading: false,
      error: false,
      iframe: null
    };
  },
  props: {
    iframeSrc: {
      type: String,
      default: ""
    },
    delay: {
      type: [String, Number],
      default: 500
    },
    loadingMsg: {
      type: String,
      default: "加载中..."
    },
    errorMsg: {
      type: String,
      default: "加载失败"
    },
    noDataMsg: {
      type: String,
      default: "等待数据接入"
    }
  },
  watch: {
    iframeSrc: {
      handler() {
        this.init();
      }
    }
  },
  methods: {
    init() {
      this.clear();
      this.error = false;
      this.timer = setTimeout(() => {
        this.loadIframe();
      }, parseInt(this.delay));
    },
    loadIframe() {
      if (!this.iframeSrc || !this.$refs["wrap"]) return false;
      this.loading = true;
      this.iframe = document.createElement("iframe");
      this.iframe.onload = e => {
        this.loading = false;
      };
      this.iframe.scrolling = "no";
      // this.iframe.frameborder = "0";
      // frameborder="0"
      this.iframe.setAttribute("frameborder", "0");
      this.iframe.width = "100%";
      this.iframe.height = "100%";
      this.iframe.src = this.iframeSrc;
      this.$refs["wrap"].appendChild(this.iframe);
    },
    clear() {
      this.timer && clearTimeout(this.timer);
      this.iframe && this.$refs["wrap"].removeChild(this.iframe);
      this.iframe = null;
    }
  },
  beforeDestroy() {
    this.clear();
  },
  mounted() {
    this.loadIframe();
  }
};
</script>
<style lang="scss" scoped>
.iframe-container{
  position: relative;
  height: 100%;
  .iframe-wrap {
    position: relative;
    width: 100%;
    height: 100%;
  }
  .iframe-loading, .iframe-error, .iframe-no-url {
    display: table;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #000;
    font-size: 0.36rem;
    color: #fff;
    line-height: 0.48rem;
    text-align: center;
    z-index: 2;
    p {
      display: table-cell;
      vertical-align: middle;
    }
  }
  iframe {
    width: 100%;
    height: 100%;
    border: 0;
  }

}
</style>
