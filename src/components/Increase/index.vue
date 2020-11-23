<template>
  <component :is="tag" class="increase">
    <i
      v-if="increase"
      class="iconfont"
      :class="{
        [increaseClass]: true
      }"
      :style="{
        color: increaseColor
      }">
    </i>
    <span>{{ value | initVal }}%</span>
  </component>
</template>
<script>
export default {
  name: "Increase",
  props: {
    value: {
      type: [String, Number],
      default: null
    },
    tag: {
      type: String,
      default: "div"
    },
    upColor: {
      type: String,
      default: "#6CCB73"
    },
    upIcon: {
      type: String,
      default: "icon-shangla"
    },
    unchangeColor: {
      type: String,
      default: "#A8C7F9"
    },
    unchangeIcon: {
      type: String,
      default: "icon-stable"
    },
    downColor: {
      type: String,
      default: "#E64C3B"
    },
    downIcon: {
      type: String,
      default: "icon-arrow-down"
    }
  },
  computed: {
    increase() {
      let res = "";
      if (this.value > 0) {
        res = "up";
      } else if (this.value === 0) {
        res = "unchange";
      } else if (this.value < 0) {
        res = "down";
      }
      return res;
    },
    increaseClass() {
      return this[`${this.increase}Icon`];
    },
    increaseColor() {
      return this[`${this.increase}Color`];
    }
  }
};
</script>
<style lang="scss" scoped>
.increase {
  display: inline-flex;
  font-size: 0.24rem;
  line-height: 1.5;
  color: #fff;
  align-items: center;
}
.iconfont {
  margin-right: 0.1rem;
}
</style>
