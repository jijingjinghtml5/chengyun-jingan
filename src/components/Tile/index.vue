<template>
  <div class="tile">
    <slot name=title>
      <div class="title">
        <span v-if="item.icon" :class="`iconfont ${item.icon}`"></span>
        <span class="label">{{item.label}}</span>
        <span v-if="item.unit" class="unit">( {{item.unit}} )</span>
      </div>
    </slot>
    <slot name="center"><div class="number" :style="{'color': ncolor}">{{item.count | thousandCentimeter}}</div></slot>
    <slot name="bottom">
      <div class="rate">
        <span :class="`iconfont ${cIcon}`" style="margin-right:0.1rem"></span>
        <span>{{Math.abs(item.rate).toFixed(2)}}%</span>
      </div>
    </slot>
  </div>
</template>
<script>
export default {
  name: "Tile",
  props: {
    item: {
      type: Object,
      default: () => {
        return {
          icon: "",
          label: "公共安全案件数",
          count: 1000,
          // color: "green",
          // unit: "件",
          rate: -10
        };
      }
    }
  },
  computed: {
    ncolor() {
      return this.item.color || "#FCBF51";
    },
    cIcon() {
      if (this.item.rate > 0) {
        return "icon-arrow-top";
      } else if (this.item.rate < 0) {
        return "icon-arrow-bottom";
      } else {
        return "icon-qiehuan";
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.tile{
  width: 100%;
  height: 100;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 10px 0;
  .title{
    font-size: 0.36rem;
    color: #92B9F7;
    .unit{
      font-size: 0.24rem;
    }
  }
  .number{
    padding-left: 0.2rem;
    font-size: 0.72rem;
    color: #FCBF51;
    font-weight: bold;
  }
  .rate{
    font-size: 0.24rem;
    color: #ffffff;
    padding-left: 0.3rem;
  }
}
</style>
