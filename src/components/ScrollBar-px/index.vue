<template>
  <div class="scrollbar-container" :style="{ height: height }">
    <div
      class="scrollbar-wrap"
      :class="[scrollBarClass, size]"
      :style="{
        marginRight: `-${scrollBarWidth}px`,
        marginBottom: `-${scrollBarWidth}px`
      }"
    >
      <div class="scrollbar-content">
        <slot></slot>
      </div>
    </div>
  </div>
</template>
<script>
import scrollWidth from "@/utils/scrollbar-width";
export default {
  name: "ScrollBar",
  data() {
    return {
      scrollBarWidth: 17
    };
  },
  props: {
    direction: {
      type: String,
      default: "vertical"
    },
    height: {
      type: String,
      default: "100%"
    },
    showScrollBal: {
      type: Boolean,
      default: true
    },
    size: {
      type: String,
      default: "large"
    }
  },
  mounted() {
    this.scrollBarWidth = scrollWidth();
  },
  computed: {
    scrollBarClass() {
      if (this.showScrollBal) {
        return "is-auto";
      } else {
        return `is-${this.direction}`;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.scrollbar-container {
  position: relative;
  height: 100%;
  overflow: hidden;
  .scrollbar-wrap {
    overflow: scroll;
    height: 100%;
    &.is-auto{
      overflow: auto;
      margin-bottom: 0px !important;
      margin-right: 0px !important;
      &.large {
        &::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        &::-webkit-scrollbar-thumb {
          background: #40abb2;
          min-height: 10px;
          min-width: 10px;
          border-radius: 5px;
        }
      }
      &.medium {
        &::-webkit-scrollbar {
          width: 4px;
          height: 4px;
        }
        &::-webkit-scrollbar-thumb {
          background: #40abb2;
          min-height: 10px;
          min-width: 10px;
          border-radius: 5px;
        }
      }
      &::-webkit-scrollbar-track-piece {
        background-color: transparent;
        margin: 0px;
      }

      &::-webkit-scrollbar-thumb:vertical:hover {
        background: #555555;
      }

      &::-webkit-scrollbar-thumb:horizontal:hover {
        background: #555555;
      }
    }
    &.is-vertical {
      margin-bottom: 0px !important;
      overflow-x: hidden;
    }
    &.is-horizontal {
      margin-right: 0px !important;
      overflow-y: hidden;
    }
  }
}
</style>
