<template>
  <div class="wrapper">
    <video
      :id="'videoElement_' + index"
      controls
      autoplay
      muted
      cover
      width="100%"
      height="100%"
    ></video>
    <!-- <button @click="play">播放</button> -->
  </div>
</template>

<script>
import flvjs from "flv.js";
export default {
  props: {
    videoUrl: {
      type: String,
      default: ''
    },
    index: {
      type: Number,
      default: 0
    },
  },
  data() {
    return {
      flvPlayer: null,
    };
  },
  watch: {
    videoUrl (newVal) {
      if (newVal) {
        if (this.flvPlayer) {
          this.flvPlayer.destroy();
          this.flvPlayer = null
          // alert(this.videoUrl)
          // this.flvPlayer.url = newVal
          // this.flvPlayer.load();
          // this.flvPlayer.play();
        }
        this.init()
      }
    }
  },
  mounted () {},
  methods: {
    init () {
      if (flvjs.isSupported()) {
        var videoElement = document.getElementById("videoElement_"+this.index);
        this.flvPlayer = flvjs.createPlayer({
          type: 'flv',
          isLive: true,
          hasAudio: false,
          url: this.videoUrl,
        });
        this.flvPlayer.attachMediaElement(videoElement);
        this.flvPlayer.load();
        this.flvPlayer.play();
      }
    },
    play() {
      this.flvPlayer.play();
    },
  },
  beforeDestroy() {
    // 播放器存在清除播放器
    if (this.flvPlayer) {
      this.flvPlayer.destroy();
    }
  },
};
</script>

<style scoped>
.wrapper {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  video {
    object-fit: cover;
  }
}

.iframe {
  width: 1024px;
  height: 608px;
  position: absolute;
  top: -150px;
  left: -120px;
}
</style>
