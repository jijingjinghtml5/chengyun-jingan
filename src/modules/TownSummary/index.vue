<template>
<div class="container gradient-bg">
    <wrap-title txt="风险预警" :level="1" icon="icon-qujiducha">
      <m-tabs slot="level-title" v-model="tab" :tabs="tabs" ref="mainTab" :autoChange="false"></m-tabs>
      <component :is="tab" style="margin-top:20px;" @mouseenter.native="handleMouse('mainTab', 'enter')" @mouseleave.native="handleMouse('mainTab', 'leave')"></component>
    </wrap-title>
</div>
</template>

<script>
import WrapTitle from "@/components/MTitle/WrapTitle";
import MTitle from "@/components/MTitle/LevelTitle";
import MTabs from "@/components/MTabs";
import Summary from "./summary";
import Appraise from "./appraise";
import OperationStatus from "./operationStatus";

export default {
  name: "TownSummary",
  inject: ["createFnForCalcRealPx"],
  components: { WrapTitle, MTabs, MTitle, Summary, Appraise, OperationStatus },
  data() {
    return {
      tabs: Object.freeze([
        { label: "街镇概况", value: "Summary" },
        { label: "运行动态", value: "OperationStatus" }
      ]),
      tab: "Summary"
    };
  },
  methods: {
    handleMouse(ref, mouse) {
      if (mouse === "enter") {
        this.$refs[ref].stopTimer();
      } else {
        this.$refs[ref].startTimer();
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.container{
  height: 100%;
}
</style>
