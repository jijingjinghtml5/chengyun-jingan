import axios from "axios";
import { cancelPrevAxiosApi } from "@/utils/cancelApi";

const service = axios.create({
  baseURL: (window.$config && window.$config.videoService) || "",
  timeout: 30000
});

cancelPrevAxiosApi(service);

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
    let data = res.data;
    return data;
  },
  err => {
    // Do something with response error
    return Promise.reject(err);
  }
);

export default service;
