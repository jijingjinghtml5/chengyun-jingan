<template>
  <wrap-title txt="张贴统计" :level="2" icon="icon-biaoti" class="dashboard">
    <div class="list">
      <div class="item">
        <div class="title">区级码</div>
        <div class="desc">
          <span>部件（个）</span><span class="num">{{ unitNum }}</span>
        </div>
        <div class="desc">
          <span>点位（个）</span><span class="num">{{ pointNum }}</span>
        </div>
      </div>
      <div class="item">
        <div class="title">街镇码</div>
        <div class="desc">
          <span>彭浦新村码（个）</span><span class="num">{{ ppNum }}</span>
        </div>
        <div class="desc">
          <span>曹家渡码（个）</span><span class="num">{{ cjdNum }}</span>
        </div>
      </div>
    </div>
  </wrap-title>
</template>
<script>
import WrapTitle from '@/components/MTitle/WrapTitle'
import { getCodeNum, getStreetCodeNum } from './api'
export default {
  name: 'NumStatics',
  components: {
    WrapTitle,
  },
  props: {},
  watch: {},
  data () {
    return {
      unitNum: '-',
      pointNum: '-',
      ppNum: '-',
      cjdNum: '-'
    }
  },
  methods: {},
  mounted () {
    getCodeNum().then((res) => {
      res.map((item) => {
        if (item.unit_type == 1) {
          this.unitNum = item.count
        }
        if (item.unit_type == 2) {
          this.pointNum = item.count
        }
      })
    })
    getStreetCodeNum().then((res) => {
      res.map((item) => {
        if (item.street == '曹家渡街道') {
          this.ppNum = item.count
        }
        if (item.street == '彭浦新村街道') {
          this.cjdNum = item.count
        }
      })
    })
  }
}
</script>
<style lang="scss" scoped>
.list {
  display: flex;
  justify-content: space-between;
  margin-top: 0.6rem;
  .item {
    flex: 1;
    margin: 0 5px;
    .title {
      font-weight: 500;
      font-size: 0.28rem;
      color: #ffffff;
      height: 0.56rem;
      border-bottom: 1px solid #d1c9c4;
      margin-bottom: 0.28rem;
    }
    .desc {
      height: 0.56rem;
      line-height: 0.56rem;
      .num {
        font-weight: 500;
        font-size: 0.4rem;
        color: #4fcfd5;
        text-align: right;
        float: right;
      }
    }
  }
}
</style>
