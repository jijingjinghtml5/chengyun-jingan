<template>
  <div class="video">
    <LivePlayer class="livePlayer" ref="livePlayer" :videoUrl="videoUrl" :autoplay="true" :loop="true"
        :live="live" :muted="true" @play="canplay" :controls="true" :video-title="code"/>

    <div v-if="posterShow && videoUrl != ''" class="MsgBox" style="background-color:#000;">
      <div class="tip-info">
        <img :src="require('@/assets/videoPlayer/videoPlayer_loading.gif')" />
      </div>
    </div>

    <div v-show="videoUrl === ''" class="MsgBox">
      <div class="tip-info">
        <img :src="require('@/assets/videoPlayer/videoPlayer_cam.png')" />
        <p>等待视频接入</p>
      </div>
    </div>
  </div>
</template>

<script>
import LivePlayer from "@liveqing/liveplayer";

export default {
  components: { LivePlayer },
  props: {
    videoSrc: {
      type: Object,
      default () {
        return {
          url: "",
          type: "video/mp4"
        };
      }
    },
    live: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      version: "1.0.2.20191112_rem",

      posterShow: true,
      player: null,
      videoUrl: "",
      code: ""
    };
  },
  watch: {
    videoSrc: {
      handler (nv) {
        if (nv && (nv.url || nv.url === "")) {
          console.log("qvPlayerVersion：" + this.version);
          console.log("videoUrl：" + nv.url);
          this.posterShow = true;
          this.videoUrl = "";
          this.$nextTick(() => {
            this.videoUrl = nv.url;
            this.code = nv.code || "";
            if (nv.url && nv.type !== "rtmp/flv") {
              this.$nextTick(() => {
                this.player = this.$el.getElementsByTagName("video")[0];
                this.player.addEventListener("canplay", this.canplay);
              });
            }
          });
        }
      },
      immediate: true
    }
  },
  methods: {
    canplay (e) {
      if (this.videoSrc && this.videoSrc.type !== "rtmp/flv") this.player.removeEventListener("canplay", this.canplay);
      console.log("canplay");
      this.posterShow = false;
    }
  },
  beforeDestroy () {
    console.log("qvPlayer: beforeDestroy");
    if (this.player && this.videoSrc && this.videoSrc.type !== "rtmp/flv") this.player.removeEventListener("canplay", this.canplay);
  }
};
</script>

<style lang="scss" scoped>
.video{
  position: relative;
  width: 100%;
  height: 100%;

  .livePlayer{
    position: relative;
    width: 100%;
    height: 100%;
    /deep/ {
      video {
        object-fit: cover;
      }
      .video-wrapper {
        width: 100%;
        height: 100%;
        padding-bottom: 0 !important;
      }
      .video-title {
        right: auto;
        top: 0.1rem;
        right: 0.1rem;
        font-size: 0.24rem;
        max-width: 4rem;
      }
    }
  }

  .MsgBox {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: #434347;
    display: flex;
    align-items: center;
    justify-content: center;

    .tip-info {
      text-align: center;
      img {
        display: inline-block;
        vertical-align: middle;
        max-width: 100%;
      }
      p {
        display: inline-block;
        vertical-align: middle;
        font-size: 0.18rem;
        color: #868282;
        margin: 0 0 0 0.1rem;
      }
    }
  }
}
</style>
