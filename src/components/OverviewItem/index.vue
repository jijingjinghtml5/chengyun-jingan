<template>
  <div class="overview-item" :class="customClass">
    <div v-if="icon" class="overview-item__icon">
      <i class="iconfont" :class="icon"></i>
    </div>
    <ul class="overview-item__content">
      <li class="overview-item__name">{{ name }}<sub v-if="nameUnit">{{ nameUnit }}</sub></li>
      <li class="overview-item__value" :style="{ color: vc }">{{ dataset[prop] | initVal | thousandCentimeter }}<sub v-if="valueUnit">{{ valueUnit }}</sub></li>
      <increase v-if="showIncrease" tag="li" :value="dataset[prop + '_increase'] | initVal"></increase>
      <li v-for="item in extraItems || []" :key="item.key">
        {{ item.label }}：{{ dataset[prop + "_" + item.prop] | initVal | thousandCentimeter }} {{ item.unit }}
      </li>
      <slot></slot>
    </ul>
  </div>
</template>
<script>
import Increase from "../Increase";
export default {
  name: "OverviewItem",
  components: { Increase },
  props: {
    icon: {
      type: String,
      default: null
    },
    prop: {
      type: String,
      required: true,
      default: null
    },
    name: {
      type: String,
      required: true,
      default: ""
    },
    nameUnit: {
      type: String,
      default: ""
    },
    valueUnit: {
      type: String,
      default: ""
    },
    valueColor: {
      type: [String, Function],
      default: null
    },
    showIncrease: {
      type: Boolean,
      default: true
    },
    extraItems: {
      type: Array,
      default: () => []
    },
    customClass: {
      type: String,
      default: "style1"
    },
    dataset: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  inheritAttrs: false,
  computed: {
    vc() {
      return typeof this.valueColor === "function" ? this.valueColor(this.value) : this.valueColor;
    }
  }
};
</script>
<style lang="scss" scoped>
.overview-item {
  display: flex;
  align-items: center;
  color: #fff;
}
.style1, .style2 {
  line-height: 1.5;
  .overview-item__icon {
    width: 1rem;
    font-size: 0.72rem;
    text-align: center;
    margin-right: 0.1rem;
  }
  .overview-item__name {
    font-size: 0.36rem;
  }
  .overview-item__value {
    font-size: 0.72rem;
    font-weight: bold;
    sub {
      font-size: 0.36rem;
    }
  }
  .increase {
    display: flex;
  }
}
.style2 {
  .overview-item__name {
    color: #92B9F7;
    sub {
      font-size: 0.28rem;
    }
  }
  .overview-item__value {
    color: #FCBF51;
  }
}
</style>
