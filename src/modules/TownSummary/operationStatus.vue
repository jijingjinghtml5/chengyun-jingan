<template>
  <div class="module">
    <m-tabs v-model="tab" :tabs="tabs" ref="tab1"></m-tabs>
    <chartbar-y :chartData="dataset[tab] || []" :isGradient="true" :colors="colors" labelColor="#fff"  @mouseenter.native="handleMouse('tab1', 'enter')" @mouseleave.native="handleMouse('tab1', 'leave')"></chartbar-y>
    <m-tabs v-model="tab2" :tabs="tabs2" ref="tab2"></m-tabs>
    <chartbar-y :chartData="dataset[tab2] || []" :isGradient="true" :colors="colors" labelColor="#fff"  @mouseenter.native="handleMouse('tab2', 'enter')" @mouseleave.native="handleMouse('tab2', 'leave')"></chartbar-y>
  </div>
</template>
<script>
import MTabs from "@/components/MTabs";
import ChartbarY from "@/components/Charts/BarY/ChartBarYForValuePosition";
import { reCallAndNeedCallApi } from "@/utils/tools";
import { getChartData, getChartData2, getChartDataHotline } from "./api";
export default {
  name: "operationStatus",
  components: {
    MTabs,
    ChartbarY
  },
  data() {
    return {
      colors: Object.freeze(["#4FCFD5", "#2E9BCF"]),
      tabs: Object.freeze([
        { label: "网格事部件", value: "grid" },
        { label: "热线批量工单", value: "hotline" },
        { label: "110非警情", value: "110" }
      ]),
      tabs2: Object.freeze([
        { label: "151智能感知事件", value: "151" }
      ]),
      tab: "grid",
      tab2: "151",
      streetList: ['静安寺街道', '曹家渡街道', '江宁路街道', '石门二路街道', '南京西路街道', '天目西路街道', '北站街道', '宝山路街道', '芷江西路街道',
        '共和新路街道', '大宁路街道', '彭浦新村街道', '临汾路街道', '彭浦镇'],
      dataset: {
        grid: [
          ["网格事部件", "数量"]
          // ["南京西路", 2098],
          // ["静安寺", 1752],
          // ["共和新路", 1265],
          // ["大宁路", 1087],
          // ["曹家渡", 887],
          // ["天目西路", 887],
          // ["宝山路", 887],
          // ["江宁路", 887],
          // ["北站", 887],
          // ["临汾路", 887],
          // ["芷江西", 887],
          // ["石门二路", 887],
          // ["彭浦新村", 887],
          // ["彭浦镇", 887]
        ],
        "110": [],
        "hotline": [],
        homeQuarantine: [
          ["居家隔离工单", "数量"]
          // ["南京西路", 2098],
          // ["静安寺", 1752],
          // ["共和新路", 1265],
          // ["大宁路", 1087],
          // ["曹家渡", 887],
          // ["天目西路", 887],
          // ["宝山路", 887],
          // ["江宁路", 887],
          // ["北站", 887],
          // ["临汾路", 887],
          // ["芷江西", 887],
          // ["石门二路", 887],
          // ["彭浦新村", 887],
          // ["彭浦镇", 887]
        ],
        "1+3+N": [],
        "151": []
      },
      callApi1: null,
      callApi2: null
    };
  },
  watch: {
    tab() {
      this.callApi1(this.tab);
    },
    tab2() {
      this.callApi2(this.tab2);
    }
  },
  methods: {
    handleMouse(ref, mouse) {
      if (mouse === "enter") {
        this.$refs[ref].stopTimer();
      } else {
        this.$refs[ref].startTimer();
      }
    },
    afterCalloApi(data, key) {
      console.log(">>>>", data, key);
      if (!data) return;
      this.dataset[key] = [
        ["街镇", "数量"],
        ...(data.data || []).map(item => {
          return [item.town.replace("街道", ""), item.count];
        })
      ];
    },
    afterCalloApiGrid(data, key) {
      console.log(">>>>", data, key);
      if (!data) return;
      let list = [["街镇", "数量"]]
      this.streetList.forEach(item => {
        (data.data || []).forEach(m => {
          if (m.town === item) {
            list.push([m.town.replace("街道", ""), m.count])
          }
        })
      })
      this.dataset[key] = list
    },
    afterCalloApiHotline(data, key) {
      console.log(">>>>", data, key);
      if (!data) return;
      let list = [["街镇", "数量"]]
      this.streetList.forEach(item => {
        (data || []).forEach(m => {
          if (m['town.areaName'] === item) {
            list.push([m['town.areaName'], m.count])
          }
        })
      })
      this.dataset[key] = list
    },
    afterCalloApi2(data, key) {
      console.log(">>>>2", data, key);
      if (!data) return;
      this.dataset[key] = [
        ["街镇", "数量"],
        ...(data || []).map(item => {
          return [item['town.areaName'], item.count];
        })
      ];
    },
  },
  created() {
    this.callApi1 = reCallAndNeedCallApi(this, 10 * 60 * 1000, {
      grid: {
        api: getChartData,
        params: [1],
        cb: this.afterCalloApiGrid
      },
      hotline: {
        api: getChartDataHotline,
        params: [2],
        cb: this.afterCalloApiHotline
      },
      "110": {
        api: getChartData,
        params: [3],
        cb: this.afterCalloApi
      }

    });

    this.callApi2 = reCallAndNeedCallApi(this, 10 * 60 * 1000, {
      "151": {
        api: getChartData,
        params: [6],
        cb: this.afterCalloApi
      }
    });

    this.callApi1("grid");
    this.callApi2("151");
  }
};
</script>
<style lang="scss" scoped>
.module {
  height: 100%;
  display: flex;
  flex-direction: column;
  > div {
    margin-bottom: 0.2rem;
    &:last-child {
      margin-bottom: 0;
    }
  }
}
.m-tabs {
  font-size: 0.24rem;
  line-height: 0.48rem;
  text-align: center;
  /deep/ {
    .m-tabs__item {
      width: 2rem;
      background-color: rgba(#2573EF, 0.8);
      border: 0.02rem solid #2573EF;
      margin-right: 0.1rem;
      &.is-active {
        color: #fff;
      }
      :last-of-type {
        margin-right: 0;
      }
    }
    .m-tabs__item-line {
      display: none;
    }
  }
}
.v-chart-container {
  height: 0;
  flex: 1;
}
</style>
