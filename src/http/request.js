import axios from "axios";
import { getCode } from "@/utils/code";
import { eventProxy } from "@/lib/websocket/eventProxy";
import sha256 from 'js-sha256';
import dayjs from "dayjs";
const service = axios.create({
  baseURL: (window.$config && window.$config.apiUrl) || "",
  timeout: 30000,
});

service.interceptors.request.use(
  (config) => {
    const timestamp = dayjs().unix()
    config.headers = Object.assign({}, config.headers, {
      Authorization: window.sessionStorage.getItem("token"),
      'Cy-Token': sha256(timestamp.toString()),
      'X-Timestamp': timestamp
    });
    if (!config.noCode && getCode()) {
      config["params"] = { ...config["params"], code: getCode() };
    }
    return config;
  },
  (err) => {
    // Do something with request error
    return Promise.reject(err);
  }
);

service.interceptors.response.use(
  (res) => {
    // 添加一个响应拦截器
    // 在这里对返回的数据进行处理
    let data = res.data;
    if (data.code && data.code === 401) {
      // 登陆 todo
      window.sessionStorage.setItem("token", null);
      eventProxy.$emit("changeToken", null);
      return Promise.reject(new Error("token验证失败"));
    } else if (data.code && data.code === 403) {
      window.location.href = window.$config.noAuthPage;
      return Promise.reject(data.data);
    } else if (data.data) {
      return data.data;
    } else {
      let error = res.data.message || "服务器异常";
      return Promise.reject(error);
    }
  },
  (err) => {
    // Do something with response error
    return Promise.reject(err);
  }
);

export default service;
