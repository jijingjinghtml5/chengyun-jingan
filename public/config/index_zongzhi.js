window.$config = {
  // 正式
  // apiUrl: "http://127.0.0.1:20190", // 政务
  // apiUrl: "http://mx-chengyun-prod-api.chinadigitalcity.com", // 美欣
  // wsUrl: "ws://10.210.231.96",
  // 测试
  apiUrl: "http://10.81.71.38",
  // apiUrl: "http://192.168.123.123",
  // apiUrl: "http://172.16.4.129", // 张
  //  apiUrl: "http://10.210.231.96",
  // apiUrl: "http://172.16.4.78:18306", // 兰
  // apiUrl: "http://192.168.19.110:18306",
  // apiUrl: "http://192.168.19.185:18306", // 张恒
  // wsUrl: "ws://52.83.128.140:20190",
  // trackingWs: "ws://127.0.0.1:20190/tracking",
  // tracking: 'http://127.0.0.1:20190/tracking',
  mapComponentUrl: "http://10.81.71.51/citygis/areamap/",
  mapSocketHost: "10.101.42.199",
  mapSocketPort: 39001,
  videoDelay: 500,
  noAuthPage: "./403.html",
  videoService: 'http://10.81.71.39:8080',
  loginUrl: './login.html',
  WwLogin: {
    host: "http://10.81.71.38",
    appid: "wwc11834673dba4d44", 
    agentid: "1000040", 
    redirectUri: "127.0.0.1:8081"
  }
};
