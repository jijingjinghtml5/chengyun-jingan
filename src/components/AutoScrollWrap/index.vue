<template>
  <div class="auto-scroll-wrap" :class="{ isVirtual: isVirtual }" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
    <slot></slot>
  </div>
</template>
<script>
import ComponentsMixins from "./mixins";
export default {
  name: "AutoScrollWrap",
  mixins: [ComponentsMixins],
  inheritAttrs: false
};
</script>
<style lang="scss" scoped>
.auto-scroll-wrap {
  height: 100%;
  &:not(.isVirtual) {
    overflow-y: auto;
  }
  /deep/ {
    >.vue-recycle-scroller {
      height: 100%;
    }
  }
}
</style>
