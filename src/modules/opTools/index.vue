<template>
  <div class="tools-wrap">
    <div class="refresh">
      <span class="iconfont icon-duomeitiicon-" @click="refresh"></span>
    </div>
    <div class="fullscreen">
      <span :class="`iconfont ${fullscreenIcon}`" @click="fullscreen"></span>
    </div>
    <div class="close">
      <span :class="`iconfont icon-close`" @click="close"></span>
    </div>
  </div>
</template>
<script>
import { logout } from '@/http/api/index'
export default {
  data() {
    return {
      isFullscreeen: false,
    };
  },
  computed: {
    fullscreenIcon() {
      return this.isFullscreeen ? "icon-tuichuquanping" : "icon-fullScreen";
    },
  },
  methods: {
    refresh() {
      window.location.reload();
    },
    fullscreen() {
      if (this.isFullscreeen) {
        this.isFullscreeen = false;
        if (document.exitFullScreen) {
          document.exitFullscreen();
        }
        // 兼容火狐
        console.log(document.mozExitFullScreen);
        if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        }
        // 兼容谷歌等
        if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        }
        // 兼容IE
        if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      } else {
        this.isFullscreeen = true;
        if (document.documentElement.RequestFullScreen) {
          document.documentElement.RequestFullScreen();
        }
        // 兼容火狐
        console.log(document.documentElement.mozRequestFullScreen);
        if (document.documentElement.mozRequestFullScreen) {
          document.documentElement.mozRequestFullScreen();
        }
        // 兼容谷歌等可以webkitRequestFullScreen也可以webkitRequestFullscreen
        if (document.documentElement.webkitRequestFullScreen) {
          document.documentElement.webkitRequestFullScreen();
        }
        // 兼容IE,只能写msRequestFullscreen
        if (document.documentElement.msRequestFullscreen) {
          document.documentElement.msRequestFullscreen();
        }
      }
    },
    async close() {
      // 当前页面通过window.open打开时有效
      if (window.opener && window.opener !== window) {
        window.close()
      } else {
        // window.open('http://192.168.68.10:8080/page1.html?code=DQyRp2OnCjWprnTKolsxdt5pRp1NCCV-')
        const token = window.sessionStorage.getItem('token')
        const res = await logout({ token })
        if (res.code) {
          window.sessionStorage.removeItem('token')
          window.location.reload()
        }
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.tools-wrap {
  position: absolute;
  top: 0.1rem;
  right: 0.1rem;
  z-index: 100;

  display: flex;
  align-items: center;
  font-size: 0.3rem;
  color: rgba(24, 255, 255, 0.8);

  .refresh,
  .fullscreen,
  .close {
    flex: 1;
    margin-right: 0.1rem;
    cursor: pointer;
  }
  .close {
    font-size: 0.24rem;
  }
}
</style>
