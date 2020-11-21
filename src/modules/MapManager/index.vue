<template>
  <div class="MapContainer" id="MapContainer" @click.stop @mousedown.stop>
    <maptitle></maptitle>
    <citymap ref='Map'></citymap>
    <maptool></maptool>


  </div>
</template>
<script>
import citymap from "@/components/citymap"
import maptitle from "./components/MapTitle"
import maptool from "./components/MapTool"
export default {
  name: "MapManager",
  data() {
    return {

    }
  },
  components: {
    maptitle,
    citymap,
    maptool
    
  },
  computed: {
  },
  methods: {

  }
}
</script>
<style lang="scss" scoped>
.MapContainer {
  position: relative;
  // border: 0.02rem solid #4e78a4;
  width: 100%;
  height: 100%;
}
</style>