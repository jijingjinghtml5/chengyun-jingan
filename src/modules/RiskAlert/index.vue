<template>
<div class="container">
    <wrap-title txt="风险预警" :level="1" icon="icon-ditanshijiancha">
      <div slot="right" class="title-right">
        <span>预警总数：</span>
        <span>{{total | thousandCentimeter}}</span>
      </div>
      <div style="margin-top:20px;height: 100%;">
        <div v-if="activeItem" class="detail-container">
          <div class="close" @click="activeItem=null">[返回]</div>
          <div class="icon">
            <span class="iconfont icon-fangyililiang" style="color:#D0021B"></span>
          </div>
          <div class="body">
            <div class="title">{{activeItem.type}}</div>
            <div class="sub">
              <span style="margin-right:40px;">发布时间：{{activeItem.time}}</span>
              <span style="margin-right:40px;">发布单位：{{activeItem.unit}}</span>
              <span style="margin-right:40px;">对口人：{{activeItem.people}}</span>
            </div>
            <div class="detail">
              <p class="label">预警描述：</p>
              <p class="content">{{activeItem.info}}</p>
            </div>
            <div class="btn"><span class="iconfont icon-mapPin"></span>在地图上查看</div>
          </div>
        </div>
        <auto-scroll-wrap
          v-else
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
              <div class="cell opt">
                <span class="iconfont icon-fasong" style="cursor:pointer;" @click="showDetail(item)"></span>
              </div>
            </div>
          </RecycleScroller>
        </auto-scroll-wrap>
      </div>
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
      activeItem: null,
      activeIndex: -1,
      total: 1000,
      dataset: [
        {
          id: 1,
          image: "",
          type: "疫情防控",
          time: "今日8:00",
          unit: "市卫健委",
          people: "代用名",
          info: "高风险地区来沪列车即将到达上海火车站，请做好防范准备,高风险地区来沪列车即将到达上海火车站，请做好防范准备,高风险地区来沪列车即将到达上海火车站，请做好防范准备高风险地区来沪列车即将到达上海火车站，请做好防范准备高风险地区来沪列车即将到达上海火车站，请做好防范准备高风险地区来沪列车即将到达上海火车站，请做好防范准备"
        },
        {
          id: 2,
          image: "",
          type: "疫情防控",
          time: "今日8:00",
          unit: "市卫健委",
          people: "代用名",
          info: "高风险地区来沪列车即将到达上海火车站，请做好防范准备,高风险地区来沪列车即将到达上海火车站，请做好防范准备,高风险地区来沪列车即将到达上海火车站，请做好防范准备高风险地区来沪列车即将到达上海火车站，请做好防范准备高风险地区来沪列车即将到达上海火车站，请做好防范准备高风险地区来沪列车即将到达上海火车站，请做好防范准备"
        },
        {
          id: 3,
          image: "",
          type: "疫情防控",
          time: "今日8:00",
          unit: "市卫健委",
          people: "代用名",
          info: "高风险地区来沪列车即将到达上海火车站，请做好防范准备,高风险地区来沪列车即将到达上海火车站，请做好防范准备,高风险地区来沪列车即将到达上海火车站，请做好防范准备高风险地区来沪列车即将到达上海火车站，请做好防范准备高风险地区来沪列车即将到达上海火车站，请做好防范准备高风险地区来沪列车即将到达上海火车站，请做好防范准备"
        },
        {
          id: 4,
          image: "",
          type: "疫情防控",
          time: "今日8:00",
          unit: "市卫健委",
          people: "代用名",
          info: "高风险地区来沪列车即将到达上海火车站，请做好防范准备,高风险地区来沪列车即将到达上海火车站，请做好防范准备,高风险地区来沪列车即将到达上海火车站，请做好防范准备高风险地区来沪列车即将到达上海火车站，请做好防范准备高风险地区来沪列车即将到达上海火车站，请做好防范准备高风险地区来沪列车即将到达上海火车站，请做好防范准备"
        },
        {
          id: 5,
          image: "",
          type: "疫情防控",
          time: "今日8:00",
          unit: "市卫健委",
          people: "代用名",
          info: "高风险地区来沪列车即将到达上海火车站，请做好防范准备,高风险地区来沪列车即将到达上海火车站，请做好防范准备,高风险地区来沪列车即将到达上海火车站，请做好防范准备高风险地区来沪列车即将到达上海火车站，请做好防范准备高风险地区来沪列车即将到达上海火车站，请做好防范准备高风险地区来沪列车即将到达上海火车站，请做好防范准备"
        },
        {
          id: 6,
          image: "",
          type: "疫情防控",
          time: "今日8:00",
          unit: "市卫健委",
          people: "代用名",
          info: "高风险地区来沪列车即将到达上海火车站，请做好防范准备,高风险地区来沪列车即将到达上海火车站，请做好防范准备,高风险地区来沪列车即将到达上海火车站，请做好防范准备高风险地区来沪列车即将到达上海火车站，请做好防范准备高风险地区来沪列车即将到达上海火车站，请做好防范准备高风险地区来沪列车即将到达上海火车站，请做好防范准备"
        }
      ],
      rowHeight: 130
    };
  },
  methods: {
    showDetail(item) {
      this.activeItem = item;
    },
    handleClickForCaseList(item) {

    }
  }
};
</script>
<style lang="scss" scoped>
.container{
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
    line-height: 1.5;
    .cell{
      padding: 0 10px;
    }
    .icon{
      width: 102px;
      height: 72px;
    }
    .title{
      width: 300px;
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
      height: 80px;
      overflow: hidden;
      font-size: 28px;
      line-height: 45px;
    }
    .opt{
      width: 80px;
      font-size: 52px;
    }

  }
  .detail-container{
    position: relative;
    height: 100%;
    display: flex;
    border-top: 2px solid #4E78A4;
    border-bottom: 2px solid #4E78A4;
    .icon{
      padding: 20px;
      width: 90px;
      font-size: 52px;
    }
    .body{
      flex: 1;
      padding: 20px;
      .title{
        font-size: 36px;
        font-weight: bold;
        color:#ffffff;
      }
      .sub{
        color: #92B9F7;
        font-size: 28px;
        line-height: 1.5;
      }
      .detail{
        padding: 20px 0;
        color:#fff;
        line-height: 1.5;
        .label{
          font-size: 32px;
          font-weight: bold;
        }
        .content{
          font-size: 28px;
        }
      }
      .btn{
        cursor: pointer;
        padding: 0 20px;
        width: 240px;
        line-height: 52px;
        background: rgba(37, 115, 239, 0.4);
        border: 2px solid #2573EF;
        .iconfont{
          font-size: 30px;
        }
      }
    }
    .close{
      position:absolute;
      right: 0;
      top: 20px;
      color: #92B9F7;
      cursor: pointer;
      font-size: 24px;
    }
  }
}
</style>
