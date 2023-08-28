<template>
  <div  class="panel">
    <div class="category">部件码信息</div>
    <div class="basic-info">
      <div class="item">
        <span>部件类型: </span>
        <span>{{ info.data.type }}</span>
      </div>
      <div class="item">
        <span>所属区域: </span>
        <span>{{ info.data.area_district && info.data.area_district.areaName }}{{ info.data.town && info.data.town.areaName }}</span>
      </div>
      <div class="item">
        <span>部件位置: </span>
        <span>{{ info.data.address }}</span>
      </div>
      <div class="item">
        <span>部件状态: </span>
        <span>{{ info.data.state === '1' ? '正常' : '异常' }}</span>
      </div>
      <div class="item">
        <span>绑码时间: </span>
        <span>{{ info.data.bindTS | formatTime }}</span>
      </div>
      <div class="item">
        <span>部件编码: </span>
        <span>{{ info.data.code }}</span>
      </div>
    </div>
    <div class="code-wrap">
      <p>部件码</p>
      <div id="qrcode"></div>
      <p>码编号：{{ info.args.qrcode }}</p>
    </div>
  </div>
</template>
<script>
import dayjs from 'dayjs'
export default {
  name: 'unitPopup',
  inject: ['getGlobalConfig'],
  props: {
    info: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  filters: {
    formatTime(value) {
      return dayjs(value * 1000).format('YYYY-MM-DD HH:mm:ss');
    }
  },
  created () {
    console.log(JSON.stringify(this.info))
  },
  mounted() {
    new window.QRCode(document.getElementById('qrcode'), {
      text: `https://jacode.iotsh.com.cn:18081/ja/code/index.html?code=${this.info.args.qrcode}`,
      width: 400,
      height: 400,
      correctLevel: 0
    })
  }
}
</script>
<style lang="scss" scoped>
.panel{
  width: 6.4rem;
  height: 12rem;
  padding: 0.4rem 0.2rem;
  font-size: 0.32rem;
  color:rgba(146, 185, 247, 1);
  .item{
    padding: 0.2rem 0;
    & > span:last-child {
      color: #FFFFFF;
    }
  }
  .category{
    width: 100%;
    font-size: 0.44rem;
    margin-bottom: 0.2rem;
    font-family:MicrosoftYaHei;
    color:rgba(146,185,247,1);
  }
  .code-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 0.15rem;
    background-image: linear-gradient(266deg, #07397A 2%, #0a2876f2 72%);
    & > p {
      font-size: 0.36rem;
      color: #FFFFFF;
      line-height: 1rem;
    }
    img {
      width: 100%;
    }
  }
}
</style>
