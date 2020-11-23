<template>
  <li class="z-dropdown-menu__item" :class="{ 'is-active': isActive }" @click="handleClick">
    <span v-if="showCheckbox" class="select-box iconfont icon-gougou"></span>
    <slot></slot>
  </li>
</template>
<script>
export default {
  name: "ZDropdownItem",
  data() {
    return {};
  },
  props: {
    isActive: {
      type: Boolean,
      default: false
    },
    showCheckbox: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    handleClick() {
      this.$emit("click");
    }
  }
};
</script>
<style lang="scss" scoped>
.z-dropdown-menu__item {
  list-style: none;
  display: flex;
  align-items: center;
  font-size: 24px;
  line-height: 36px;
  padding: 0px 10px;
  cursor: pointer;
  &:hover {
    background-color: #92b9f7
  }
  &.is-active {
    .select-box::before {
      display: block;
    }
  }
  .select-box {
    display: inline-block;
    width: 24px;
    height: 24px;
    border: 2px solid #2573EF;
    margin-right: 10px;
    font-size: 75%;
    line-height: 20px;
    text-align: center;
    &::before {
      display: none;
    }
  }

}
</style>
