<template>
    <wrap-title txt="今日关注" :level="2">

    </wrap-title>
</template>

<script>
import WrapTitle from "@/components/MTitle/WrapTitle";
import MTitle from "@/components/MTitle/LevelTitle";
export default {
  name: "TodayFocus",
  components: { WrapTitle, MTitle }
};
</script>
<style lang="scss" scoped>

</style>
