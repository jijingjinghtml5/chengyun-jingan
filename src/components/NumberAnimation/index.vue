<template>
  <component :is="tag" v-observe-visibility="{callback: visibilityChanged, throttle: 300}">
    <vue-count-to v-if="canAnimation" ref="count" :decimals="decimals" :startVal="parseFloat(startVal)" :endVal="parseFloat(val)" :duration="duration" v-bind="$attrs" v-on="$listeners"></vue-count-to>
    <template v-else>{{ val }}</template>
  </component>
</template>
<script>
// 进入显示区域自动动画 + 定时动画 + 统计动画
import VueCountTo from 'vue-count-to'
import { ObserveVisibility } from 'vue-observe-visibility'

export default {
  name: 'NumberAnimation',
  components: {
    VueCountTo
  },
  directives: {
    'observe-visibility': ObserveVisibility
  },
  props: {
    val: {
      type: [Number, String],
      default: () => {
        return '-'
      }
    },
    decimals: {
      type: Number,
      default: 0
    },
    againInterval: {
      type: Number,
      default: 30000
    },
    duration: {
      type: Number,
      default: 2000
    },
    tag: {
      type: String,
      default: 'span'
    }
  },
  data () {
    return {
      isVisible: true,
      startVal: 0,
      resetTimer: null
    }
  },
  watch: {
    isVisible: {
      handler (nv) {
        if (nv) {
          this.aniamtion()
        }
      }
    }
  },
  computed: {
    canAnimation () {
      return !isNaN(+this.val)
    }
  },
  methods: {
    init () {
      // timer.register(this.aniamtion, this, false);
      this.startTimer()
      this.$once('hook:beforeDestroy', () => {
        this.stopTimer()
      })
    },
    startTimer () {
      this.resetTimer = setInterval(() => {
        console.log('>>>>timer')
        this.aniamtion()
      }, this.againInterval)
    },
    stopTimer () {
      if (this.resetTimer) {
        clearInterval(this.resetTimer)
        this.resetTimer = null
      }
    },
    aniamtion () {
      if (this.canAnimation) {
        const countDom = this.$refs.count
        countDom && countDom.start()
      }
    },
    visibilityChanged (isVisible) {
      this.isVisible = isVisible
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.init()
    })
  }
}
</script>
