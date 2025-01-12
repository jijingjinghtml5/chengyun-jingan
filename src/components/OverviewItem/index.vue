<template>
  <div class="overview-item" :class="customClass" :title="showTitle" @click="clickItem">
    <div v-if="icon" class="overview-item__icon">
      <img v-if="pictureUrl" :src="pictureUrl" style="width: 0.7rem;height: 0.7rem;" alt="" />
      <i v-else class="iconfont" :class="icon"></i>
    </div>
    <ul class="overview-item__content">
      <li class="overview-item__name" v-if="name">{{ name }}<sub v-if="nameUnit">{{ nameUnit }}</sub></li>
      <li class="overview-item__value" :style="{ color: vc }"><sub v-if="valueBefore">{{ valueBefore }}</sub><NumberAnimation :decimals="formatDecimals" :val ="(value || dataset[valueProp]) | initVal " ></NumberAnimation><sub v-if="valueUnit">{{ valueUnit }}</sub></li>
      <increase v-if="showIncrease" tag="li" :value="increase || dataset[increaseProp] | initVal"></increase>
      <li class="overview-item__extra" v-for="item in extraItems || []" :key="item.key" :style="{ color: item.color }">
        {{ item.label }}：{{dataset[item.prop] | initVal | thousandCentimeter}}{{ item.unit }}
      </li>
      <img v-if="name == '交通拥堵指数'" class="img" src="./img.png" alt="">
      <slot></slot>
    </ul>
  </div>
</template>
<script>
import NumberAnimation from '@/components/NumberAnimation/index.vue'
import Increase from '../Increase'
export default {
  name: 'OverviewItem',
  components: { Increase, NumberAnimation },
  props: {
    pictureUrl: {
      type: String,
      default: null
    },
    growth_ratio: {
      type: String,
      default: null
    },
    icon: {
      type: String,
      default: null
    },
    valueBefore: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: ''
    },
    nameUnit: {
      type: String,
      default: ''
    },
    value: {
      type: [String, Number],
      default: null
    },
    valueUnit: {
      type: String,
      default: ''
    },
    valueColor: {
      type: [String, Function],
      default: null
    },
    valueProp: {
      type: String,
      default: 'value'
    },
    increase: {
      type: [String, Number],
      default: null
    },
    increaseProp: {
      type: String,
      default: 'increase'
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
      default: 'style1'
    },
    dataset: {
      type: Object,
      default: () => {
        return {}
      }
    },
    nameProp: {
      type: String,
      default: ''
    }
  },
  inheritAttrs: false,
  computed: {
    vc () {
      return typeof this.valueColor === 'function' ? this.valueColor(this.value) : this.valueColor
    },
    showTitle () {
      if (this.name === '交通拥堵指数') {
        return '大于50表示拥堵'
      } else {
        return this.growth_ratio
      }
    },
    formatDecimals() {
      let list = ['syrk', 'syfr', 'gdp', 'qyzcz', 'sszsr']
      return list.includes(this.nameProp) ? 2 : 0
    }
  },
  methods: {
    clickItem() {
      if (this.name === '舆情热点数') {
        this.$bus.$emit('watchYuq', {})
      }
      this.$emit('click', name)
    }
  }
}
</script>
<style lang="scss" scoped>
.overview-item {
  display: flex;
  align-items: center;
  color: #fff;
  line-height: 1.5;
  font-size: 0.24rem;
  cursor: pointer;
}
.overview-item__name {
  color: $titleLevel2;
}
.overview-item__icon {
  color: #0071FF;
  .supportWebkitTextFillColor &{
    background-image: linear-gradient(180deg, #4FCFD5 0%, #0071FF 100%);
    // background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
}
.overview-item__content {
  position: relative;
  .img {
    display: none;
  }
  &:hover {
    .img {
      display: block;
      position: absolute;
      top: 80px;
      left: 100px;
    }
  }
}
.increase {
  display: flex;
}
sub {
  bottom: 0;
}

.style1,
.style2,
.style5 {
  .overview-item__icon {
    width: 1rem;
    font-size: 0.7rem;
    text-align: center;
    margin-right: 0.1rem;
  }
  .overview-item__name {
    font-size: 0.36rem;
  }
  .overview-item__value {
    font-size: 0.7rem;
    line-height: 0.96rem;
    font-weight: bold;
    sub {
      font-size: 0.36rem;
    }
  }
}
.style2 {
  .overview-item__value {
    color: #4FCFD5;
  }
}
.style5 {
  .overview-item__icon {
    color: #FF001F;
    .supportWebkitTextFillColor &{
      background-image: none;
      // background-clip: text;
      -webkit-background-clip: unset;
      -webkit-text-fill-color: unset;
    }
  }
  .overview-item__value {
    color: #4FCFD5;
  }
}
.style3,
.style4,
.style6,
.style7 {
  .overview-item__icon {
    width: 1rem;
    font-size: 0.64rem;
    text-align: center;
    margin-right: 0.1rem;
  }
  .overview-item__name {
    font-size: 0.28rem;
    color:#fff;
  }
  .overview-item__value {
    font-size: 0.52rem;
    color: #4FCFD5;
    sub {
      font-size: 0.28rem;
      color: #fff;
    }
  }
}
.style6 {
  .overview-item__name {
    color:$titleLevel2;
  }
  .overview-item__value {
    sub {
      color: #4FCFD5;
    }
  }
}
.style7 {
  .overview-item__name {
    color: $titleLevel2;
  }
  .overview-item__value {
    sub {
      color: $titleLevel2;
    }
  }
}
.style4 {
  .overview-item__extra {
    color: #92B9F7;
  }
}
</style>
