<template>
  <span class="m-iframe-btn" @click="handleClick">
    <slot></slot>
    <transition name="fade">
      <div
        v-show="iframeShow"
        class="m-iframe-popup"
        :id="domId"
        :ref="domId"
        :style="iframeStyle"
      >
        <div
          class="m-iframe-popup__close"
          v-if="closeShow"
          @click="handleClose"
        >
          <template v-if="$slots.closeIcon">
            <slot name="closeIcon"></slot>
          </template>
          <span v-else> {{ "[" + closeText + "]" }}</span>
        </div>
        <iframe-container
          v-if="iframeUrl"
          :iframeSrc="iframeUrl"
        ></iframe-container>
      </div>
    </transition>
  </span>
</template>
<script>
import iframeContainer from "@/components/IframeContainer";
import { nextZIndex } from "@/utils/popup.js";
let uuid = 0;
export default {
  name: "MIframe",
  data() {
    return {
      iframeShow: false,
      iframeUrl: "",
      id: ++uuid,
      zIndex: nextZIndex(),
      hasAppendDom: false
    };
  },
  components: {
    iframeContainer
  },
  props: {
    url: {
      type: String,
      default: ""
    },
    extraCss: {
      type: Object,
      default: null
    },
    params: {
      type: Object,
      default: () => {}
    },
    closeShow: {
      type: Boolean,
      default: true
    },
    closeText: {
      type: String,
      default: "[返回]"
    },
    appendDom: {
      type: String,
      default: "body"
    }
  },
  computed: {
    domId() {
      return `m-iframe-popup-${this.id}`;
    },
    iframeStyle() {
      return {
        zIndex: this.zIndex,
        ...(this.extraCss || {})
      };
    },
    iframeConfig() {
      return {
        id: this.id,
        url: this.url,
        style: this.extraCss || {},
        params: this.params || {}
      };
    }
  },
  watch: {},
  methods: {
    handleClose() {
      this.iframeShow = false;
      this.iframeUrl = "";
      this.emit(0);
    },
    handleClick() {
      if (!this.url) return false;
      if (!this.hasAppendDom) {
        this.hasAppendDom = true;
        this.addDocumentBody();
      }
      ++uuid;
      this.zIndex = nextZIndex();
      this.iframeShow = true;
      this.iframeUrl = this.url;
      this.emit(1);
    },
    addDocumentBody() {
      if (!this.$refs[this.domId]) return false;
      let domParent = document.querySelector(this.appendDom);
      domParent.appendChild(this.$refs[this.domId]);
      this.$once("hook:beforeDestroy", () => {
        if (this.$refs[this.domId]) {
          domParent.removeChild(this.$refs[this.domId]);
          domParent = null;
        }
      });
    },
    emit(status) {
      let obj = {
        status,
        data: this.iframeConfig
      };
      this.$emit("iframeStatusChange", obj);
      this.$bus && this.$bus.$emit("iframeStatusChange", obj);
    }
  },
  mounted() {}
};
</script>
<style lang="scss" scoped>
.m-iframe-btn {
  cursor: pointer;
}
.m-iframe-popup {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  pointer-events: auto;
  // background: #000;
}
.m-iframe-popup__close {
  position: absolute;
  right: 1.6rem;
  top: 0.2rem;
  font-size: 0.32rem;
  line-height: 0.44rem;
  color: #2073f8;
  width: 1rem;
  height: 1rem;
  background: rgba(253, 252, 252, 0.7);
  cursor: pointer;
  z-index: 2;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.m-iframe-popup__wrap {
  position: relative;
  width: 100%;
  height: 100%;
  z-index: 1;
}
.iframe-container {
  z-index: 1;
}
</style>
