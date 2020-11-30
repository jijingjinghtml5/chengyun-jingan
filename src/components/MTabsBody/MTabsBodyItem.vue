<template>
  <div class="m-tabs-body__item" :tabindex="itemId" v-show="active" v-if="(!lazy || loaded) || active">
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
      itemId: itemId++,
      loaded: false
    };
  },
  props: {
    name: {
      type: [Number, String],
      default: null
    },
    lazy: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    active () {
      return this.$parent.tab === (this.name || this.itemId);
    }
  },
  watch: {
    active: {
      handler() {
        this.active && (this.loaded = true);
      },
      immediate: true
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
