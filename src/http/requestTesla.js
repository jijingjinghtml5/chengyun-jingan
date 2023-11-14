import axios from "axios";
import dayjs from "dayjs";
import sha256 from 'js-sha256';
import config from '@/config/index'

const service = axios.create({
  baseURL: (config && config.apiUrlForTesla) || "",
  timeout: 15000
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
    console.log("request url:", res.config.url, ", status:", res.status, ", return:", res.data);
    const data = res.data;
    return data;
  },
  err => {
    // Do something with response error
    return Promise.reject(err);
  }
);

export default service;
