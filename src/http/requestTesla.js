import axios from "axios";
import dayjs from "dayjs";
import sha256 from 'js-sha256';
const service = axios.create({
  baseURL: (window.$config && window.$config.apiUrlForTesla) || "",
  timeout: 15000
});

service.interceptors.request.use(
  config => {
    const timestamp = dayjs().unix()
    config.headers = Object.assign({}, config.headers, {
      'Cy-Token': sha256(timestamp.toString()),
      'X-Timestamp': timestamp
    })
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
