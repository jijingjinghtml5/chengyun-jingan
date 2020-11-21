<template>
<div class="container">
    <wrap-title txt="风险预警" :level="1" icon="icon-qujiducha">
      <m-tabs slot="level-title" v-model="tab" :tabs="tabs"></m-tabs>
      <component :is="current" style="margin-top:20px;"></component>
    </wrap-title>
</div>
</template>

<script>
import WrapTitle from "@/components/MTitle/WrapTitle";
import MTitle from "@/components/MTitle/LevelTitle";
import MTabs from "@/components/MTabs";
import Summary from "./summary";
import Appraise from "./appraise";

export default {
  name: "TownSummary",
  inject: ["createFnForCalcRealPx"],
  components: { WrapTitle, MTabs, MTitle, Summary, Appraise },
  data() {
    return {
      tabs: Object.freeze([
        { label: "街镇概况", value: "summary" },
        { label: "绩效考核", value: "appraise" }
      ]),
      tab: "summary"
    };
  },
  computed: {
    current() {
      switch (this.tab) {
        case "appraise":
          return Appraise;
        default:
         return Summary;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.container{
  height: 100%;
  background: linear-gradient(180deg, rgba(84, 88, 169, 0) 0%, rgba(21, 79, 163, 0.4) 100%);
}
</style>
