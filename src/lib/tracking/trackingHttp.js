import { getCode } from "@/utils/code";
import axios from "axios";

class TrackingHttp {
  timer = null;
  timeout = 10000; // 心跳间隔 10s
  request = null;

  trackingUrl = ""; // t ra c

  startTime = null; // 开始时间
  userAgent = null; // 本机user agent
  url = ""; // 当前访问url

  constructor(options) {
    this.trackingUrl = options.trackingUrl;
    if (this.trackingUrl) {
      this.initConfig();
      this.init();
      this.start();
    }
  }
  init() {
    this.request = axios.create({
      baseURL: "",
      timeout: 5000
    });
  }
  start() {
    if (this.timer) {
      clearInterval(this.timer);
    }
    this.timer = setInterval(() => {
        this.send();
    }, this.timeout);
  }

  send() {
    this.request.post(this.trackingUrl, {
      url: this.url,
      userAgent: this.userAgent,
      visitTime: this.caculateTime(),
      startTime: this.startTime,
      code: getCode()
    });
  }

  initConfig() {
    // 读取本地的信息
    this.url = window.location.href;
    this.userAgent = navigator.userAgent;
    this.startTime = Date.parse(new Date()) / 1000;
  }

  caculateTime() {
    return Date.parse(new Date()) / 1000 - this.startTime;
  }
}

export default {
  install: function(Vue, options) {
    if (typeof options === "string") {
      options = {
        trackingUrl: options
      };
    }
    const trackingProxy = new TrackingHttp(options);
    Vue.$tracking = trackingProxy;
    Vue.prototype.$tracking = trackingProxy;
  }
};
