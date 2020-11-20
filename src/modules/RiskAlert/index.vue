<template>
<div class="container">
    <wrap-title txt="风险预警" :level="1" icon="icon-ditanshijiancha">

    </wrap-title>
</div>
</template>

<script>
import WrapTitle from "@/components/MTitle/WrapTitle";
import MTitle from "@/components/MTitle/LevelTitle";
export default {
  name: "RiskAlert",
  components: { WrapTitle, MTitle }
};
</script>
<style lang="scss" scoped>
.container{
  padding: 0.2rem;
  height: 100%;
  background: linear-gradient(180deg, rgba(84, 88, 169, 0) 0%, rgba(21, 79, 163, 0.4) 100%);
}
</style>
