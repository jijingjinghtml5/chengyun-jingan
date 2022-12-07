import axios from "axios";

const service = axios.create({
  baseURL: (window.$config && window.$config.apiUrl) || "",
  timeout: 15000
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
