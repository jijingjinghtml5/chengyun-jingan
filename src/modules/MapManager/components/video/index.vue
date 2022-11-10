<template>
  <div class="videoContainer" :class="{collapsed: isCollapsed}">
      <div class="collapse" @click="collapsedChange">
        <div :class="`iconfont ${collapsedIcon}`" ></div>
      </div>
      <video-manager v-show="!isCollapsed"></video-manager>
  </div>
</template>
<script>
import qvPlayer from "@/components/Video/qvPlayer";
import VideoManager from "@/modules/VideoManager";
export default {
  components: { qvPlayer, VideoManager },
  name: "videomap",
  data() {
    return {
      isCollapsed: this.collapsed,
      videoNumber: "（1/147）",
      videoData: [
        { src: null },
        { src: null },
        { src: null },
        { src: null },
        { src: null }
      ]

    };
  },
  computed: {
    collapsedIcon () {
      return this.isCollapsed ? "icon-zhedie6" : "icon-zhedie5";
    }
  },
  watch: {
     btnActives: {
       handler(val) {
          // console.log(val, "cL");
       },
       deep: true

     }
  },
  methods: {
    collapsedChange() {
      this.isCollapsed = !this.isCollapsed;
      this.$emit("collapsedChange", this.isCollapsed);
    }
  },
  mounted() {

  }
};
</script>
<style lang="scss" scoped>
.videoContainer{
   position:absolute;
   width: 600px;
   height: 1550px;
   right: 0.1rem;
   bottom: 0.1rem;
   background:rgba(84, 88, 169, 0.2);
   // border: 1px solid #0F2E60;
  // padding:0.1rem;
  &.collapsed{
    width: 0;
  }
}
.video-item{
  margin: 0.18rem 0rem;
  width: 100%;
  height: 2.8rem;
}
.video-title{
  font-size: 0.32rem;
}
.mapControlLableIcon {
  display: inline-block;
  font-size: 0.28rem;
  transform: rotate(90deg);
  color:#92B9F7;
  cursor: pointer;
}

.collapse{
  position: absolute;
  top: 5.5rem;
  left: -0.3rem;
  height: 1.6rem;
  width: 0.3rem;
  background: url('./collapse.png') no-repeat no-repeat;
  background-size: 100% 100%;
  cursor:pointer;
  font-size: 0.3rem;

  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
