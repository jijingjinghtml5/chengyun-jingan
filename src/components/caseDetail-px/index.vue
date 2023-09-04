<template>
  <div class="case-detail">
      <component v-if="caseId" :is="channelComponent" :res="detail" :defaultInfo="info" @open="open"></component>
  </div>
</template>
<script>
import Sangao from './sangao'
import { getCaseDetail194, getHotLineCaseDetail } from './api'
export default {
  name: 'CaseDetail',
  data () {
    return {
      loading: true,
      detail: null,
      channel: ''
    }
  },
  props: {
    caseId: {
      type: [String, Number],
      default: '',
      required: true
    },
    channelParams: {
      type: String,
      default: ''
    },
    info: {
      type: Object,
      default: null
    }
  },
  components: {
    Sangao
  },
  computed: {
    channelComponent () {
      let res = 'Sangao'
      switch (this.channel) {
        case 'sangao': res = 'Sangao'; break
        case 'paidan': res = 'Sangao'; break
      }
      return res
    }
  },
  watch: {
    caseId: {
      handler () {
        this.getData()
      }
    }
  },
  methods: {
    async getData () {
      if (!this.caseId) return false
      this.loading = true
      let apiRes
      // if (this.channelParams === '12345热线') {
      //   apiRes = await getHotLineCaseDetail(this.caseId)
      // } else {

      // }
      apiRes = await getCaseDetail194(this.info.uuid || this.caseId, this.channelParams)
      console.log('案件详情', apiRes)
      this.loading = false
      if (apiRes.data) {
        this.channel = apiRes.data.channel || ''
        this.detail = apiRes.data.data || null
      }
    },
    open (type, url) {
      this.$emit('open', type, url)
    },
    handleClose () {
      this.$emit('close')
    }
  },
  created () {
    this.getData()
  }
}
</script>
<style lang="scss" scoped>
.text-hidden {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.close {
  position: absolute;
  z-index: 10;
  top: 0.2*100px;
  right: 0.2*100px;
  font-size: 0.201*100px;
  color: #fff;
  cursor: pointer;

  .icon-arrow_right {
    // position: absolute;
    margin-right: -0.13*100px;
  }
}

.case-detail {
  // position: absolute;
  // left: 0.1*100px;
  // top: 1.8*100px;
  width: 6.4*100px;
  height: 15.5*100px;
  background-color: rgba(#0F2E60, 0.6);
  border: 1px solid #4E78A4;
  box-sizing: border-box;
}
.loadingText {
  font-size: 28px;
  line-height: 40px;
}

</style>
