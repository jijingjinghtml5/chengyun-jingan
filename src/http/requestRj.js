import axios from "axios";

const service = axios.create({
  baseURL: (window.$config && window.$config.apiUrlForRj) || "",
  timeout: 30000
});

service.interceptors.request.use(
  config => {
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
