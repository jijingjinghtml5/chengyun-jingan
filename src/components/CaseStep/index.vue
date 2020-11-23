<template>
  <div class="case-step__wrap">
    <ul class="case-step">
      <template v-for="(step, i) in filterSteps">
        <li v-if="i !== 0" class="case-step__arrow" :key="step.key + '-arrow'">
          <img src="./images/arrow.png" />
        </li>
        <li class="case-step__item" :key="step.key">
          <div class="step-icon">
            <div class="step-icon__wrap" :style="{ backgroundColor: colors[i] || step.color }">
              <i class="iconfont" :class="step.icon"></i>
            </div>
          </div>
          <p class="step-name">{{ displayName[i] || step.name }}</p>
          <p class="step-value">
            <number-animation :val="dataset[step.key] | initVal"></number-animation>
          </p>
        </li>
      </template>
    </ul>
  </div>
</template>
<script>
import { CaseSteps } from "../../mapping";
import NumberAnimation from "../NumberAnimation/index2.0.vue";
export default {
  name: "CaseStep",
  data () {
    return {
      stepsObj: Object.freeze({
        发现: { icon: "icon-faxian", key: "发现", color: "#00D2D7" },
        立案: { icon: "icon-lian", key: "立案", color: "#00B0FF" },
        派遣: { icon: "icon-paiqian", key: "派遣", color: "#448AFF" },
        处置: { icon: "icon-chuzhi", key: "处置", color: "#FFBC31" },
        核查: { icon: "icon-hecha", key: "核查", color: "#FF9100" },
        结案: { icon: "icon-jiean", key: "结案", color: "#00BFA5" }
      })
    };
  },
  components: {
    NumberAnimation
  },
  props: {
    colors: {
      type: Array,
      default: () => {
        return [];
      }
    },
    displayName: {
      type: Array,
      default: () => {
        return [];
      }
    },
    dataset: {
      type: Object,
      default: () => {
        return {};
      }
    },
    excludes: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    steps () {
      return CaseSteps.map(stepName => {
        return {
          name: stepName,
          ...(this.stepsObj[stepName] || {})
        };
      });
    },
    filterSteps () {
      return this.steps.filter(step => this.excludes.indexOf(step.key) === -1);
    }
  }
};
</script>
<style lang="scss" scoped>
.case-step__wrap {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
}
.case-step {
  display: flex;
  justify-content: space-between;
  text-align: center;
}
.case-step__arrow {
  margin-top: 0.51rem;
  img {
    display: flex;
    width: 0.44rem;
  }
}
.step-icon {
  width: 1.16rem;
  height: 1.16rem;
  border: 0.04rem solid rgba(#ffffff, 0.2);
  padding: 0.06rem;
  line-height: 0.96rem;
  border-radius: 50%;
  font-size: 0.48rem;
  margin: 0 auto 0.2rem;
}
.step-icon__wrap {
  height: 100%;
  border-radius: 50%;
}
.step-name {
  font-size: 0.36rem;
  color: #fff;
}
.step-value {
  font-size: 0.44rem;
  font-weight: 500;
}
</style>
