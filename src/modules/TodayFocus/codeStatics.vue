<template>
  <wrap-title txt="静安扫码统计" :level="2" icon="icon-biaoti" class="dashboard">
    <div class="times-tab">
      <p v-for="item in times" :class="{ active: current === item.value }" @click="handleClickTime(item)"
        :key="item.value">
        {{ item.name }}
      </p>
    </div>
    <chart-bary v-if="current === 'year'" :chartData="barData" labelColor="#fff" :colors="colors2" :isGradient="true"></chart-bary>
    <line-chart v-else :showLegend="true" :legendConfig="legendConfig" :chartData="chartData" :colors="colors" :showYLabel="true"
      :pageLen="24" :isGradient="true" :gradientBySelf="true">
    </line-chart>
  </wrap-title>
</template>
<script>
import LineChart from "@/components/Charts/Line/ChartLine";
import ChartBary from "@/components/Charts/BarY/ChartBarYForValuePosition";
import WrapTitle from "@/components/MTitle/WrapTitle";
import dayjs from "dayjs";
import { getCodeStatics, getCodeStaticsYear } from "./api";

export default {
  name: "NumStatics",
  components: {
    WrapTitle,
    LineChart,
    ChartBary
  },
  props: {},
  watch: {},
  data() {
    return {
      current: "month",
      times: [
        { name: "日", value: "day" },
        { name: "周", value: "week" },
        { name: "月", value: "month" },
        { name: "年", value: "year" }
      ],
      legendConfig: {
        icon: "rect",
        itemWidth: 20,
        itemHeight: 6,
        top: 0,
        right: 250,
      },
      chartData: [],
      barData: [],
      colors: ["#1ABC9C", "#679DF4", "#F96F4F", "#BE6CCC", "#D0021B"],
      colors2: Object.freeze(["#4FCFD5", "#2E9BCF"])
    };
  },
  created() { },
  methods: {
    handleClickTime(item) {
      this.current = item.value
      this.getStatics()
    },
    async getStatics() {
      let params = {}
      if (this.current == "day") {
        params["start"] = dayjs()
          .startOf("day")
          .unix();
        params["end"] = dayjs()
          .endOf("day")
          .unix();
        params["type"] = "hour";
      } else if (this.current == "week") {
        params["start"] = dayjs()
          .startOf("week")
          .unix();
        params["end"] = dayjs()
          .endOf("week")
          .unix();
        params["type"] = "day";
      } else if (this.current == "month") {
        params["start"] = dayjs()
          .startOf("month")
          .unix();
        params["end"] = dayjs()
          .endOf("month")
          .unix();
        params["type"] = "day";
      }
      if (this.current !== 'year') {
        const res = await getCodeStatics(params);

        this.chartData = [
          ["时间", "业务扫码", "市民扫码"],
          ...res.map((item) => {
            return [item.dat, item.yewu, item.shimin];
          })
        ]
      } else {
        console.log(dayjs().valueOf())
        params['start'] = String(dayjs().subtract(365, 'day').valueOf()).substring(0, 10)
        params['end'] = String(new Date().getTime()).substring(0, 10)
        const res = await getCodeStaticsYear(params)
        let shimin = 0
        let yewu = 0
        res.forEach(item => {
          shimin += Number(item.shimin) || 0
          yewu += Number(item.yewu) || 0
        })
        this.barData = [['扫码总量', '总数'], ['业务扫码(次)', yewu], ['市民扫码(次)', shimin]]
      }
    }
  },
  mounted() {
    this.getStatics()
  }
}
</script>
<style lang="scss" scoped>
.dashboard {
  padding: 0.1rem 0;
  height: 3.5rem;
  position: relative;

  .times-tab {
    position: absolute;
    display: flex;
    align-items: center;
    top: 0.2rem;
    right: 0.1rem;
    color: #92b9f7;

    &>p {
      font-size: 0.36rem;
      cursor: pointer;

      &+p {
        margin-left: 0.2rem;
      }

      &.active {
        color: #ffffff;
      }
    }
  }
}
</style>
