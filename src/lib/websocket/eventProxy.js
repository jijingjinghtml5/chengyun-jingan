
import EventWebSocket from "./eventwebsocket";
import Vue from "vue";

class EventProxy {
  socket = null;
  eventBus = null;
  socketClientId = null;
  options = {
    wsurl: null // 当启用websocket 时传递的ws地
  };
  init(options) {
    this.options = { ...this.options, ...options };
    this.eventBus = new Vue();
    if (this.options.wsurl) {
      this.options.messageHandle = this.messageHandle;
      this.socketClientId = this.getUniqueId();
      console.log("socket client id", this.socketClientId);
      this.initWebSocket();
    }
    return this;
  }
  initWebSocket = (options) => {
    this.socket = new EventWebSocket({ ...this.options, clientId: this.socketClientId });
  }
  getClientId() {
    return this.socketClientId;
  }
  $emit = (eventName, data, wsFlag = false) => {
    const messageData = {
       eventName: eventName,
       data: data
    };
    if (this.socket && this.wsFlag) {
      this.socket.sendMessage(messageData);
    } else {
      this.eventBus.$emit(eventName, data);
    }
  }
  $on = (eventName, func) => {
    this.eventBus.$on(eventName, func);
  }
  $off = eventName => {
    this.eventBus.$off(eventName);
  }
  messageHandle = (e) => { // websocket 接受message 处理函数
    try {
      console.log("receive data", e);
      const messageData = JSON.parse(e.data);
      if (messageData.data) {
        const meta = messageData.ext;
        const sendTo = meta && meta["sendTo"];
        if (!sendTo || sendTo == this.socketClientId) {
          console.log("receive data message", messageData);
          this.eventBus.$emit(messageData.data.eventName, messageData.data.data);
        }
      }
    } catch (e) {
      console.log(e);
    }
  }
  clear() {
    if (this.socket) {
      this.socket.clear();
    }
  }

  getUniqueId() {
    var date = new Date();
    var ss = date.getSeconds();
    var sss = date.getMilliseconds();
    var context = ss + sss + "" + Math.floor(Math.random() * 10) + Math.floor(Math.random() * 10) + Math.floor(Math.random() * 10) +
        Math.floor(Math.random() * 10) + Math.floor(Math.random() * 10) + Math.floor(Math.random() * 10);
    return context;
  }
}
export const eventProxy = new EventProxy();
export default {
  install: function(Vue, options) {
    if (typeof options === "string") {
      options = {
        wsurl: options
      };
    }
    eventProxy.init(options);
    Vue.$bus = eventProxy;
    Vue.prototype.$bus = eventProxy;
  }
};
