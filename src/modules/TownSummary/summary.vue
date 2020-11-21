<template>
  <auto-scroll-wrap
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
          <div class="cell title">
            <p class="level1 text-ellipsis">{{ item.town }}</p>
            <p class="level2 text-ellipsis">综合考评:{{ item.score }}</p>
          </div>
          <div class="cell detail">
            <div class="item">
              <p class="level2 text-ellipsis">公共安全</p>
              <p class="level0 text-ellipsis" style="color:#2E9BCF;">{{ item.security | thousandCentimeter }}</p>
            </div>
            <div class="split"></div>
            <div class="item">
              <p class="level2 text-ellipsis">公共管理</p>
              <p class="level0 text-ellipsis" style="color:#F23470;">{{ item.manage | thousandCentimeter }}</p>
            </div>
            <div class="split"></div>
            <div class="item">
              <p class="level2 text-ellipsis">公共服务</p>
              <p class="level0 text-ellipsis" style="color:#1ABC9C;">{{ item.service | thousandCentimeter }}</p>
            </div>
          </div>
          <div class="cell opt">
            <span class="iconfont icon-video_on"></span>
            <span class="iconfont icon-fasong"></span>
          </div>
        </div>
      </RecycleScroller>
  </auto-scroll-wrap>
</template>
<script>
import AutoScrollWrap from "@/components/AutoScrollWrap";
import { RecycleScroller } from "vue-virtual-scroller";
import "vue-virtual-scroller/dist/vue-virtual-scroller.css";

export default {
  name: "TownSummary",
  inject: ["createFnForCalcRealPx"],
  components: { AutoScrollWrap, RecycleScroller },
  data() {
    return {
      activeIndex: -1,
      total: 1000,
      dataset: [
        {
          id: 1,
          town: "南京西路街道",
          score: "100",
          security: 0,
          manage: 1200,
          service: 6
        },
        {
          id: 2,
          town: "静安寺街道",
          score: "100",
          security: 0,
          manage: 1200,
          service: 6
        },
        {
          id: 3,
          town: "共和新路街道",
          score: "100",
          security: 0,
          manage: 1200,
          service: 6
        },
        {
          id: 4,
          town: "大宁路街道",
          score: "100",
          security: 0,
          manage: 1200,
          service: 6
        },
        {
          id: 5,
          town: "曹家渡街道",
          score: "100",
          security: 0,
          manage: 1200,
          service: 6
        },
        {
          id: 6,
          town: "天目西路街道",
          score: "100",
          security: 0,
          manage: 1200,
          service: 6
        },
        {
          id: 7,
          town: "宝山路街道",
          score: "100",
          security: 0,
          manage: 1200,
          service: 6
        },
        {
          id: 8,
          town: "江宁路街道",
          score: "100",
          security: 0,
          manage: 1200,
          service: 6
        },
        {
          id: 9,
          town: "北站街道",
          score: "100",
          security: 0,
          manage: 1200,
          service: 6
        }, {
          id: 10,
          town: "临汾路街道",
          score: "100",
          security: 0,
          manage: 1200,
          service: 6
        }, {
          id: 11,
          town: "石门二路街道",
          score: "100",
          security: 0,
          manage: 1200,
          service: 6
        }, {
          id: 12,
          town: "芷江西路街道",
          score: "100",
          security: 0,
          manage: 1200,
          service: 6
        }, {
          id: 13,
          town: "彭浦镇街道",
          score: "100",
          security: 0,
          manage: 1200,
          service: 6
        }, {
          id: 14,
          town: "彭浦新村街道",
          score: "100",
          security: 0,
          manage: 1200,
          service: 6
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
    .title{
      width: 300px;
    }
    .detail{
      flex: 1;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .item{
        padding: 0 20px;
      }
      .split{
        width: 2px;
        border-left:2px dashed #4E78A4;
        height: 80px;
      }
    }
    .opt{
      width: 180px;
      color: #679DF4;
      font-size: 50px;
      text-align: center;
      span{
        margin-right: 20px;
      }
    }
    .level0{
      font-size: 44px;
      font-weight: bold;
    }
    .level1{
      font-size: 36px;
      font-weight: bold;
      color: #ffffff;
    }
    .level2{
      font-size: 28px;
      color: #92B9F7;
    }
  }

</style>
