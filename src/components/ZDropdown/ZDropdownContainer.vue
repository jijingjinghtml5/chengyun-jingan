<template>
  <span class="placeholder" ref="placeholder">
    <transition name="fade" @after-leave="resetPosition">
      <div v-if="lazy" v-show="visible" class="z-dropdown" :class="popupClass" ref="dropdown" v-clickOutSide="hide">
        <scroll-bar>
          <slot>
            <p class="no-data">暂无数据</p>
          </slot>
        </scroll-bar>
      </div>
    </transition>
  </span>
</template>
<script>
import { getBoundingClientRect, getStyleComputedProperty } from "@/utils/dom";
import ScrollBar from "@/components/ScrollBar-px";
import { nextZIndex } from "@/utils/popup";
import clickOutSide from "@/directives/clickOutSide";
export default {
  name: "ZDropdownContainer",
  data() {
    return {
      lazy: false,
      dropdown: null,
      timer: null,
      timer2: null
    };
  },
  components: {
    ScrollBar
  },
  directives: {
    clickOutSide
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    currentTarget: {
      default: null
    },
    popupClass: {
      type: String,
      default: ""
    },
    isResetForScrollAndResize: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    visible: {
      handler(nv) {
        if (nv) {
          this.show();
        }
      }
    }
  },
  methods: {
    async appendToBody() {
      return new Promise((resolve) => {
        this.$nextTick(() => {
          this.dropdown = this.$refs.dropdown;
          document.body.appendChild(this.dropdown);
          this.startEventListeners();
          this.$once("hook:beforeDestroy", () => {
            document.body.removeChild(this.dropdown);
          });
          resolve();
        });
      });
    },
    async show() {
      if (!this.currentTarget || !this.visible) return false;
      if (!this.lazy) {
        this.lazy = true;
        await this.appendToBody();
      }
      this.setPosition();
    },
    hide(e) {
      if (!this.currentTarget || !this.visible) return false;
      if (!e || !this.currentTarget.contains(e.target)) {
        this.$emit("update:currentTarget", null);
        this.$emit("update:visible", false);
      }
    },
    setPosition(scroll = false) {
      if (!this.visible) return false;
      this.resetPosition();
      this.$nextTick(() => {
        let linkPosition = getBoundingClientRect(this.currentTarget);
        let dropdownPosition = getBoundingClientRect(this.dropdown);
        let styles = getStyleComputedProperty(this.dropdown);

        // 计算下拉框包含margin 的实际宽高
        dropdownPosition.width += parseInt(styles.marginLeft) + parseInt(styles.marginRight);
        dropdownPosition.height += parseInt(styles.marginTop) + parseInt(styles.marginBottom);

        let bodyHeight = Math.max(document.documentElement.clientHeight, document.body.clientHeight, document.documentElement.scrollHeight, document.body.scrollHeight);
        let bodyWidth = Math.max(document.documentElement.clientWidth, document.body.clientWidth, document.documentElement.scrollWidth, document.body.scrollWidth);
        let clientWidth = Math.max(document.documentElement.clientWidth, document.body.clientWidth);
        let top = 0;
        let left = 0;
        let minWidth = 0;
        let height = 0;
        let arrowPlacement = ["top", "end"];

        // 下拉框最小宽度
        if (dropdownPosition.width - linkPosition.width < 0) {
          dropdownPosition.width = linkPosition.width;
          minWidth = linkPosition.width;
        } else if (dropdownPosition.width - linkPosition.width > 0 && bodyWidth > clientWidth) {
          minWidth = Math.min(dropdownPosition.width, clientWidth);
        }

        // top距离
        if (linkPosition.docTop + linkPosition.height + dropdownPosition.height <= bodyHeight) {
          top = linkPosition.docTop + linkPosition.height;
        } else if (linkPosition.docTop > dropdownPosition.height) {
          top = linkPosition.docTop - dropdownPosition.height;
          arrowPlacement[0] = "bottom";
        } else {
          top = linkPosition.docTop + linkPosition.height;
          height = bodyHeight - linkPosition.docTop - linkPosition.height;
        }

        // left 距离
        if (linkPosition.docLeft + linkPosition.width >= dropdownPosition.width) {
          left = linkPosition.docLeft + linkPosition.width - dropdownPosition.width;
        } else {
          left = bodyWidth - linkPosition.docLeft > dropdownPosition.width ? linkPosition.docLeft : Math.max(0, bodyWidth - dropdownPosition.width);
          arrowPlacement[1] = "start";
        }

        // 对于样式为box-sizing:content-box, 扣除对应的padding 和 border
        if (styles.boxSizing !== "border-box") {
          let widthIncludes = ["marginLeft", "marginRight", "paddingLeft", "paddingRight", "borderLeftWidth", "borderRightWidth"];
          let heightIncludes = ["marginTop", "marginBottom", "paddingTop", "paddingBottom", "borderTopWidth", "borderBottomWidth"];
          minWidth -= widthIncludes.reduce((prev, next) => {
            return prev + parseInt(styles[next] || 0);
          }, 0);

          height -= heightIncludes.reduce((prev, next) => {
            return prev + parseInt(styles[next] || 0);
          }, 0);
        }

        let cssText = `top:${top}px;left:${left}px;`;
        if (!scroll) {
          cssText += `z-index:${nextZIndex()};`;
        }
        if (height && height > 0) {
          cssText += `height:${height}px`;
        }
        if (minWidth && minWidth > 0) {
          cssText += `min-width:${minWidth}px`;
        }
        this.dropdown.style.cssText += cssText;
        this.dropdown.setAttribute("arrow-placement", arrowPlacement.join("-"));
      });
    },
    resetPosition() {
      if (!this.dropdown) return false;
      let ele = this.dropdown;
      let needMoveStyles = ["top", "left", "min-width", "height"];
      let cssText = ele.style.cssText;
      if (cssText) {
        let newCssText = cssText.split(/;\s*/).filter(style => {
          let styleName = style.split(":")[0];
          return style && needMoveStyles.indexOf(styleName) === -1;
        }).join("; ") + ";";
        if (newCssText !== cssText) {
          ele.style.cssText = newCssText;
        }
      }
    },
    scrollFn() {
      if (!this.visible) return false;
      if (this.isResetForScrollAndResize) {
        this.hide();
        return false;
      }
      this.timer && clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.setPosition(true);
      }, 0);
    },
    resizeFn() {
      if (!this.visible) return false;
      this.timer2 && clearTimeout(this.timer2);
      this.timer2 = setTimeout(() => {
        this.setPosition(true);
      }, 0);
    },
    startEventListeners() {
      let target = this.$refs.placeholder.parentNode;
      while (target && target !== document.body && target !== document.documentElement) {
        let styles = getStyleComputedProperty(target);
        if (
          ["scroll", "auto"].indexOf(styles["overflow"]) !== -1 ||
          ["scroll", "auto"].indexOf(styles["overflow-x"]) !== -1 ||
          ["scroll", "auto"].indexOf(styles["overflow-y"]) !== -1
        ) {
          break;
        } else {
          target = target.parentNode;
        }
      }
      if (!target || target === document.body || target === document.documentElement) {
        target = null;
      }
      let scrollFn = this.scrollFn.bind(this);
      let resizeFn = this.resizeFn.bind(this);
      target && target.addEventListener("scroll", scrollFn);
      window.addEventListener("resize", resizeFn);
      this.$once("hook:beforeDestroy", () => {
        target && target.removeEventListener("scroll", scrollFn);
        window.removeEventListener("resize", resizeFn);
      });
    }
  },
  mounted() {
    // this.appendToBody();
    // this.visible && this.show();
  }
};
</script>
<style lang="scss" scoped>
.placeholder {
  display: none;
}
.z-dropdown {
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 5px;
  margin: 10px 0px;
  padding: 0 10px;
  background-color: rgba(#2573EF, 0.9);
  font-size: 24px;
  line-height: 36px;
  color: #fff;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
  &[arrow-placement] {
    &::after {
      content: "";
      position: absolute;
      border-width: 5px;
      border-style: solid;
    }
  }
  &[arrow-placement^="top"] {
    &::after {
      top: -10px;
      border-color: transparent transparent rgba(#2573EF, 0.9) transparent;
    }
  }
  &[arrow-placement^="bottom"] {
    &::after {
      bottom: -10px;
      border-color: rgba(#2573EF, 0.9) transparent transparent transparent;
    }
  }
  &[arrow-placement$="start"] {
    &::after {
      left: 10px;
    }
  }
  &[arrow-placement$="end"] {
    &::after {
      right: 10px;
    }
  }
}
.no-data {
  margin: 0;
  text-align: center;
}
</style>
