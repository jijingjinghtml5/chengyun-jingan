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
        v-slot="{ item }">
        <div class="li-item" >
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
            <span class="iconfont icon-shipinlianxian"></span>
            <span class="iconfont icon-tiaozhuandaojiezhen" @click="gotoTown(item)"></span>
          </div>
        </div>
      </RecycleScroller>
      <m-dialog :dialogVisible.sync="dialogVisible" :extraCss="dialogCSS">
        <iframe-container :iframeSrc="iframeSrc"></iframe-container>
      </m-dialog>
  </auto-scroll-wrap>
</template>
<script>
import AutoScrollWrap from "@/components/AutoScrollWrap";
import { RecycleScroller } from "vue-virtual-scroller";
import "vue-virtual-scroller/dist/vue-virtual-scroller.css";
import MDialog from "@/components/MDialog";
import IframeContainer from "@/components/IframeContainer";

export default {
  name: "TownSummary",
  inject: ["createFnForCalcRealPx", "getGlobalConfig"],
  components: { AutoScrollWrap, RecycleScroller, MDialog, IframeContainer },
  data() {
    const townList = (this.getGlobalConfig()["streets"] || []).map(item => {
      return {
          id: item.code,
          town: item.name,
          url: item.url,
          score: "-",
          security: "-",
          manage: "-",
          service: "-"
        };
    });
    return {
      activeIndex: -1,
      total: 1000,
      dataset: townList,
      rowHeight: 130,
      dialogCSS: {
        width: "7680px",
        height: "2160px"
      },
      iframeSrc: "",
      dialogVisible: false
    };
  },
  methods: {
    gotoTown(item) {
      console.log("item", item);
      this.dialogVisible = true;
      this.iframeSrc = item.url;
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
      .iconfont{
        cursor: pointer;
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
