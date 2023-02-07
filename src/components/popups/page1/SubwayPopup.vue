<template>
  <div  class="panel">
    <div class="category">地铁站点</div>
    <div class="basic-info">
      <div class="item">
        <span>站点名称: </span>
        <span>{{ info.data.housingEstate.areaName }}</span>
      </div>
      <div class="item">
        <span>地铁线路: </span>
        <span>{{ info.data.alias_name }}</span>
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
