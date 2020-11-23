<template>
  <transition name="fade" @after-leave="resetPosition">
    <div v-show="visible" class="z-dropdown" :class="popupClass" ref="dropdown">
      <slot>
        <p class="no-data">暂无数据</p>
      </slot>
    </div>
  </transition>
</template>
<script>
import { getBoundingClientRect, getStyleComputedProperty } from "@/utils/dom";
import { nextZIndex } from "@/utils/popup";
export default {
  componentName: "ZDropdownMenu",
  name: "ZDropdownMenu",
  data() {
    return {
      timer: null,
      timer2: null,
      visible: false,
      popperEle: null,
      dropdownLink: null,
      appendChild: false
    };
  },
  inject: ["dropdown"],
  props: {
    popupClass: {
      type: String,
      default: ""
    }
  },
  watch: {
    visible: {
      handler(val) {
        this.updatePopper();
      }
    }
  },
  methods: {
    updatePopper() {
      if (!this.appendChild) {
        this.appendChild = true;
        this.appendToBody();
      }
      this.visible && (
        this.$nextTick(() => {
          this.setPosition();
        })
      );
    },
    async appendToBody() {
      return new Promise((resolve) => {
        this.$nextTick(() => {
          document.body.appendChild(this.popperEle);
          this.startEventListeners();
          this.$once("hook:beforeDestroy", () => {
            if (document.body.contains(this.popperEle)) {
              document.body.removeChild(this.popperEle);
            }
          });
          resolve();
        });
      });
    },
    setPosition(scroll = false) {
      if (!this.visible || !this.popperEle) return false;
      this.resetPosition();
      // this.$nextTick(() => {
      let linkPosition = getBoundingClientRect(this.dropdownLink);
      let dropdownPosition = getBoundingClientRect(this.popperEle);
      let styles = getStyleComputedProperty(this.popperEle);

      // 计算下拉框包含margin 的实际宽高
      dropdownPosition.width += parseInt(styles.marginLeft) + parseInt(styles.marginRight);
      dropdownPosition.height += parseInt(styles.marginTop) + parseInt(styles.marginBottom);

      let windowWidth = document.documentElement.clientWidth || document.body.clientWidth;
      let windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
      let top = 0;
      let left = 0;
      let minWidth = 0;
      let maxWidth = 0;
      let height = 0;
      let arrowPlacement = ["top", "end"];

      // 下拉框最小宽度
      if (dropdownPosition.width - linkPosition.width < 0) {
        dropdownPosition.width = linkPosition.width;
        minWidth = linkPosition.width;
      }

      // top距离
      if (windowHeight - linkPosition.bottom >= dropdownPosition.height) {
        top = linkPosition.docTop + linkPosition.height;
      } else if (linkPosition.top >= dropdownPosition.height) {
        top = linkPosition.docTop - dropdownPosition.height;
        arrowPlacement[0] = "bottom";
      } else {
        top = linkPosition.docTop + linkPosition.height;
        height = windowHeight - linkPosition.bottom;
      }
      // left 距离
      if (linkPosition.left + linkPosition.width >= dropdownPosition.width) {
        left = linkPosition.docLeft + linkPosition.width - dropdownPosition.width;
        maxWidth = linkPosition.right;
      } else {
        left = linkPosition.docLeft;
        arrowPlacement[1] = "start";
        maxWidth = windowWidth - linkPosition.left;
      }

      // 对于样式为box-sizing:content-box, 扣除对应的padding 和 border
      let widthIncludes = ["marginLeft", "marginRight"];
      let heightIncludes = ["marginTop", "marginBottom"];
      if (styles.boxSizing !== "border-box") {
        Array.prototype.push.apply(widthIncludes, ["paddingLeft", "paddingRight", "borderLeftWidth", "borderRightWidth"]);
        Array.prototype.push.apply(heightIncludes, ["paddingTop", "paddingBottom", "borderTopWidth", "borderBottomWidth"]);
      }
      minWidth -= widthIncludes.reduce((prev, next) => {
        return prev + parseInt(styles[next] || 0);
      }, 0);

      height -= heightIncludes.reduce((prev, next) => {
        return prev + parseInt(styles[next] || 0);
      }, 0);

      let cssText = `top:${top}px;left:${left}px;`;
      if (!scroll) {
        cssText += `z-index:${nextZIndex()};`;
      }

      if (height && height > 0) {
        cssText += `height:${height}px;`;
      }

      if (minWidth && minWidth > 0) {
        cssText += `min-width:${minWidth}px;`;
      }

      if (maxWidth && maxWidth > 0) {
        cssText += `max-width:${maxWidth}px;`;
      }
      // console.log("cssText", cssText);
      this.popperEle.style.cssText += cssText;
      this.popperEle.setAttribute("arrow-placement", arrowPlacement.join("-"));
      // });
    },
    resetPosition() {
      let ele = this.popperEle;
      let needMoveStyles = ["top", "left", "min-width", "max-width", "height"];
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
      let root = window;
      let target = this.dropdownLink.parentNode;
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
      if (target === document.body || target === document.documentElement) {
        target = root;
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
  created() {
    this.$on("visible", val => {
      this.visible = val;
    });
  },
  mounted() {
    if (!this.dropdown) return false;
    this.dropdown.dropdown = this.popperEle = this.$el;
    this.dropdownLink = this.dropdown.$el;
    this.dropdown.init();
  }
};
</script>
<style lang="scss" scoped>
.textEllipsis {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.z-dropdown {
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 5px;
  margin: 10px 0px;
  padding: 5px 0px;
  background-color: rgba(#2573EF, 0.8);
  font-size: 28px;
  line-height: 36px;
  color: #fff;
  border: 2px solid #2573EF;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
  overflow-y: auto;
  /deep/ {
    li {
      list-style: none;
    }
  }
  &[arrow-placement] {
    &::after, &::before {
      content: "";
      position: absolute;
      border-width: 8px;
      border-style: solid;
    }
    &::after {
      z-index: 2
    }
    &::before {
      z-index: 1;
    }
  }
  &[arrow-placement^="top"] {
    &::after {
      top: -16px;
      border-color: transparent transparent rgba(#2573EF, 0.4) transparent;
    }
    &::before {
      top: -18px;
      border-color: transparent transparent rgba(#2573EF, 1) transparent;
    }
  }
  &[arrow-placement^="bottom"] {
    &::after {
      bottom: -16px;
      border-color: rgba(#2573EF, 0.4) transparent transparent transparent;
    }
    &::before {
      bottom: -18px;
      border-color: rgba(#2573EF, 1) transparent transparent transparent;
    }
  }
  &[arrow-placement$="start"] {
    &::after, &::before {
      left: 10px;
    }
  }
  &[arrow-placement$="end"] {
    &::after, &::before {
      right: 10px;
    }
  }
}
.no-data {
  margin: 0;
  text-align: center;
  white-space: nowrap;
}
</style>
