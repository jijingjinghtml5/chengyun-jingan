<template>
  <transition name="fade">
    <div
      v-show="dialogVisible"
      class="m-dialog-popup"
      :id="domId"
      :ref="domId"
      :style="dialogStyle"
      >
      <slot name="close" v-if="closeShow">
        <div class="m-dialog-popup__close" @click="handleClose">
          <span class="iconfont icon-close"></span>
        </div>
      </slot>
      <div class="m-dialog-popup__content">
        <slot></slot>
      </div>
    </div>
  </transition>
</template>
<script>
import { nextZIndex } from "@/utils/popup.js";
let uuid = 0;
export default {
  name: "MDialog",
  data() {
    return {
      id: ++uuid,
      zIndex: nextZIndex(),
      hasAppendDom: false
    };
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
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
    appendDom: {
      type: String,
      default: ""
    },
    isAppendDom: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    dialogVisible: {
      handler() {
        this.toggleDialog();
      }
    }
  },
  computed: {
    domId() {
      return `m-dialog-popup-${this.id}`;
    },
    domObj() {
      return this.$refs[this.domId];
    },
    dialogStyle() {
      return {
        zIndex: this.zIndex,
        ...(this.extraCss || {})
      };
    }
  },
  methods: {
    handleClose() {
      this.$emit("update:dialogVisible", false);
      this.$emit("close");
    },
    handleClick() {
      if (!this.hasAppendDom) {
        this.hasAppendDom = true;
        this.addDocumentBody();
      }
      this.zIndex = nextZIndex();
    },
    toggleDialog() {
      !this.hasAppendDom && this.addDocumentBody();
    },
    addDocumentBody() {
      if (!this.domObj || this.hasAppendDom || !this.isAppendDom) return false;
      this.hasAppendDom = true;
      let domParent = (this.appendDom && document.querySelector(this.appendDom)) || document.body;
      domParent.appendChild(this.domObj);
      this.$once("hook:beforeDestroy", () => {
        if (this.domObj && domParent && domParent.contains(this.domObj)) {
          domParent.removeChild(this.domObj);
        }
        domParent = null;
      });
    }
  },
  mounted() {
    this.dialogVisible && this.addDocumentBody();
  }
};
</script>
<style lang="scss" scoped>
.m-dialog-popup {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  pointer-events: auto;
}
.m-dialog-popup__close {
  position: absolute;
  width: 0.6rem;
  height: 0.6rem;
  right: 0.2rem;
  top: 0.2rem;
  font-size: 0.36rem;
  line-height: 1;
  color: #92b9f7;
  cursor: pointer;
  z-index: 10000;
  .iconfont {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
.m-dialog-popup__content {
  z-index: 1;
  height: 100%;
}
</style>
