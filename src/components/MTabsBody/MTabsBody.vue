<template>
  <div class="m-tabs-body">
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: "MTabsBody",
  componentName: "MTabsBody",
  props: {
    tab: {
      type: [Number, String],
      default: null
    }
  }
};
</script>
<style lang="scss" scoped>
.m-tabs-body {
  width: 100%;
  height: 100%;
}
</style>
