<template>
  <div class="panel">
    <div class="category">火情案件</div>
    <div class="basic-info">
      <div class="item">
        <span>案发地址: </span>
        <span>{{ detail.afdz }}</span>
      </div>
      <div class="item">
        <span>案件等级: </span>
        <span>{{ detail.ajdj }}</span>
      </div>
      <div class="item">
        <span>案件类型: </span>
        <span>{{ detail.ajlx }}</span>
      </div>
      <div class="item">
        <span>案件状态: </span>
        <span>{{ detail.ajzt }}</span>
      </div>
      <div class="item">
        <span>案件状态变更记录: </span>
        <template v-if="detail.ajztList && detail.ajztList.length">
          <div v-for="(item, index) in detail.ajztList" :key="index" style="margin-top: 10px">
            <div>
              <span>状态：</span>
              <span style="color: #FFFFFF;">{{ item.name }}</span>
            </div>
            <div style="margin-top: 10px">
              <span>时间：</span>
              <span style="color: #FFFFFF;">{{ item.value }}</span>
            </div>
          </div>
        </template>
      </div>
      <div class="item">
        <span>补充信息: </span>
        <span>{{ detail.bcxx }}</span>
      </div>
      <div class="item">
        <span>报警人联系电话: </span>
        <span>{{ formatPhone(detail.bjrlxdh) }}</span>
      </div>
      <div class="item">
        <span>报警人姓名: </span>
        <span>{{ formatName(detail.bjrxm) }}</span>
      </div>
      <div class="item">
        <span>处置对象: </span>
        <span>{{ detail.czdx }}</span>
      </div>
      <div class="item">
        <span>处置状态: </span>
        <span>{{ detail.czzt }}</span>
      </div>
      <div class="item">
        <span>持续时间: </span>
        <template v-if="detail.durationInfo">
          <span style="color: #FFFFFF;">{{ detail.durationInfo.day }}天</span>
          <span style="color: #FFFFFF;">{{ detail.durationInfo.hour }}时</span>
          <span style="color: #FFFFFF;">{{ detail.durationInfo.minute }}分</span>
          <span style="color: #FFFFFF;">{{ detail.durationInfo.second }}秒</span>
        </template>
      </div>
      <div class="item">
        <span>立案时间: </span>
        <span>{{ detail.lasj }}</span>
      </div>
      <div class="item">
        <span>区县: </span>
        <span>{{ detail.qx }}</span>
      </div>
      <div class="item">
        <span>通知返队时间: </span>
        <span>{{ detail.tzfdsj }}</span>
      </div>
      <div class="item">
        <span>现场指挥人员 - 值班: </span>
        <template v-if="detail.zbzsList && detail.zbzsList.length">
          <div v-for="(item, index) in detail.zbzsList" :key="index" style="margin-top: 10px" class="zhihuren-info">
            <div>
              <span>人员姓名：</span>
              <span style="color: #FFFFFF;">{{ formatName(item.personName) }}</span>
            </div>
            <div>
              <span>支队简称：</span>
              <span style="color: #FFFFFF;">{{ item.detachmentShortName }}</span>
            </div>
            <div>
              <span>岗位名称：</span>
              <span style="color: #FFFFFF;">{{ item.positionName }}</span>
            </div>
            <div>
              <span>职位名称：</span>
              <span style="color: #FFFFFF;">{{ item.postName }}</span>
            </div>
            <div>
              <span>人员联系电话：</span>
              <span style="color: #FFFFFF;">{{ formatPhone(item.tel) }}</span>
            </div>
            <div>
              <span>值班日期：</span>
              <span style="color: #FFFFFF;">{{ item.zbrq }}</span>
            </div>
            <div style="height: 3px;width: 100%;background: #FFFFFF;"></div>
          </div>
        </template>
      </div>
      <div class="item">
        <span>主管中队: </span>
        <span>{{ detail.zgZhongDui }}</span>
      </div>
      <div class="item">
        <span>主管支队: </span>
        <span>{{ detail.zgzd }}</span>
      </div>
    </div>
  </div>
</template>
<script>
import request from '@/http/request'
export default {
  name: 'huoqingCaseDetailPopup',
  inject: ['getGlobalConfig'],
  props: {
    info: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      detail: null
    }
  },
  watch: {
    info: {
      handler(nv) {
        this.getData();
      },
      deep: true,
      immediate: true,
    }
  },
  methods: {
    getData() {
      request({
        url: 'http://10.210.232.237/internal-api/gateway/jazd-event/police-detail-info',
        params: {
          id: this.info.id
        }
      }).then(res => {
        this.detail = res || {}
      })
    },
    formatName(name) {
      let sName = '-'
      if (name) {
        sName = name.substring(0, 1) + '*' + name.substring(2)
      }
      return sName
    },
    formatPhone(phone) {
      let sphone = '-'
      if (phone) {
        sphone = phone.substring(0, 4) + '****' + phone.substring(8)
      }
      return sphone
    }
  }
}
</script>
<style lang="scss" scoped>
.panel {
  width: 6.4rem;
  height: 14rem;
  padding: 0.4rem;

  font-size: 16*2px;
  color: rgba(146, 185, 247, 1);

  span {
    line-height: 40px;
  }

  .zhihuren-info {
    div {
      margin-top: 10px;
    }
  }

  .item {
    padding: 10px 0;

    &>span:last-child {
      color: #FFFFFF;
    }
  }

  .split-line {
    width: 100%;
    height: 2px;
    border-bottom: 2px solid rgba(78, 120, 164, 1);
    margin: 20px 0;
  }

  .category {
    width: 100%;
    font-size: 22*2px;
    font-family: MicrosoftYaHei;
    color: rgba(146, 185, 247, 1);
  }

  .name {
    font-size: 26*2px;
    font-family: MicrosoftYaHei;
    color: #ffffff;
    padding: 20px 0;
  }
}
</style>