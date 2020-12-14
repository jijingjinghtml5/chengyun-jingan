<template>
  <wrap-title class="gradient-bg" icon="icon-chengshizhili" txt="城市治理">
    <!-- <m-select class="style1" slot="right" v-model="option" :options="options"></m-select> -->
    <level-title :level="2" icon="icon-biaoti" txt="城市建设"></level-title>
    <m-row>
      <m-column>
        <overview-item
          name="绿地建设（㎡）"
          :value="dataset.statistics.greenland"
          :increase="dataset.statistics.greenland_increase"
          customClass="style6">
        </overview-item>
      </m-column>
      <m-column>
        <overview-item
          name="住宅建设（㎡）"
          :value="dataset.statistics.residence"
          :increase="dataset.statistics.residence_increase"
          customClass="style6">
        </overview-item>
      </m-column>
      <m-column>
        <overview-item
          name="商品房开发（㎡）"
          :value="dataset.statistics.house"
          :increase="dataset.statistics.house_increase"
          customClass="style6">
        </overview-item>
      </m-column>
    </m-row>
    <level-title :level="2" icon="icon-biaoti" txt="城市管理"></level-title>
    <m-row>
      <m-column width="33.33%">
        <overview-item
          name="劳动仲裁（件）"
          :value="dataset.statistics.labor_arbitation"
          :increase="dataset.statistics.labor_arbitation_increase"
          customClass="style6">
        </overview-item>
      </m-column>
      <m-column width="33.33%">
        <overview-item
          name="消费者投诉办结率"
          :value="dataset.statistics.consumer_complaint_completion_rate"
          :increase="dataset.statistics.consumer_complaint_completion_rate_increase"
          valueUnit="%"
          customClass="style6">
        </overview-item>
      </m-column>
      <m-column width="33.33%">
        <overview-item
          name="质量投诉处理率"
          :value="dataset.statistics.quality_complaint_handle_rate"
          :increase="dataset.statistics.quality_complaint_handle_rate_increase"
          valueUnit="%"
          customClass="style6">
        </overview-item>
      </m-column>
      <m-column width="50%">
        <overview-item
          name="食品安全监督检查（人次）"
          :value="dataset.statistics.food_safety_check"
          :increase="dataset.statistics.qfood_safety_check_increase"
          customClass="style6">
        </overview-item>
      </m-column>
      <m-column width="50%">
        <overview-item
          name="生产安全事故（件）"
          :value="dataset.statistics.production_safety_accident"
          :increase="dataset.statistics.production_safety_accident_increase"
          customClass="style6">
        </overview-item>
      </m-column>
    </m-row>
    <level-title :level="2" icon="icon-biaoti" txt="城市交通"></level-title>
    <level-title :level="4" txt="实时拥堵路段">
      <m-tabs class="road-select" slot="right" v-model="tab" :tabs="tabs"></m-tabs>
    </level-title>
    <ul class="list in-flex">
      <li class="list-item" v-for="(item, index) in dataset[tab]" :key="item.primeID">
        <span class="list-item__id">{{ index + 1 }}</span>
        <div class="list-item__infor">
          <p>{{ item.road }}</p>
          <p>指数：{{ item.score }}</p>
        </div>
        <p class="list-item__status" :style="{ backgroundColor: item.color + '66', borderColor: item.color }">
          <i class="iconfont" :class="item.icon"></i>
          {{ item.text }}
        </p>
      </li>
    </ul>
  </wrap-title>
</template>
<script>
import WrapTitle from "@/components/MTitle/WrapTitle";
import LevelTitle from "@/components/MTitle/LevelTitle";
import MSelect from "@/components/MSelect";
import MRow from "@/components/Layout/MRow";
import MColumn from "@/components/Layout/MColumn";
import OverviewItem from "@/components/OverviewItem";
import MTabs from "@/components/MTabs";
import { getData } from "./api";
export default {
  name: "UrbanGovernance",
  components: {
    WrapTitle,
    LevelTitle,
    MSelect,
    MRow,
    MColumn,
    OverviewItem,
    MTabs
  },
  data() {
    return {
      options: Object.freeze([
        { label: "今日", value: "today" },
        { label: "本周", value: "currentWeek" },
        { label: "本月", value: "currentMonth" }
      ]),
      tabs: Object.freeze([
        { label: "快速路", value: "expressway" },
        { label: "地面道路", value: "groud_road" }
      ]),
      option: "today",
      tab: "expressway",
      dataset: {
        expressway: [],
        groud_road: [],
        statistics: {}
      }
    };
  },
  methods: {
    getData() {
      getData().then(res => {
        if (res.expressway) {
          this.dataset.expressway = Object.freeze((res.expressway || []).map(d => {
            return {
              ...d,
              ...(this.convertScore(d.score))
            };
          }));
        }
        if (res.groud_road) {
          this.dataset.groud_road = Object.freeze((res.groud_road || []).map(d => {
            return {
              ...d,
              ...(this.convertScore(d.score))
            };
          }));
        }
        if (res.db && res.db[0]) {
          this.dataset.statistics = res.db[0];
        }
      });
    },
    convertScore(score) {
      const res = { icon: "", color: "", text: "" };
      if (score >= 70) {
        res.icon = "icon-qing-ditu";
        res.color = "#F23470";
        res.text = "堵塞";
      } else if (score >= 50) {
        res.icon = "icon-fengxianshixiang";
        res.color = "#F96F4F";
        res.text = "拥挤";
      } else if (score >= 30) {
        res.icon = "icon-jiaotongchang";
        res.color = "#FCBF51";
        res.text = "较通畅";
      } else {
        res.icon = "icon-changtong";
        res.color = "#1ABC9C";
        res.text = "通畅";
      }
      return res;
    }
  },
  created() {
    this.$timer.register(this.getData, this);
  }
};
</script>
<style lang="scss" scoped>
.road-select {
  &.m-tabs {
    color: #4E78A4;
  }
  /deep/ {
    .m-tabs__item.is-active {
      color: $titleLevel2;
    }
  }
}
.list {
  overflow-y: auto;
}
.list-item {
  display: flex;
  font-size: 0.24rem;
  color: #fff;
}
.list-item__id {
  width: 0.4rem;
  height: 0.4rem;
  border: 0.02rem solid #2E9BCF;
  text-align: center;
  line-height: 0.36rem;
}
.list-item__infor {
  width: 0;
  flex: 1;
  margin: 0 0.1rem;
  line-height: 1.5;
  > p:first-child {
    font-size: 0.28rem;
  }
}
.list-item__status {
  width: 2rem;
  height: 0.44rem;
  line-height: 0.4rem;
  font-size: 0.24rem;
  color: #fff;
  text-align: center;
  border: 0.02rem solid transparent;
  border-radius: 0.22rem;
  // &.serious {
  //   background-color: rgba(#F23470, 0.4);
  //   border-color: #F23470;
  // }
  // &.medium {
  //   background-color: rgba(#FCBF51, 0.4);
  //   border-color: #FCBF51;
  // }

}
</style>
