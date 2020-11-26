<template>
  <div class="tile" @click="handleClick">
    <slot name=title>
      <div class="title">
        <span class="label">{{item.label}}</span>
        <span v-if="item.unit" class="unit"> ( {{item.unit}} )</span>
      </div>
    </slot>
    <slot name="center"><div class="number" :style="{'color': item.color}">{{item.count | thousandCentimeter}}</div></slot>
    <slot name="bottom">
      <div class="rate">
        <span :class="`iconfont ${cIcon}`" style="margin-right:0.1rem"></span>
        <span>{{Math.abs(item.rate).toFixed(2)}}%</span>
      </div>
    </slot>
  </div>
</template>
<script>
import LevelTitle from "@/components/MTitle/LevelTitle";

export default {
  name: "Tile",
  components: { LevelTitle },
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
    cIcon() {
      if (this.item.rate > 0) {
        return "icon-shangla green";
      } else if (this.item.rate < 0) {
        return "icon-arrow-down red";
      } else {
        return "icon-stable gray";
      }
    }
  },
  methods: {
    handleClick() {
      this.$emit("click", this.item);
    }
  }
};
</script>
<style lang="scss" scoped>
.tile{
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  line-height: 1.5;
  text-align: center;

  background: linear-gradient(180deg, rgba(79, 207, 213, 0) 0%, rgba(46, 155, 207, 0.4) 100%);
  .unit{
    font-size: 0.24rem;
  }
  .title{
    color: $titleLevel2;
    .label{
      font-size:36px;
      font-weight: 500;
    }
    .unit{
      font-size:24px;
    }
  }
  .number{
    font-size: 72px;
    color: $number;
    font-weight: bold;
  }
  .rate{
    font-size: 0.24rem;
    color: #ffffff;
    // padding-left: 0.3rem;
  }
  .green{
    color: #6CCB73;
  }
  .red{
    color: #E64C3B;
  }
  .gray{
    color: #A8C7F9
  }
}
</style>
