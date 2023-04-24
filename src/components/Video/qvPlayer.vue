<template>
  <div class="video">
    <LivePlayer class="livePlayer" ref="livePlayer" :videoUrl="videoUrl" :autoplay="true" :loop="true"
        :live="live" :muted="true" @play="canplay" :controls="true" :video-title="code"/>

    <div v-if="posterShow" class="MsgBox" style="background-color:#000;">
      <div class="tip-info">
        <img :src="require('@/assets/videoPlayer/videoPlayer_loading.gif')" />
      </div>
    </div>
    <div v-if="errorLoading" class="MsgBox" style="background-color:#000;">
        <img :src="require('@/assets/videoPlayer/error_loading.png')" style="width:100%;height:100%;cursor:pointer;" @click="handleError"/>
    </div>
    <div v-show="!posterShow && videoUrl === ''" class="MsgBox">
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

      posterShow: false,
      player: null,
      videoUrl: "",
      code: "",
      errorLoading: false
    };
  },
  watch: {
    videoSrc: {
      handler (nv) {
        if (nv && nv.code) {
          console.log("player：qv-player; videoUrl：" + nv.url);
          this.posterShow = true;
          this.videoUrl = nv.url;
          this.code = nv.code;
          this.errorLoading = nv.errorMessage;
          if (nv.url && nv.type !== "rtmp/flv") {
            this.$nextTick(() => {
              this.player = this.$el.getElementsByTagName("video")[0];
              this.player.addEventListener("canplay", this.canplay);
            });
          }
        } else {
           this.posterShow = false;
           this.videoUrl = "";
           this.code = "";
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
    },
    handleError() {
      this.$emit("reLoading", this.videoSrc);
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
      .video-wrapper{
        width: 100%;
        height: 100%;
        padding-bottom: 0 !important;
      }
      .video-wrapper .video-js .vjs-control-bar {
        font-size: 0.24rem;
      }
      .video-wrapper .video-title {
        max-width: 5rem;
        font-size: 0.24rem;
      }
      video {
        object-fit: cover;
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
