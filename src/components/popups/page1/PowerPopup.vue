<template>
  <div  class="panel">
    <div class="category">工作力量</div>
    <DisposalPower></DisposalPower>
  </div>
</template>
<script>
import DisposalPower from './DisposalPower/index.vue'
export default {
  name: 'PowerPopup',
  components: {
    DisposalPower
  },
  props: {
    info: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  beforeDestroy () {
    this.$_mapProxy.clearPosition()
    this.$_mapProxy.fullExtent()
  }
}
</script>
<style lang="scss" scoped>
.panel{
  width: 10rem;
  height: 15.6rem;
  padding: 0.4rem;
  border: 1px solid #4E78A4;

  font-size: 16*2px;
  color:rgba(146, 185, 247, 1);
  .category{
    width: 100%;
    font-size:22*2px;
    font-family:MicrosoftYaHei;
    color:rgba(146,185,247,1);
  }
}
</style>
