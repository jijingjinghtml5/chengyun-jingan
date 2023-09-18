import axios from "axios";
import dayjs from "dayjs";
import sha256 from 'js-sha256';
const service = axios.create({
  baseURL: (window.$config && window.$config.apiUrlForRj) || "",
  timeout: 30000
});

service.interceptors.request.use(
  config => {
    const timestamp = dayjs().unix()
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
    return res.data;
  },
  err => {
    // Do something with response error
    return Promise.reject(err);
  }
);

export default service;
