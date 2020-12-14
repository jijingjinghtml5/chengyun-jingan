<template>
  <wrap-title class="gradient-bg" icon="icon-chengshizhili" txt="城市治理">
    <!-- <m-select class="style1" slot="right" v-model="option" :options="options"></m-select> -->
    <level-title :level="2" icon="icon-biaoti" txt="城市建设"></level-title>
    <m-row>
      <m-column>
        <overview-item
          name="绿地建设（㎡）"
          value="30"
          increase="18.45"
          customClass="style6">
        </overview-item>
      </m-column>
      <m-column>
        <overview-item
          name="住宅建设（㎡）"
          value="42"
          increase="6.11"
          customClass="style6">
        </overview-item>
      </m-column>
      <m-column>
        <overview-item
          name="商品房开发（㎡）"
          value="42"
          increase="6.11"
          customClass="style6">
        </overview-item>
      </m-column>
    </m-row>
    <level-title :level="2" icon="icon-biaoti" txt="城市管理"></level-title>
    <m-row>
      <m-column width="33.33%">
        <overview-item
          name="劳动仲裁（件）"
          value="30"
          increase="18.45"
          customClass="style6">
        </overview-item>
      </m-column>
      <m-column width="33.33%">
        <overview-item
          name="消费者投诉办结率"
          value="96.18"
          valueUnit="%"
          increase="6.11"
          customClass="style6">
        </overview-item>
      </m-column>
      <m-column width="33.33%">
        <overview-item
          name="质量投诉处理率"
          value="100"
          valueUnit="%"
          increase="6.11"
          customClass="style6">
        </overview-item>
      </m-column>
      <m-column width="50%">
        <overview-item
          name="视频安全监督检查（人次）"
          value="3209"
          increase="18.45"
          customClass="style6">
        </overview-item>
      </m-column>
      <m-column width="50%">
        <overview-item
          name="生产安全事故（件）"
          value="42"
          :increase="-6.11"
          customClass="style6">
        </overview-item>
      </m-column>
    </m-row>
    <level-title :level="2" icon="icon-biaoti" txt="城市交通"></level-title>
    <level-title :level="4" txt="实时拥堵路段">
      <m-tabs class="road-select" slot="right" v-model="tab" :tabs="tabs"></m-tabs>
    </level-title>
    <ul class="list in-flex">
      <li class="list-item" v-for="(item, index) in dataset.list" :key="item.id">
        <span class="list-item__id">{{ index + 1 }}</span>
        <div class="list-item__infor">
          <p>{{ item.road }}</p>
          <p>持续时间：{{ item.duration }}</p>
        </div>
        <p v-if="item.status === '严重拥堵'" class="list-item__status serious">
          <i class="iconfont icon-chaoqianjian-lianghongdeng"></i>
          {{ item.status }}
        </p>
        <p v-else-if="item.status === '拥堵'" class="list-item__status medium">
          <i class="iconfont icon-jinjidaiban-lianghuangdeng"></i>
          {{ item.status }}
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
        { label: "快速路", value: "快速路" },
        { label: "地面道路", value: "地面道路" }
      ]),
      option: "today",
      tab: "快速路",
      dataset: {
        list: Object.freeze([
          { id: 1, road: "嘉闵高速G60立交北向东匝道", duration: "10分钟", status: "严重拥堵" },
          { id: 2, road: "嘉闵高速G60立交北向东匝道", duration: "10分钟", status: "严重拥堵" },
          { id: 3, road: "嘉闵高速G60立交北向东匝道", duration: "10分钟", status: "拥堵" },
          { id: 4, road: "嘉闵高速G60立交北向东匝道", duration: "10分钟", status: "拥堵" },
          { id: 5, road: "嘉闵高速G60立交北向东匝道", duration: "10分钟", status: "拥堵" }
        ])
      }
    };
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
  &.serious {
    background-color: rgba(#F23470, 0.4);
    border-color: #F23470;
  }
  &.medium {
    background-color: rgba(#FCBF51, 0.4);
    border-color: #FCBF51;
  }

}
</style>
