<template>
  <div
    class="m-row"
    :class="['is-' + direction]"
    :style="{
      marginLeft: gutterValue,
      marginRight: gutterValue
    }">
    <slot></slot>
  </div>
</template>
<script>
import Emitter from "@/mixins/emitter";
export default {
  name: "MRow",
  componentName: "MRow",
  mixins: [Emitter],
  props: {
    // h 水平 v垂直
    direction: {
      type: String,
      default: "h"
    },
    // 间隔
    gutter: {
      type: [Number, String],
      default: "0"
    }
  },
  computed: {
    gutterValue () {
      return `-${this.gutter}`;
    }
  }
};
</script>
<style lang="scss" scoped>
.m-row {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  &.is-h {
    flex-direction: row;
  }
  &.is-v {
    flex-direction: column;
    height: 100%;
  }
  &.is-hr {
    flex-direction: row-reverse;
  }
  &.is-vr {
    flex-direction: column-reverse;
    height: 100%;
  }
}
</style>
