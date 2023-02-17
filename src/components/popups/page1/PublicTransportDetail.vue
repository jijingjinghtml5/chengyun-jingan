<template>
  <div  class="panel">
    <div class="category">线路详情</div>
    <div class="basic-info">
      <div class="item">
        <span>线路名称: </span>
        <span>{{ detail.busNo }}</span>
      </div>
      <div class="item">
        <span>首末班车: </span>
        <span>{{ detail.startTime }}</span>
      </div>
    </div>
  </div>
</template>
<script>
import { getBusDetail } from '../api.js'
export default {
  name: 'PubliceTransportDetail',
  props: {
    info: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      detail: {}
    }
  },
  watch: {
    info: {
      handler (nv) {
        this.getData()
      },
      deep: true
    }
  },
  methods: {
    getData () {
      getBusDetail(this.info.args.attributes.BUSNAME).then(res => {
        console.log(res, 'getBusDetail')
        this.detail = res[0] || {}
      })
    }
  },
  mounted () {
    this.getData()
  }
}
</script>
<style lang="scss" scoped>
.panel{
  width: 6.4rem;
  height: 15.6rem;
  padding: 0.4rem;

  font-size: 16*2px;
  color:rgba(146, 185, 247, 1);
  .item{
    padding: 20px 0;
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
