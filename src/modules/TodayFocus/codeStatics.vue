<template>
  <wrap-title
    txt="静安扫码统计"
    :level="2"
    icon="icon-biaoti"
    class="dashboard"
  >
    <div class="times-tab">
      <p
        v-for="item in times"
        :class="{ active: current === item.value }"
        @click="handleClickTime(item)"
        :key="item.value"
      >
        {{ item.name }}
      </p>
    </div>
    <line-chart
      :showLegend="true"
      :legendConfig="legendConfig"
      :chartData="chartData"
      :colors="colors"
      :showYLabel="true"
      :pageLen="24"
      :isGradient="true"
      :gradientBySelf="true"
    >
    </line-chart>
  </wrap-title>
</template>
<script>
import LineChart from '@/components/Charts/Line/ChartLine'
import WrapTitle from '@/components/MTitle/WrapTitle'

export default {
  name: 'NumStatics',
  components: {
    WrapTitle,
    LineChart,
  },
  props: {},
  watch: {},
  data() {
    return {
      current: 'day',
      times: [
        { name: '日', value: 'day' },
        { name: '周', value: 'week' },
        { name: '月', value: 'month' },
      ],
      legendConfig: {
        icon: 'rect',
        itemWidth: 20,
        itemHeight: 6,
        top: 0,
        right: 250,
      },
      chartData: [],
      colors: ['#1ABC9C', '#679DF4', '#F96F4F', '#BE6CCC', '#D0021B'],
    }
  },
  created() {},
  methods: {},
  beforeDestroy() {},
}
</script>
<style lang="scss" scoped>
.dashboard {
  padding: 0.1rem 0;
  height: 4rem;
  position: relative;
  .times-tab {
    position: absolute;
    display: flex;
    align-items: center;
    top: 0.2rem;
    right: 0.1rem;
    color: #92b9f7;
    & > p {
      font-size: 0.36rem;
      cursor: pointer;
      & + p {
        margin-left: 0.2rem;
      }
      &.active {
        color: #ffffff;
      }
    }
  }
}
</style>
