export default class EventWebSoket {
  websock = null;
  lockReconnect = null; // 锁定重新链接  防止重复连接
  reconnectTimer = null; // 重连定时器
  heartBeatTimer = null; // 心跳定时器
  serverTimeoutTimer = null; // 心跳检测超时定时器
  timeout = 10000; // 心跳间隔 10s
  reconnectTimeout= 10000; // 重连超时时间

  clientId=null; // 端唯一标志

  config = {
    wsurl: null, // socket 地址
    messageHandle: (data) => {
      console.log(data);
    }
  }
  constructor(options) {
    console.log("websock config:", options);
    this.config = { ...this.config, ...options };
    this.clientId = options.clientId;
    this.init();
  }
  init() {
    console.log("init websocket with url:", this.config.wsurl);
    this.websock = new WebSocket(this.config.wsurl + "?c=" + this.clientId);
    this.websock.onopen = this.onOpen;
    this.websock.onmessage = this.onMessage;
    this.websock.onerror = this.onError;
    this.websock.onclose = this.onClose;
  }
  onOpen = () => {
    console.log("connect success");
    this.heartBeat(); // 开启心跳检测
  };
  onMessage = data => {
    this.heartBeat(); // 收到消息推迟心跳检测
    this.config.messageHandle(data);
  };
  onError = () => {
    console.log("connect failed");
    this.reconnect();
  };
  onClose = () => {
    console.log("close connection");
    this.reconnect();
  };
  sendMessage(data) {
    console.log("send data");
    this.send({
      cmd: "message",
      data: data,
      ext: {
        clientId: this.clientId
      }
    });
  }
  send(data) {
    this.websock.send(JSON.stringify(data));
  }
  // 断线重连
  reconnect() {
    if (this.lockReconnect) {
      // 这里很关键，因为连接失败之后之后会相继触发 连接关闭，不然会连接上两个 WebSocket
      return;
    }
    this.lockReconnect = true;
    this.reconnectTimer && clearTimeout(this.reconnectTimer);
    this.reconnectTimer = setTimeout(() => {
      this.init();
      this.lockReconnect = false;
    }, this.reconnectTimeout);
  }
  // 心跳检测
  heartBeat() {
    this.heartBeatTimer && clearTimeout(this.heartBeatTimer);
    this.serverTimeoutTimer && clearTimeout(this.serverTimeoutTimer);
    this.heartBeatTimer = setTimeout(() => {
      this.send({ cmd: "heartbeat" }); // 根据后台要求发送
      this.serverTimeoutTimer = setTimeout(() => {
        this.websock.close(); // 如果  5秒之后我们没有收到 后台返回的心跳检测数据 断开socket，断开后会启动重连机制
      }, 5000);
    }, this.timeout);
  }

  clear() {
    this.lockReconnect = true;
    this.websock.close(); // 离开路由之后断开websocket连接
    clearTimeout(this.reconnectTimer); // 离开清除 timeout
    clearTimeout(this.heartBeatTimer); // 离开清除 timeout
    clearTimeout(this.serverTimeoutTimer); // 离开清除 timeout
  }
}
