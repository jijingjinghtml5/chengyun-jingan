<template>
  <div class="MapContainer" id="MapContainer" @click.stop @mousedown.stop>
    <citymap ref='Map'></citymap>

  </div>
</template>
<script>
import citymap from "@/components/citymap"
export default {
  name: "MapManager",
  data() {
    return {

    }
  },
  components: {
    citymap
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
  border: 0.02rem solid #4e78a4;
  width: 100%;
  height: 100%;
}
</style>