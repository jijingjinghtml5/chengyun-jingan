<template>
<div class="container gradient-bg">
    <wrap-title txt="风险预警" :level="1" icon="icon-ditanshijiancha">
      <div slot="right" class="title-right">
        <span>预警总数：</span>
        <span>{{total | thousandCentimeter}}</span>
      </div>
      <div style="margin-top:20px;height: 100%;">
        <div v-if="activeItem" class="detail-container">
          <div class="close" @click="activeItem=null">[返回]</div>
          <div :class="`icon color${activeItem.level || 4}`">
            <span :class="`iconfont ${getIcon(activeItem)}`"></span>
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
            v-slot="{ item }">
            <div class="li-item">
              <div :class="`cell icon color${item.level || 4}`">
                <span :class="getIcon(item)"></span>
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
          level: 1,
          type: "疫情防控",
          time: "今日8:00",
          unit: "市卫健委",
          people: "代用名",
          info: "高风险地区来沪列车即将到达上海火车站，请做好防范准备,高风险地区来沪列车即将到达上海火车站，请做好防范准备,高风险地区来沪列车即将到达上海火车站，请做好防范准备高风险地区来沪列车即将到达上海火车站，请做好防范准备高风险地区来沪列车即将到达上海火车站，请做好防范准备高风险地区来沪列车即将到达上海火车站，请做好防范准备"
        },
        {
          id: 2,
          level: 2,
          type: "道路交通",
          time: "今日8:00",
          unit: "市卫健委",
          people: "代用名",
          info: "高风险地区来沪列车即将到达上海火车站，请做好防范准备,高风险地区来沪列车即将到达上海火车站，请做好防范准备,高风险地区来沪列车即将到达上海火车站，请做好防范准备高风险地区来沪列车即将到达上海火车站，请做好防范准备高风险地区来沪列车即将到达上海火车站，请做好防范准备高风险地区来沪列车即将到达上海火车站，请做好防范准备"
        },
        {
          id: 3,
          level: 4,
          type: "路面积水",
          time: "今日8:00",
          unit: "市卫健委",
          people: "代用名",
          info: "高风险地区来沪列车即将到达上海火车站，请做好防范准备,高风险地区来沪列车即将到达上海火车站，请做好防范准备,高风险地区来沪列车即将到达上海火车站，请做好防范准备高风险地区来沪列车即将到达上海火车站，请做好防范准备高风险地区来沪列车即将到达上海火车站，请做好防范准备高风险地区来沪列车即将到达上海火车站，请做好防范准备"
        },
        {
          id: 4,
          level: 3,
          type: "人群聚集",
          time: "今日8:00",
          unit: "市卫健委",
          people: "代用名",
          info: "高风险地区来沪列车即将到达上海火车站，请做好防范准备,高风险地区来沪列车即将到达上海火车站，请做好防范准备,高风险地区来沪列车即将到达上海火车站，请做好防范准备高风险地区来沪列车即将到达上海火车站，请做好防范准备高风险地区来沪列车即将到达上海火车站，请做好防范准备高风险地区来沪列车即将到达上海火车站，请做好防范准备"
        },
        {
          id: 5,
          type: "道路扬尘",
          time: "今日8:00",
          unit: "市卫健委",
          people: "代用名",
          info: "高风险地区来沪列车即将到达上海火车站，请做好防范准备,高风险地区来沪列车即将到达上海火车站，请做好防范准备,高风险地区来沪列车即将到达上海火车站，请做好防范准备高风险地区来沪列车即将到达上海火车站，请做好防范准备高风险地区来沪列车即将到达上海火车站，请做好防范准备高风险地区来沪列车即将到达上海火车站，请做好防范准备"
        },
        {
          id: 6,
          image: "",
          type: "网格派单",
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
    getIcon(item) {
      let icon = "iconfont ";
      switch (item.type) {
        case "疫情防控":
          icon += "icon-yiqingfangkong";
          break;
        case "道路交通":
          icon += "icon-jiaotongyongdu";
          break;
        case "道路扬尘":
          icon += "icon-yangchen1";
          break;
        case "路面积水":
          icon += "icon-daolujishui1";
          break;
        case "人群聚集":
          icon += "icon-renqunjuji";
          break;
        default:
          icon += "icon-richangguanli";
      }
      return icon;
    }
  }
};
</script>
<style lang="scss" scoped>
.container{
  height: 100%;
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
      text-align: center;
      font-size: 50px;
    }
    .title{
      width: 300px;
      .type{
        font-size: 36px;
        font-weight: bold;
      }
      .time{
        font-size: 28px;
        color: $titleLevel2;
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
        color: $titleLevel2;
        font-size: 28px;
        line-height: 1.5;
      }
      .detail{
        padding: 20px 0;
        // color: $titleLevel2;
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
  .color1{
    color: #D0021B;
  }
  .color2{
    color: #F96F4F;
  }
  .color3{
    color: #FCBF51;
  }
  .color4{
    color: #2E9BCF;
  }
}
</style>
