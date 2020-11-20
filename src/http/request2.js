import axios from "axios";
import { getCode } from "@/utils/code";

const service = axios.create({
  baseURL: (window.$config && window.$config.apiUrl) || "",
  timeout: 15000
});

service.interceptors.request.use(
  config => {
    // 在请求发出之前进行一些操作
    // if (config)
    // if (config.method.toLocaleLowerCase() === "get") {
    //   config.params = {
    //     ...(config.params || {}),
    //     layoutId:
    //       window.$config && window.$config.layoutId
    //         ? window.$config.layoutId
    //         : null,
    //     street:
    //       window.$config && window.$config.street
    //         ? encodeURI(window.$config.street)
    //         : null
    //   };
    // }
    if (!config.noCode && getCode()) {
      config["params"] = { ...config["params"], code: getCode() };
    }
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
    // if (data.code === 200) {

      return data;
  },
  err => {
    // Do something with response error
    return Promise.reject(err);
  }
);

export default service;
