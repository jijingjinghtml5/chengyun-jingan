<template>
  <wrap-title class="gradient-bg" icon="icon-jingji" txt="经济治理">
    <!-- <m-select class="style1" slot="right" v-model="option" :options="options"></m-select> -->
    <level-title :level="2" icon="icon-biaoti" txt="五大产业和房地产业"></level-title>
    <overview-item style="margin-top: -0.2rem;" value="155091" valueUnit="万元" :increase="-2.43" customClass="style7"></overview-item>
    <chart-pie class="in-flex" :chartData="dataset.ldcysssr_db" :colors="colors" :fontSize="0.24" unit="亿元" labelColor="#D1C9C4">
      <template v-slot:li="{ item }">
        <span class="legend-label text-ellipsis">{{ item[0] }}</span>
        <span class="legend-percent">{{ item[3] }}%</span>
      </template>
    </chart-pie>
    <level-title :level="2" icon="icon-biaoti">
      <m-tabs class="levelt2-select" v-model="tab" :tabs="tabs"></m-tabs>
    </level-title>
    <overview-item style="margin-top: -0.2rem;" value="400.23" valueUnit="亿元" :increase="-2.87" customClass="style7"></overview-item>
    <m-tabs-body class="in-flex" :tab="tab">
      <m-tabs-body-item name="一轴三带" lazy>
        <chart-pie :chartData="dataset.yzsd_db" :colors="colors" :fontSize="0.24" unit="亿元" labelColor="#D1C9C4">
          <template v-slot:li="{ item }">
            <span class="legend-label" style="word-break:break-all;white-space:normal;">{{ item[0] }}</span>
            <span class="legend-percent">{{ item[3] }}%</span>
          </template>
        </chart-pie>
      </m-tabs-body-item>
      <m-tabs-body-item name="楼宇经济" lazy>
        <chart-bary :chartData="dataset.lyjj_db" labelColor="#fff" :colors="colors2" :isGradient="true"></chart-bary>
      </m-tabs-body-item>
      <m-tabs-body-item name="总部经济" lazy>
        <chart-pie :chartData="dataset.zbjj_db" :colors="colors" :fontSize="0.24" unit="亿元" labelColor="#D1C9C4">
          <template v-slot:li="{ item }">
            <span class="legend-label text-ellipsis">{{ item[0] }}</span>
            <span class="legend-percent">{{ item[3] }}%</span>
          </template>
        </chart-pie>
      </m-tabs-body-item>
      <m-tabs-body-item name="园区经济" lazy>
        <chart-bary :chartData="dataset.yqjj_db" labelColor="#fff" :colors="colors2" :isGradient="true"></chart-bary>
      </m-tabs-body-item>
    </m-tabs-body>
    <level-title :level="2" icon="icon-biaoti">
      <m-tabs class="levelt2-select" v-model="tab2" :tabs="tabs2"></m-tabs>
    </level-title>
    <m-tabs-body class="autoHeight" :tab="tab2">
      <m-tabs-body-item name="社会消费" lazy>
        <m-row>
          <m-column>
            <overview-item name="商品销售总额" value="115" valueUnit="亿元" :increase="25.39" customClass="style7"></overview-item>
          </m-column>
          <m-column>
            <overview-item name="主要商业综合体" value="42" valueUnit="亿元" :increase="6.11" customClass="style7"></overview-item>
          </m-column>
          <m-column>
            <overview-item name="旅游业接待" value="120654" valueUnit="人次" :increase="-6.11" customClass="style7"></overview-item>
          </m-column>
        </m-row>
      </m-tabs-body-item>
      <m-tabs-body-item name="外商投资" lazy>
        <m-row>
          <m-column>
            <overview-item name="合同项目" value="115" valueUnit="个" increase="25.39" customClass="style7"></overview-item>
          </m-column>
          <m-column>
            <overview-item name="合同金额" value="7651" valueUnit="万美元" :increase="-6.11" customClass="style7"></overview-item>
          </m-column>
        </m-row>
      </m-tabs-body-item>
      <m-tabs-body-item name="招商引资" lazy>
        <m-row>
          <m-column>
            <overview-item name="新增企业（家）" value="7651" :increase="-25.39" customClass="style7"></overview-item>
          </m-column>
          <m-column>
            <overview-item name="外资企业占比" value="7651" :increase="-25.39" customClass="style7"></overview-item>
          </m-column>
          <m-column>
            <overview-item name="千万级投资占比" value="7651" :increase="-25.39" customClass="style7"></overview-item>
          </m-column>
        </m-row>
      </m-tabs-body-item>
      <m-tabs-body-item name="科技创新" lazy>
        <m-row>
          <m-column>
            <overview-item name="专利授权书（件）" value="371" increase="32.80" customClass="style7"></overview-item>
          </m-column>
          <m-column>
            <overview-item name="技术合同项目（项）" value="30" :increase="16.30" customClass="style7"></overview-item>
          </m-column>
        </m-row>
      </m-tabs-body-item>
    </m-tabs-body>
  </wrap-title>
</template>
<script>
import WrapTitle from "@/components/MTitle/WrapTitle";
import LevelTitle from "@/components/MTitle/LevelTitle";
import MSelect from "@/components/MSelect";
import OverviewItem from "@/components/OverviewItem";
import MTabs from "@/components/MTabs";
import MTabsBody from "@/components/MTabsBody/MTabsBody";
import MTabsBodyItem from "@/components/MTabsBody/MTabsBodyItem";
import Increase from "@/components/Increase";
import MRow from "@/components/Layout/MRow";
import MColumn from "@/components/Layout/MColumn";
import ChartPie from "./components/ChartPie";
import ChartBary from "@/components/Charts/BarY/ChartBarYForValuePosition";
import { getData } from "./api";
export default {
  name: "EconomicGovernance",
  components: {
    WrapTitle,
    LevelTitle,
    MSelect,
    OverviewItem,
    MTabs,
    MTabsBody,
    MTabsBodyItem,
    Increase,
    MRow,
    MColumn,
    ChartPie,
    ChartBary
  },
  inject: ["createFnForCalcRealPx"],
  data() {
    return {
      colors: Object.freeze(["#30BC9B", "#2E9BCF", "#4FCFD5", "#4E78A4", "#1D7774"]),
      colors2: Object.freeze(["#4FCFD5", "#2E9BCF"]),
      options: Object.freeze([
        { label: "本周", value: "currentWeek" },
        { label: "本月", value: "currentMonth" }
      ]),
      tabs: Object.freeze([
        { label: "一轴三带", value: "一轴三带" },
        { label: "楼宇经济", value: "楼宇经济" },
        { label: "总部经济", value: "总部经济" },
        { label: "园区经济", value: "园区经济" }
      ]),
      tabs2: Object.freeze([
        { label: "社会消费", value: "社会消费" },
        { label: "外商投资", value: "外商投资" },
        { label: "招商引资", value: "招商引资" },
        { label: "科技创新", value: "科技创新" }
      ]),
      option: "currentWeek",
      tab: "一轴三带",
      tab2: "社会消费",
      dataset: {
        ldcysssr_db: [
          ["五大产业和房地产业", "五大产业和房地产业"]
        ],
        yzsd_db: [
          ["一轴三带", "一轴三带"]
        ],
        lyjj_db: [
          ["楼宇经济", "楼宇经济"]
        ],
        zbjj_db: [
          ["总部经济", "总部经济"]
        ],
        yqjj_db: [
          ["园区经济", "园区经济"]
        ]
      }
    };
  },
  methods: {
    getData() {
      getData().then(res => {
        Object.keys(res).forEach(key => {
          let regForDB = /\w+_db$/g;
          if (regForDB.test(key)) {
            console.log(key, "0000");
            let dims = this.dataset[key].slice(0, 1);
            this.dataset[key] = Object.freeze([
              ...dims,
              ...((res[key] || []).map(d => {
                return [d.name, parseFloat(d.value), d.increase || "-", !d.percent || d.percent === "-" ? "-" : Math.round(d.percent * 1000) / 100];
              }))
            ]);
            // this.dataset[key] = Object.freeze((res[key] || []))
          }
        });
      });
    }
  },
  created() {
    this.$timer.register(this.getData, this);
  }
};
</script>
<style lang="scss" scoped>
.levelt2-select {
  &.m-tabs {
    color: #4E78A4;
  }
}
.autoHeight {
  &.m-tabs-body {
    height: auto;
  }
}
.zsyz {
  line-height: 1.5;
  .label {
    font-size: 0.28rem;
    color: $titleLevel2;
  }
  .value {
    font-size: 0.52rem;
    color: #4FCFD5;
    sub {
      font-size: 0.28rem;
      color:#4FCFD5;
      bottom: 0;
    }
  }
  .increase-wp {
    height: 0.36rem;
    display: flex;
    align-items: center;
  }
}
.legend-label {
  width: 0;
  flex: 1;
}
.legend-percent {
  width: 0.9rem;
  text-align: right;
  color: #fff;
}
</style>
