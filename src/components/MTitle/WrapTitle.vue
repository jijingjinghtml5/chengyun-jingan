<template>
  <div class="wrap-title">
    <slot name="title">
      <level-title v-bind="$attrs" v-on="$listeners">
        <slot name="level-title"></slot>
        <template slot="center">
          <slot name="center"></slot>
        </template>
        <template slot="right">
          <slot name="right"></slot>
        </template>
      </level-title>
    </slot>
    <div class="wrap-title__content" :class="{ ['is-' + direction]: true }">
      <slot></slot>
    </div>
  </div>
</template>
<script>
import LevelTitle from "./LevelTitle";
export default {
  name: "WrapTitle",
  components: {
    LevelTitle
  },
  props: {
    // v、h
    direction: {
      type: String,
      default: "v"
    }
  },
  inheritAttrs: false
};
</script>
<style lang="scss" scoped>
.wrap-title {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 0 0.2rem;
}
.wrap-title__content {
  height: 0;
  flex: 1;
  &.is-v {
    display: flex;
    flex-direction: column;
  }
  &.is-h {
    display: flex;
  }
}
</style>
