<template>
  <div class="MapTitleContainer">
    <div class="tilte">上海市静安区城市运行管理平台</div>
    <div></div>
  </div>
</template>
<script>

export default {
  name: "MapTitle",
  data() {
    return {

    }
  },
  computed: {
  },
  methods: {

  }
}
</script>
<style lang="scss" scoped>
.MapTitleContainer {
  position: absolute;
  background-image:url(./img/MapBG.png);
  background-size: contain;
  // background-repeat:no-repeat;
  width: 100%;
  height:  3rem;
}
.tilte {
  position: relative;
  width: 100%;
  height:  1.5rem;
  line-height: 1.5rem;
  text-align: center;
  font-size: 0.96rem;
  color: #ffffff;
  font-weight: bold;

}
</style>