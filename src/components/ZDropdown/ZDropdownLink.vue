<template>
  <span
    class="z-dropdown-link"
    :class="containerClass"
    @click="trigger"
    ref="dropdownLink"
    v-clickOutSide="hide">
    <slot></slot>
    <i class="z-dropdown-icon iconfont icon-arrow_left"></i>
    <slot name="dropdown"></slot>
  </span>
</template>
<script>
import Emitter from "@/mixins/emitter";
import clickOutSide from "@/directives/clickOutSide";
export default {
  componentName: "ZDropdownLink",
  name: "ZDropdownLink",
  mixins: [Emitter],
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
  provide() {
    return {
      dropdown: this
    };
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
      if (this.disabled || !this.dropdown) return false;
      if (this.visible) {
        this.hide();
      } else {
        this.show();
      }
    },
    show() {
      this.visible = true;
      this.$emit("visibleChange", this.visible);
      this.broadcast("ZDropdownMenu", "visible", this.visible);
    },
    hide() {
      this.visible = false;
      this.$emit("visibleChange", this.visible);
      this.broadcast("ZDropdownMenu", "visible", this.visible);
    },
    init() {
      // this.popperEle = this.$slots.dropdown ? this.$slots.dropdown[0].elm : null;
      // this.dropdownLink = this.$refs.dropdownLink;
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
  font-size: 0.28rem;
  color: $selected;
  line-height: 1;
  &.hasIcon {
    padding-right: 0.4rem;
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
  right: 0.08rem;
  font-size: 60%;
  transform-origin: center center;
  transform: translateY(-50%) rotateZ(-90deg);
}
// .z-dropdown {
//   position: absolute;
//   top: 0;
//   left: 0;
//   border-radius: 5px;
//   margin: 10px 0px;
//   padding: 0 10px;
//   background-color: rgba(#2573EF, 0.9);
//   font-size: 24px;
//   line-height: 36px;
//   color: #fff;
//   box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
//   &[arrow-placement] {
//     &::after {
//       content: "";
//       position: absolute;
//       border-width: 5px;
//       border-style: solid;
//     }
//   }
//   &[arrow-placement^="top"] {
//     &::after {
//       top: -10px;
//       border-color: transparent transparent rgba(#2573EF, 0.9) transparent;
//     }
//   }
//   &[arrow-placement^="bottom"] {
//     &::after {
//       bottom: -10px;
//       border-color: rgba(#2573EF, 0.9) transparent transparent transparent;
//     }
//   }
//   &[arrow-placement$="start"] {
//     &::after {
//       left: 10px;
//     }
//   }
//   &[arrow-placement$="end"] {
//     &::after {
//       right: 10px;
//     }
//   }
// }
.no-data {
  margin: 0;
  text-align: center;
}
</style>
