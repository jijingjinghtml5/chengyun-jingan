<template>
  <div class="m-tabs-body__item" :tabindex="itemId" v-show="active">
    <slot></slot>
  </div>
</template>
<script>
let itemId = 1;
export default {
  name: "MTabsBodyItem",
  componentName: "MTabsBodyItem",
  data () {
    return {
      itemId: itemId++
    };
  },
  props: {
    name: {
      type: [Number, String],
      default: null
    }
  },
  computed: {
    active () {
      return this.$parent.tab === (this.name || this.itemId);
    }
  }
};
</script>
<style lang="scss" scoped>
.m-tabs-body__item {
  width: 100%;
  height: 100%;
}
</style>
