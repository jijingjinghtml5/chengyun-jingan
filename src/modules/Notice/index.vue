<template>
  <div class="container">
    <span class="iconfont icon-shijianbobao"></span>
    <span style="margin-left:10px;">事件播报：</span>
    <span class="content">{{txt}}</span>
  </div>
</template>
<script>
export default {
  name: "Notice",
  data() {
    return {
      txt: ""
    };
  }
};
</script>
<style lang="scss" scoped>
.container{
  font-size: 52px;
  color: $titleLevel2;
  padding: 20px;
  line-height: 80px;
  height: 140px;
  border-bottom: 0.02rem solid #0F2E60;
  .iconfont{
    color: #0071FF;
    .supportWebkitTextFillColor &{
      background-image: linear-gradient(180deg, #4FCFD5 0%, #0071FF 100%);
      // background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }
  // background: linear-gradient(180deg, #5458A9 0%, #154FA3 100%);
  // border: 2px solid #0F2E60;

  .content{
    margin-left: 40px;
    margin-right: 30px;
  }
}
</style>>
