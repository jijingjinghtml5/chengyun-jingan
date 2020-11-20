import TrackingWebSoket from "./trackingwebsocket";
import Vue from "vue";

class TrackingProxy {
  socket = null;
  options = {
    wsurl: null // 当启用websocket 时传递的ws地
  };
  constructor(options) {
    if (options.wsurl) {
      this.options.wsurl = options.wsurl;
      this.initWebSocket();
    }
  }
  initWebSocket = (options) => {
    this.socket = new TrackingWebSoket(this.options);
  }
  clear() {
    if (this.socket) {
      this.socket.clear();
    }
  }
}

export default {
  install: function(Vue, options) {
    if (typeof options === "string") {
      options = {
        wsurl: options
      };
    }
    const trackingProxy = new TrackingProxy(options);
    Vue.$tracking = trackingProxy;
    Vue.prototype.$tracking = trackingProxy;
  }
};
