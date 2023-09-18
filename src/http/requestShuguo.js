import axios from "axios";
import dayjs from "dayjs";
import sha256 from 'js-sha256';
function getUniqueId() {
  var date = new Date();
  var ss = date.getSeconds();
  var sss = date.getMilliseconds();
  var context = ss + sss + "" + Math.floor(Math.random() * 10) + Math.floor(Math.random() * 10) + Math.floor(Math.random() * 10) +
      Math.floor(Math.random() * 10) + Math.floor(Math.random() * 10) + Math.floor(Math.random() * 10);
  return context;
}

const service = axios.create({
  baseURL: "http://127.0.0.1:8086",
  timeout: 15000
});

service.interceptors.request.use(
  config => {
    const timestamp = dayjs().unix()
    config["params"]["random"] = getUniqueId();
    config["params"] = {
      ...config["params"],
      "cy-token": sha256(timestamp.toString()),
      "x-timestamp": timestamp,
    };
    return config;
  },
  err => {
    // Do something with request error
    return Promise.reject(err);
  }
);

service.interceptors.response.use(
  res => {
    // 添加一个响应拦截器
    // 在这里对返回的数据进行处理
    let data = res.data;
    return data;
  },
  err => {
    // Do something with response error
    return Promise.reject(err);
  }
);

export default service;
