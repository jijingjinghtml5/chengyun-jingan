<template>
  <el-dropdown-item :class="{ 'is-active': isActive }" @click.native="handleClick">
    <span class="select-box iconfont icon-gougou"></span>
    <slot></slot>
  </el-dropdown-item>
</template>
<script>
export default {
  name: "DropdownItem",
  props: {
    isActive: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleClick () {
      this.$emit("click");
    }
  }
};
</script>
<style lang="scss" scoped>
.select-box {
  display: inline-block;
  width: 0.2rem;
  height: 0.2rem;
  border: 0.02rem solid #2573EF;
  margin-right: 0.1rem;
  font-size: 75%;
  line-height: 0.2rem;
  color:  #F9FEA5;
  text-align: center;
  vertical-align: middle;
  &::before {
    display: none;
  }
}
.is-active {
  .select-box::before {
    display: block;
  }
}
</style>
