<template>
  <wrap-title txt="张贴统计" :level="2" icon="icon-biaoti" class="dashboard">
    <m-tabs
      slot="level-title"
      v-model="tab"
      :tabs="tabs"
      :autoChange="false"
    ></m-tabs>
    <template v-if="tab === 'statics'">
      <div class="typeList">
        <span :class="type == 'open' ? 'active' : ''" @click="type = 'open'"
          >发现</span
        >
        <span :class="type == 'close' ? 'active' : ''" @click="type = 'close'"
          >结案</span
        >
      </div>
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
    </template>
  </wrap-title>
</template>
<script>
import dayjs from "dayjs";
import WrapTitle from "@/components/MTitle/WrapTitle";
import LineChart from "@/components/Charts/Line/ChartLine";
import MTabs from "@/components/MTabs";
import { getDistrictCase, getStreetCase } from "./api";

export default {
  name: "caseStatics",
  components: {
    WrapTitle,
    LineChart,
    MTabs,
  },
  props: {},
  watch: {},
  data() {
    return {
      tabs: Object.freeze([
        { label: "案件统计", value: "statics" },
        // { label: "案件列表", value: "case" }
      ]),
      tab: "statics",
      current: "day",
      legendConfig: {
        icon: "rect",
        itemWidth: 20,
        itemHeight: 6,
        top: 0,
        right: 250,
      },
      type: "open",
      times: [
        { name: "日", value: "day" },
        { name: "周", value: "week" },
        { name: "月", value: "month" },
      ],
      colors: ["#1ABC9C", "#679DF4", "#F96F4F", "#BE6CCC", "#D0021B"],
      district: {},
      ppStreet: {},
      cjdStreet: {},
      closeData: [],
      openData: [],
    };
  },
  computed: {
    chartData() {
      return this.type == "open" ? this.openData : this.closeData;
    },
  },
  methods: {
    handleClickTime(item) {
      this.current = item.value;
      this.getData();
    },
    async getData() {
      let params = {};
      if (this.current == "day") {
        params["start"] = dayjs()
          .startOf("day")
          .unix();
        params["end"] = dayjs()
          .endOf("day")
          .unix();
        params["startVal"] = dayjs()
          .startOf("day")
          .format("YYYY-MM-DD HH:mm:ss");
        params["endVal"] = dayjs()
          .endOf("day")
          .format("YYYY-MM-DD HH:mm:ss");
        params["type"] = "hour";
      } else if (this.current == "week") {
        params["start"] = dayjs()
          .startOf("week")
          .unix();
        params["end"] = dayjs()
          .endOf("week")
          .unix();
        params["startVal"] = dayjs()
          .startOf("week")
          .format("YYYY-MM-DD HH:mm:ss");
        params["endVal"] = dayjs()
          .endOf("week")
          .format("YYYY-MM-DD HH:mm:ss");
        params["type"] = "day";
      } else if (this.current == "month") {
        params["start"] = dayjs()
          .startOf("week")
          .unix();
        params["end"] = dayjs()
          .endOf("month")
          .unix();
        params["startVal"] = dayjs()
          .startOf("month")
          .format("YYYY-MM-DD HH:mm:ss");
        params["endVal"] = dayjs()
          .endOf("month")
          .format("YYYY-MM-DD HH:mm:ss");
        params["type"] = "day";
      }
      const p1 = getDistrictCase(params);
      const p2 = getStreetCase({ ...params, street: "曹家渡街道" });
      const p3 = getStreetCase({ ...params, street: "彭浦新村街道" });
      Promise.all([p1, p2, p3])
        .then((result) => {
          let district = {};
          result[0][`openTS.${params.type}`].map((item) => {
            district[item.time_fm] = {
              dat: item.time_fm,
              coun: item.count,
            };
          });
          result[0][`closeTS.${params.type}`].map((item) => {
            if (district[item.time_fm]) {
              district[item.time_fm]["close"] = item.close;
            }
          });
          this.district = district;

          let ppStreet = {};
          result[1] &&
            result[1].map((item) => {
              ppStreet[item.dat] = {
                dat: item.dat,
                coun: item.coun,
                close: item.close_count,
              };
            });
          this.ppStreet = ppStreet;

          let cjdStreet = {};
          result[2] &&
            result[2].map((item) => {
              cjdStreet[item.dat] = {
                dat: item.dat,
                coun: item.coun,
                close: item.close_count,
              };
            });
          this.cjdStreet = cjdStreet;

          let time = [
            ...new Set([
              ...Object.keys(this.district),
              ...Object.keys(this.ppStreet),
              ...Object.keys(this.cjdStreet),
            ]),
          ];
          time = time.sort((a, b) => {
            return dayjs(a).unix() - dayjs(b).unix()
          })
          console.log(time, "time");
          this.closeData = [
            ["时间", "区级码(静安码)", "街镇码(静安码)", "街镇码(彭浦新村码)"],
            ...time.map((item) => {
              return [
                this.current == "day" ? item.split(" ")[1] : item,
                (this.district[item] && this.district[item].close) || 0,
                (this.cjdStreet[item] && this.cjdStreet[item].close) || 0,
                (this.ppStreet[item] && this.ppStreet[item].close) || 0,
              ];
            }),
          ];

          this.openData = [
            ["时间", "区级码(静安码)", "街镇码(静安码)", "街镇码(彭浦新村码)"],
            ...time.map((item) => {
              return [
                this.current == "day" ? item.split(" ")[1] : item.split("-")[2],
                (this.district[item] && this.district[item].coun) || 0,
                (this.cjdStreet[item] && this.cjdStreet[item].coun) || 0,
                (this.ppStreet[item] && this.ppStreet[item].coun) || 0,
              ];
            }),
          ];
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  mounted() {
    this.getData();
  },
};
</script>
<style lang="scss" scoped>
.dashboard {
  padding: 0.1rem 0;
  height: 4rem;
  position: relative;
  margin-top: 10px;
  .typeList {
    span {
      margin-right: 10px;
      &.active {
        color: #92b9f7;
      }
    }
  }
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
