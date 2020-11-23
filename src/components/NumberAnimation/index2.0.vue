<template>
  <component :is="tag">
    <vue-count-to v-if="canAnimation" ref="count" :startVal="startVal" :endVal="val" :duration="duration" v-bind="$attrs" v-on="$listeners"></vue-count-to>
    <template v-else>{{ val }}</template>
  </component>
</template>
<script>
// 进入显示区域自动动画 + 定时动画 + 统计动画
import VueCountTo from "vue-count-to";

export default {
  name: "NumberAnimation",
  components: {
    VueCountTo
  },
  inheritAttrs: false,
  props: {
    val: {
      type: [Number, String],
      default: () => {
        return "-";
      }
    },
    duration: {
      type: Number,
      default: 2000
    },
    tag: {
      type: String,
      default: "span"
    }
  },
  data () {
    return {
      startVal: 0
    };
  },
  computed: {
    canAnimation () {
      return !isNaN(+this.val);
    }
  },
  watch: {
    val: {
      handler (nv, ov) {
        this.startVal = isNaN(+ov) ? 0 : ov;
      }
    }
  }
};
</script>
