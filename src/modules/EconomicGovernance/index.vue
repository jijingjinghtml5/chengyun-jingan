<template>
  <wrap-title class="gradient-bg" icon="icon-jingji" txt="经济治理">
    <!-- <m-select class="style1" slot="right" v-model="option" :options="options"></m-select> -->
    <level-title :level="2" icon="icon-biaoti" txt="五大产业和房地产业"></level-title>
    <overview-item
      style="margin-top: -0.2rem;"
      valueUnit="万元"
      :value="dataset.statistics.six_industries_tax_revenue"
      :increase="dataset.statistics.six_industries_tax_revenue_increase"
      customClass="style7"></overview-item>
    <chart-pie class="in-flex" :chartData="dataset.ldcysssr_db" :colors="colors" :fontSize="0.24" unit="亿元" labelColor="#D1C9C4">
      <template v-slot:li="{ item }">
        <span class="legend-label text-ellipsis">{{ item[0] }}</span>
        <span class="legend-percent">{{ item[3] }}%</span>
      </template>
    </chart-pie>
    <level-title :level="2" icon="icon-biaoti">
      <m-tabs class="levelt2-select" v-model="tab" :tabs="tabs"></m-tabs>
    </level-title>
    <overview-item
      style="margin-top: -0.2rem;"
      valueUnit="亿元"
      :value="dataset.statistics[tab]"
      :increase="dataset.statistics[tab + '_increase']"
      customClass="style7">
    </overview-item>
    <m-tabs-body class="in-flex" :tab="tab">
      <m-tabs-body-item name="yzsd" lazy>
        <chart-pie :chartData="dataset.yzsd_db" :colors="colors" :fontSize="0.24" unit="亿元" labelColor="#D1C9C4">
          <template v-slot:li="{ item }">
            <span class="legend-label" style="word-break:break-all;white-space:normal;">{{ item[0] }}</span>
            <span class="legend-percent">{{ item[3] }}%</span>
          </template>
        </chart-pie>
      </m-tabs-body-item>
      <m-tabs-body-item name="lyjj" lazy>
        <chart-bary :chartData="dataset.lyjj_db" labelColor="#fff" :colors="colors2" :isGradient="true"></chart-bary>
      </m-tabs-body-item>
      <m-tabs-body-item name="zbjj" lazy>
        <chart-pie :chartData="dataset.zbjj_db" :colors="colors" :fontSize="0.24" unit="亿元" labelColor="#D1C9C4">
          <template v-slot:li="{ item }">
            <span class="legend-label text-ellipsis">{{ item[0] }}</span>
            <span class="legend-percent">{{ item[3] }}%</span>
          </template>
        </chart-pie>
      </m-tabs-body-item>
      <m-tabs-body-item name="yqjj" lazy>
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
            <overview-item
              name="商品销售总额"
              :value="dataset.statistics.goods_total_sales"
              :increase="dataset.statistics.goods_total_sales_increase"
              valueUnit="亿元"
              customClass="style7">
            </overview-item>
          </m-column>
          <m-column>
            <overview-item
              name="主要商业综合体"
              :value="dataset.statistics.major_commercial_complex"
              :increase="dataset.statistics.major_commercial_complex_increase"
              valueUnit="亿元"
              customClass="style7">
            </overview-item>
          </m-column>
          <m-column>
            <overview-item
              name="旅游业接待"
              :value="dataset.statistics.tourism_reception"
              :increase="dataset.statistics.tourism_reception_increase"
              valueUnit="人次"
              customClass="style7">
            </overview-item>
          </m-column>
        </m-row>
      </m-tabs-body-item>
      <m-tabs-body-item name="外商投资" lazy>
        <m-row>
          <m-column>
            <overview-item
              name="合同项目"
              :value="dataset.statistics.contract_items"
              :increase="dataset.statistics.contract_items_increase"
              valueUnit="个"
              customClass="style7">
            </overview-item>
          </m-column>
          <m-column>
            <overview-item
              name="合同金额"
              :value="dataset.statistics.contract_amount"
              :increase="dataset.statistics.contract_amount_increase"
              valueUnit="万美元"
              customClass="style7">
            </overview-item>
          </m-column>
        </m-row>
      </m-tabs-body-item>
      <m-tabs-body-item name="招商引资" lazy>
        <m-row>
          <m-column>
            <overview-item
              name="新增企业（家）"
              :value="dataset.statistics.new_enterprises_number"
              :increase="dataset.statistics.new_enterprises_number_increase"
              customClass="style7">
            </overview-item>
          </m-column>
          <m-column>
            <overview-item
              name="外资企业占比"
              :value="dataset.statistics.foreign_funded_enterprises_percent"
              :increase="dataset.statistics.foreign_funded_enterprises_percent_increase"
              valueUnit="%"
              customClass="style7">
            </overview-item>
          </m-column>
          <m-column>
            <overview-item
              name="千万级投资占比"
              :value="dataset.statistics.ten_million_investment_percent"
              :increase="dataset.statistics.ten_million_investment_percent_increase"
              valueUnit="%"
              customClass="style7">
            </overview-item>
          </m-column>
        </m-row>
      </m-tabs-body-item>
      <m-tabs-body-item name="科技创新" lazy>
        <m-row>
          <m-column>
            <overview-item
              name="专利授权书（件）"
              :value="dataset.statistics.patents_granted_number"
              :increase="dataset.statistics.patents_granted_number_increase"
              customClass="style7">
            </overview-item>
          </m-column>
          <m-column>
            <overview-item
              name="技术合同项目（项）"
              :value="dataset.statistics.technical_contract_project"
              :increase="dataset.statistics.technical_contract_project_increase"
              customClass="style7">
            </overview-item>
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
      colors: Object.freeze(["#30BC9B", "#2E9BCF", "#4FCFD5", "#4E78A4", "#1D7774", "#D1C9C4"]),
      colors2: Object.freeze(["#4FCFD5", "#2E9BCF"]),
      options: Object.freeze([
        { label: "本周", value: "currentWeek" },
        { label: "本月", value: "currentMonth" }
      ]),
      tabs: Object.freeze([
        { label: "一轴三带", value: "yzsd" },
        { label: "楼宇经济", value: "lyjj" },
        { label: "总部经济", value: "zbjj" },
        { label: "园区经济", value: "yqjj" }
      ]),
      tabs2: Object.freeze([
        { label: "社会消费", value: "社会消费" },
        { label: "外商投资", value: "外商投资" },
        { label: "招商引资", value: "招商引资" },
        { label: "科技创新", value: "科技创新" }
      ]),
      option: "currentWeek",
      tab: "yzsd",
      tab2: "社会消费",
      dataset: {
        statistics: {},
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
        console.log(res, "12312");
        Object.keys(res).forEach(key => {
          let regForDB = /\w+_db$/g;
          if (regForDB.test(key)) {
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
        if (res.statistics && res.statistics[0]) {
          this.dataset.statistics = res.statistics[0];
        }
        console.log(this.dataset, "-");
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
