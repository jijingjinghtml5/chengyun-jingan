<template>
  <div
    class="m-column"
    :class="['is-' + dir, isWidth ? 'isWidth': '']"
    :style="{
      paddingLeft: dir === 'h' ? gutter : null,
      paddingRight: dir === 'h' ? gutter : null,
      marginBottom: dir === 'v' ? gutter: null,
      flex: isFlex ? span : null,
      width: isWidth ? width: null,
      height: isHeight ? height: null
    }">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'MColumn',
  componentName: 'MColumn',
  data () {
    return {}
  },
  props: {
    span: {
      type: [String, Number],
      default: '1'
    },
    width: {
      type: [String, Number],
      default: 0
    },
    height: {
      type: [String, Number],
      default: 0
    }
  },
  computed: {
    isWidth () {
      return this.dir === 'h' && parseFloat(this.width) > 0
    },
    isHeight () {
      return this.dir === 'v' && parseFloat(this.height) > 0
    },
    isFlex () {
      return !this.isWidth && !this.isHeight
    },
    dir () {
      let parent = this.$parent
      while (parent && parent.$options.componentName !== 'MRow') {
        parent = parent.$parent
      }
      return parent ? parent.direction : 'h'
    },
    gutter () {
      let parent = this.$parent
      while (parent && parent.$options.componentName !== 'MRow') {
        parent = parent.$parent
      }
      return parent ? parent.gutter : 0
    }
  }

}
</script>
<style lang="scss" scoped>
.m-column {
  &.is-h,
  &.is-hr {
    width: 0;
  }
  &.is-v,
  &.is-vr {
    height: 0;
    &:last-of-type {
      margin-bottom: 0 !important;
    }
  }
  &.isHeight
  &.isWidth {
    flex-grow: 0;
    flex-shrink: 0;
  }
}
</style>
