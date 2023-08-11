<template>
  <wrap-title txt="张贴统计" :level="2" icon="icon-biaoti" class="dashboard">
    <m-tabs
      slot="level-title"
      v-model="tab"
      :tabs="tabs"
      :autoChange="false"
    ></m-tabs>
    <template v-if="tab === 'case'">
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
    </template>
    <template v-else>
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
      <!-- <bar-chart
        :showLegend="true"
        :chartData="newchartData"
        :legendConfig="newlegendConfig"
        :colors="colors"
        :barMaxWidth="0.2"
        :pageLen="6"
        :showYLabel="true"
        unit="%"
        :customTooltip="customTooltip"
      >
      </bar-chart> -->
    </template>
  </wrap-title>
</template>
<script>
import WrapTitle from '@/components/MTitle/WrapTitle'
import LineChart from '@/components/Charts/Line/ChartLine'
import MTabs from "@/components/MTabs";

export default {
  name: 'caseStatics',
  components: {
    WrapTitle,
    LineChart,
    MTabs
  },
  props: {},
  watch: {},
  computed: {
    chartData () {
      return [
        ['时间', '区级码(静安码)', '街镇码(静安码)', '街镇码(彭浦新村码)'],
        []
      ]
    }
  },
  data() {
    return {
      tabs: Object.freeze([
        { label: "案件统计", value: "statics" },
        // { label: "案件列表", value: "case" }
      ]),
      tab: 'statics'
    }
  },
  methods: {},
  mounted() {
    
  },
}
</script>
<style lang="scss" scoped>
</style>
