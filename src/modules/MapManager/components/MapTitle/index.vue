<template>
  <div class="MapTitleContainer">
    <div class="tilte">上海市静安区城市运行管理平台</div>
    <div class="map-tab">
      <header-menu
        :mapControlItem="mapControlItem"
        :checkItems="checkItems"
        :mapControlItemData="mapControlItemData"
        :formatMethod="formatMethods"
      ></header-menu>
    </div>
  </div>
</template>
<script>
import HeaderMenu from "@/lib/MapHeader/HeaderMenu";

export default {
  name: "MapTitle",
  components: {
    HeaderMenu

  },
  data() {
    return {
      formatMethods:{

      },
     mapControlItem: [
        { name: "居委会(个)", iconClass: "icon-diliku", attr: "juwei", isExpand: true, columns:2},
        { name: "办公楼宇/园区(个)", iconClass: "icon-bangonglouyu", attr: "yuanqu", isExpand: true, columns:2 },
        { name: "沿街商铺(间)", iconClass: "icon-yanjieshangpu", attr: "shangpu", isExpand: true, columns:2},
        { name: "建设工地(个)", iconClass: "icon-zaijiangongdi", attr: "gongdi", isExpand: true ,radio:true, columns:2}
      ],
      mapControlItemData: {
        juwei: "12",
        yuanqu:"171",
        shangpu:"3433",
        gongdi:"89"
      },
      checkItems: {
        juwei: []
      },

    }
  },
  computed: {

  },
  methods: {

  },
  mounted() {
      this.$bus.$on("map-header-menu-choose", res => {
        const { status, item } = res;

        console.log(res,"res-----------")

      });


      this.$bus.$on("map-header-item-choose", res => {

      })

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
.map-tab{
  position: relative;

  margin: 0.23rem auto 0 auto;
  width: 85%;

}
</style>