<template>
  <div class="panel">
    <div class="title">风险预警</div>
    <div class="type">
      <span :class="icon"></span> <span class="txt">{{info.type}}</span>
    </div>
    <div class="detail">
      <p class="item">
        <span class="label">发布时间:</span>
        <span class="value">{{info.time}}</span>
      </p>
      <p class="item">
        <span class="label">发布单位:</span>
        <span class="value">{{info.unit}}</span>
      </p>
      <p class="item">
        <span class="label">对口人员:</span>
        <span class="value">{{info.people}}</span>
      </p>
      <p class="item">
        <span class="label">预警描述:</span>
        <span class="value">{{info.info}}</span>
      </p>
    </div>
  </div>
</template>
<script>
export default {
  name: "RiskAlertPopup",
  props: {
    info: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  mounted() {
    console.log(this.info);
  },
  computed: {
    icon() {
      let icon = "iconfont ";
      switch (this.info.type) {
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
      return icon + " color" + (this.info.level || 4);
    }
  }
};
</script>
<style lang="scss" scoped>
.panel{
  width: 6.4rem;
  height: 15.5rem;
  padding: 0.4rem;

  .title{
    color: #ffffff;
    font-size: 16*2px;
    border-bottom: 2px solid rgba(78,120,164,1);
    padding: 10px 0;
    margin-bottom: 20px;
  }
  .type{
    font-size: 52px;
    margin-bottom: 20px;
    .txt{
      margin-left: 20px;
      font-weight: bold;
      color: #fff;
    }
  }
  .detail{
    .item{
      font-size: 32px;
      line-height: 48px;
      color: #fff;
      .label{
        color: #92B9F7;
        margin-right: 10px;
      }
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
