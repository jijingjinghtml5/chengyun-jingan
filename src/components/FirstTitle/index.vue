<template>
  <level-title class="level-title-1__cmhby" v-bind="$attrs" :level="level">
    <slot></slot>
    <template v-slot:right>
      <slot name="right"></slot>
    </template>
  </level-title>
</template>
<script>
import LevelTitle from '@res/components/MTitle/LevelTitle'
export default {
  name: 'FirstTitle',
  inheritAttrs: false,
  props: {
    level: {
      type: [Number, String],
      default: 1
    }
  },
  components: {
    LevelTitle
  }
}
</script>
<style scoped lang="scss">
$level-title-1-color: #0AC5FF;

.level-title-1__cmhby {
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    margin-top: -0.26rem;
    left: 0;
    width: 0.12rem;
    height: 0.52rem;
    background-color: $level-title-1-color;
  }
  &::after {
    content: '';
    position: absolute;
    width: 0.16rem;
    height: 0.16rem;
    background-color: $level-title-1-color;
    right: 0;
    bottom: 0;
  }
  &.levelTitle {
    position: relative;
    padding-left: 0.3rem;
    height: 0.84rem;
    border-color: rgba($level-title-1-color, 0.2);
  }
}
</style>
