import { getParams } from "../../../utils";
import { ipCheck, check_login } from "@/http/api";
import config from '@/config/index'
export default {
  data() {
    return {
      isLogin: false,
      params: getParams(),
      url: encodeURIComponent(window.location.href),
      token: null,
    };
  },
  created() {
    const token = window.sessionStorage.getItem("token") || this.params.token;
    // if (!token) {
    //   ipCheck().then(res => {
    //     // console.log("ipcheck", res);
    //     if (res) {
    //       this.isLogin = true;
    //       window.sessionStorage.setItem("token", "superAdmin");
    //       const time = Date.parse(new Date()) + 100 * 86400 * 1000;
    //       window.sessionStorage.setItem("_t", time);
    //     } else {
    //       window.location.href = config.loginUrl + (config.loginUrl.indexOf("?") === -1 ? "?" : "&") + "code=" + this.params.code + "&redirect_url=" + this.url;
    //     }
    //   }).catch(() => {
    //     window.location.href = config.loginUrl + (config.loginUrl.indexOf("?") === -1 ? "?" : "&") + "code=" + this.params.code + "&redirect_url=" + this.url;
    //   });
    // } else {
    //   this.isLogin = true;
    //   // 事件验证
    //   const timer = setInterval(() => {
    //     const current = Date.parse(new Date());
    //     const time = window.sessionStorage.getItem("_t");
    //     if (current >= time) {
    //       window.sessionStorage.removeItem("token");
    //       this.token = null;
    //     }
    //   }, 10 * 60 * 1000);
    //   this.$once("hook:beforeDestroy", () => {
    //     timer && clearInterval(timer);
    //   });
    // }
    check_login({ token })
      .then((res) => {
        if (res.code == 200) {
          this.isLogin = true;
          window.sessionStorage.setItem("token", token || "superAdmin");
          const time = Date.parse(new Date()) + 100 * 86400 * 1000;
          window.sessionStorage.setItem("_t", time);
        } else {
          window.location.href = config.loginUrl + (config.loginUrl.indexOf("?") === -1 ? "?" : "&") + "code=" + this.params.code + "&redirect_url=" + this.url;
        }
      })
      .catch(() => {
        window.location.href = config.loginUrl + (config.loginUrl.indexOf("?") === -1 ? "?" : "&") + "code=" + this.params.code + "&redirect_url=" + this.url;
      });
  },
};
