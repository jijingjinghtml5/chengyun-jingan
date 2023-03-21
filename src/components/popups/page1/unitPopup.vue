<template>
  <div  class="panel">
    <div class="category">部件详情</div>
    <div class="basic-info">
      <div class="item">
        <span>部件类型: </span>
        <span>{{ info.data.type }}</span>
      </div>
      <div class="item">
        <span>所属街道: </span>
        <span>{{ info.data.town.areaName }}</span>
      </div>
      <div class="item">
        <span>所属小区: </span>
        <span>{{ info.data.housingEstate.areaName }}</span>
      </div>
      <div class="item">
        <span>所属部门: </span>
        <span>{{ info.data.department }}</span>
      </div>
    </div>
  </div>
</template>
<script>

export default {
  name: 'shopPopup',
  inject: ['getGlobalConfig'],
  props: {
    info: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  created () {
    console.log(this.info)
  }
}
</script>
<style lang="scss" scoped>
.panel{
  width: 6.4rem;
  height: 10rem;
  padding: 0.4rem;

  font-size: 16*2px;
  color:rgba(146, 185, 247, 1);
  .item{
    padding: 10px 0;
    & > span:last-child {
      color: #FFFFFF;
    }
  }
  .split-line{
    width: 100%;
    height: 2px;
    border-bottom: 2px solid rgba(78,120,164,1);
    margin: 20px 0;
  }
  .category{
    width: 100%;
    font-size:22*2px;
    font-family:MicrosoftYaHei;
    color:rgba(146,185,247,1);
  }
  .name{
    font-size: 26*2px;
    font-family:MicrosoftYaHei;
    color: #ffffff;
    padding: 20px 0;
  }
}
</style>
