import axios from "axios";
import { cancelPrevAxiosApi } from "@/utils/cancelApi";
import dayjs from "dayjs";
import sha256 from 'js-sha256';
const service = axios.create({
  baseURL: (window.$config && window.$config.videoService) || "",
  timeout: 30000
});

cancelPrevAxiosApi(service);

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
    let data = res.data;
    return data;
  },
  err => {
    // Do something with response error
    return Promise.reject(err);
  }
);

export default service;
