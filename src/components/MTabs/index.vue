
<template>
  <div class="m-tabs" :class="customClass">
    <template v-for="(tab, i) in tabs">
      <span v-if="i !== 0" class="m-tabs__item-line" :key="`${i}-line`">|</span>
      <span class="m-tabs__item" :class="{ 'is-active': current === tab.value }" :style="current === tab.value ? activeStyle : ''" :key="i" @click="handleClickForChangeTab(tab)">{{ tab.label }}</span>
    </template>
  </div>
</template>
<script>
import TabMixins from "./tab";
export default {
  name: "MTabs",
  data () {
    return {
      resetTimer: null,
      againInterval: 5000
    };
  },
  mixins: [TabMixins],
  methods: {
    handleClickForChangeTab (item) {
      this.$emit("change", item.value);
    },
    getIndexOf() {
      let activeIndex = -1;
      this.tabs.map((item, index) => {
        if (item.value === this.current) {
          activeIndex = index;
        }
      });
      return activeIndex;
    },
    startTimer() {
      this.resetTimer = setInterval(() => {
        this.autoChangeTab();
      }, this.againInterval);
    },
    stopTimer () {
      if (this.resetTimer) {
        clearInterval(this.resetTimer);
        this.resetTimer = null;
      }
    },
    autoChangeTab() {
      let activeIndex = this.getIndexOf();
      activeIndex++;
      if (activeIndex === this.tabs.length) {
        activeIndex = 0;
      }
      this.$emit("change", this.tabs[activeIndex].value);
    }
  },
  mounted() {
    // todo
    this.startTimer();
  }
};
</script>
<style lang="scss" scoped>
.m-tabs {
  display: inline-flex;
  align-items: center;
  font-size: 0.32rem;
  font-weight: 400;
  color:#92B9F7;
}
.m-tabs__item-line {
  margin: 0 0.1rem;
}
.m-tabs__item {
  cursor: pointer;
  &.is-active {
    color: #FCBF51;
  }
}
</style>
