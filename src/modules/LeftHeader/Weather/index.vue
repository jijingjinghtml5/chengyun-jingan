<template>
  <div class="weather-wrap">
    <ul>
      <template v-for="data in items">
        <li :key="data.key" v-if="!data.hidden">
          <i v-if="data.icon" class="li-left" :class="data.icon"></i>
          <div class="li-right">
            <p class="li-right__label">
              {{ data.label }}
            </p>
            <p class="li-right__value">
              {{ dataset[data.key] | initVal }}<template v-if="dataset[data.key] >= 0">{{ data.unit }}</template>
            </p>
          </div>
        </li>
      </template>
    </ul>
  </div>
</template>
<script>
export default {
  name: "Weather",
  data() {
    return {};
  },
  props: {
    items: {
      type: Array,
      default: () => []
    },
    dataset: {
      type: Object,
      default: () => {
        return {};
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.weather-wrap{
  width: 100%;
  padding: 0 0.2rem;
  box-sizing: border-box;
  ul{
    display: flex;
    align-items: center;
    justify-content: space-between;
    line-height: 0.76rem;
    color: #92B9F7;
  }
  li {
    display: flex;
    align-items: center;
    padding: 0 0.1rem;
  }
}

.li-left {
  font-size: 0.48rem;
  color: #0071FF;
  .supportWebkitTextFillColor &{
    background-image: linear-gradient(180deg, #4FCFD5 0%, #0071FF 100%);
    // background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
}
.li-right {
  line-height: 0.6rem;
  margin-left: 0.1rem;
}
.li-right__label {
  font-size: 0.28rem;
  color:#D1C9C4;
}
.li-right__value {
  font-size: 0.44rem;
}
</style>
