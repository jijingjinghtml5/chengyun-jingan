<template>
  <span
    class="z-dropdown-link"
    :class="containerClass"
    @click="trigger"
    ref="dropdownLink"
    v-clickOutSide="hide">
    <slot></slot>
    <i class="z-dropdown-icon iconfont icon-arrow_left"></i>
    <transition name="fade" @after-leave="resetPosition">
      <div v-if="lazyLoad" v-show="visible" class="z-dropdown" :class="popupClass" ref="dropdown">
        <scroll-bar>
          <slot name="dropdown">
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
  name: "ZDropdownLink",
  data() {
    return {
      visible: false,
      lazyLoad: false,
      dropdownLink: null,
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
    disabled: {
      Boolean,
      default: false
    },
    showDropDownIcon: {
      type: Boolean,
      default: true
    },
    textEllipsis: {
      type: Boolean,
      default: false
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
  computed: {
    containerClass() {
      return {
        pointer: !this.disabled,
        hasIcon: this.showDropDownIcon,
        textEllipsis: this.textEllipsis,
        "is-active": this.visible
      };
    }
  },
  methods: {
    async trigger() {
      if (this.disabled) return false;
      if (!this.lazyLoad) {
        this.lazyLoad = true;
        await this.appendToBody();
      }
      if (this.visible) {
        this.hide();
      } else {
        this.show();
      }
    },
    async appendToBody() {
      return new Promise((resolve) => {
        this.$nextTick(() => {
          this.dropdown = this.$refs.dropdown;
          if (!this.dropdownLink) {
            this.dropdownLink = this.$refs.dropdownLink;
          }
          document.body.appendChild(this.dropdown);
          this.startEventListeners();
          this.$once("hook:beforeDestroy", () => {
            document.body.removeChild(this.dropdown);
          });
          resolve();
        });
      });
    },
    show() {
      if (this.disabled || !this.dropdown) return false;
      this.visible = true;
      this.$emit("visibleChange", this.visible);
      this.setPosition();
    },
    hide() {
      if (this.disabled || !this.dropdown) return false;
      this.visible = false;
      this.$emit("visibleChange", this.visible);
    },
    setPosition(scroll = false) {
      if (!this.visible || !this.dropdown) return false;
      this.resetPosition();
      this.$nextTick(() => {
        let linkPosition = getBoundingClientRect(this.dropdownLink);
        let dropdownPosition = getBoundingClientRect(this.dropdown);
        let styles = getStyleComputedProperty(this.dropdown);

        // 计算下拉框包含margin 的实际宽高
        dropdownPosition.width += parseInt(styles.marginLeft) + parseInt(styles.marginRight);
        dropdownPosition.height += parseInt(styles.marginTop) + parseInt(styles.marginBottom);

        let bodyHeight = Math.max(document.documentElement.clientHeight, document.body.clientHeight, document.documentElement.scrollHeight, document.body.scrollHeight);
        let bodyWidth = Math.max(document.documentElement.clientWidth, document.body.clientWidth, document.documentElement.scrollWidth, document.body.scrollWidth);
        let top = 0;
        let left = 0;
        let minWidth = 0;
        let height = 0;
        let arrowPlacement = ["top", "end"];

        // 下拉框最小宽度
        if (dropdownPosition.width - linkPosition.width < 0) {
          dropdownPosition.width = linkPosition.width;
          minWidth = linkPosition.width;
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
  }
};
</script>
<style lang="scss" scoped>
.textEllipsis {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.z-dropdown-link {
  position: relative;
  display: inline-block;
  font-size: 24px;
  line-height: 1;
  &.hasIcon {
    padding-right: 30px;
    .z-dropdown-icon {
      display: block;
    }
  }
  &.pointer {
    cursor: pointer;
  }
  &.is-active {
  }
}
.z-dropdown-icon {
  display: none;
  position: absolute;
  top: 50%;
  right: 10px;
  font-size: 60%;
  transform-origin: center center;
  transform: translateY(-50%) rotateZ(-90deg);
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
