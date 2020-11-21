<template>
<div class="container">
    <wrap-title txt="风险预警" :level="1" icon="icon-qujiducha">
      <div slot="right" class="title-right">
        <span>预警总数：</span>
        <span>{{total | thousandCentimeter}}</span>
      </div>
      <auto-scroll-wrap
      style="margin-top:20px"
      v-show="dataset && dataset.length"
      :isVirtual="true"
      :dataset="dataset"
      :stop="activeIndex !== -1"
      :distance="createFnForCalcRealPx(5)">
      <RecycleScroller
        ref="wrap"
        :items="dataset"
        :itemSize="rowHeight"
        :keyField="'id'"
        v-slot="{ item, index }">
        <div class="li-item"  @click="handleClickForCaseList(item, index)">
          <div class="cell icon">
            <img style="width:72px;height:72px;" :src="item.image" alt="">
          </div>
          <div class="cell title">
            <p class="type text-ellipsis">{{ item.type }}</p>
            <p class="time text-ellipsis">发布时间:{{ item.time }}</p>
          </div>
          <div class="cell info">
            {{item.info}}
          </div>
          <div class="cell opt"></div>
        </div>
      </RecycleScroller>
      </auto-scroll-wrap>
    </wrap-title>
</div>
</template>

<script>
import WrapTitle from "@/components/MTitle/WrapTitle";
import MTitle from "@/components/MTitle/LevelTitle";
import AutoScrollWrap from "@/components/AutoScrollWrap";
import { RecycleScroller } from "vue-virtual-scroller";
import "vue-virtual-scroller/dist/vue-virtual-scroller.css";

export default {
  name: "RiskAlert",
  inject: ["createFnForCalcRealPx"],
  components: { WrapTitle, MTitle, AutoScrollWrap, RecycleScroller },
  data() {
    return {
      activeIndex: -1,
      total: 1000,
      dataset: [
        {
          id: 1,
          image: "",
          type: "疫情防控",
          time: "今日8:00",
          info: "高风险地区来沪列车即将到达上海火车站，请做好防范准备,高风险地区来沪列车即将到达上海火车站，请做好防范准备,高风险地区来沪列车即将到达上海火车站，请做好防范准备高风险地区来沪列车即将到达上海火车站，请做好防范准备高风险地区来沪列车即将到达上海火车站，请做好防范准备高风险地区来沪列车即将到达上海火车站，请做好防范准备"
        },
        {
          id: 2,
          image: "",
          type: "疫情防控",
          time: "今日8:00",
          info: "高风险地区来沪列车即将到达上海火车站，请做好防范准备,高风险地区来沪列车即将到达上海火车站，请做好防范准备,高风险地区来沪列车即将到达上海火车站，请做好防范准备高风险地区来沪列车即将到达上海火车站，请做好防范准备高风险地区来沪列车即将到达上海火车站，请做好防范准备高风险地区来沪列车即将到达上海火车站，请做好防范准备"
        },
        {
          id: 3,
          image: "",
          type: "疫情防控",
          time: "今日8:00",
          info: "高风险地区来沪列车即将到达上海火车站，请做好防范准备,高风险地区来沪列车即将到达上海火车站，请做好防范准备,高风险地区来沪列车即将到达上海火车站，请做好防范准备高风险地区来沪列车即将到达上海火车站，请做好防范准备高风险地区来沪列车即将到达上海火车站，请做好防范准备高风险地区来沪列车即将到达上海火车站，请做好防范准备"
        },
        {
          id: 4,
          image: "",
          type: "疫情防控",
          time: "今日8:00",
          info: "高风险地区来沪列车即将到达上海火车站，请做好防范准备,高风险地区来沪列车即将到达上海火车站，请做好防范准备,高风险地区来沪列车即将到达上海火车站，请做好防范准备高风险地区来沪列车即将到达上海火车站，请做好防范准备高风险地区来沪列车即将到达上海火车站，请做好防范准备高风险地区来沪列车即将到达上海火车站，请做好防范准备"
        },
        {
          id: 5,
          image: "",
          type: "疫情防控",
          time: "今日8:00",
          info: "高风险地区来沪列车即将到达上海火车站，请做好防范准备,高风险地区来沪列车即将到达上海火车站，请做好防范准备,高风险地区来沪列车即将到达上海火车站，请做好防范准备高风险地区来沪列车即将到达上海火车站，请做好防范准备高风险地区来沪列车即将到达上海火车站，请做好防范准备高风险地区来沪列车即将到达上海火车站，请做好防范准备"
        }
      ],
      rowHeight: 130
    };
  },
  methods: {
    handleClickForCaseList(item) {

    }
  }
};
</script>
<style lang="scss" scoped>
.container{
  padding: 0.2rem;
  height: 100%;
  background: linear-gradient(180deg, rgba(84, 88, 169, 0) 0%, rgba(21, 79, 163, 0.4) 100%);
  .title-right{
    color: #ffffff;
  }

  .li-item{
    border-top: 2px solid #4E78A4;
    border-bottom: 2px solid #4E78A4;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 118px;
    .cell{
      padding: 0 10px;
    }
    .icon{
      width: 102px;
      height: 72px;
    }
    .title{
      width: 300px;
      line-height: 40px;
      .type{
        font-size: 36px;
        font-weight: bold;
      }
      .time{
        font-size: 28px;
        color:#92B9F7;
      }
    }
    .info{
      flex: 1;
      height: 76px;
      overflow: hidden;
      font-size: 28px;
      line-height: 40px;
    }
    .opt{
      width: 80px;
    }

  }
}
</style>
