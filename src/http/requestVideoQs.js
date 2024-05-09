import axios from "axios";
import { cancelPrevAxiosApi } from "@/utils/cancelApi";
import dayjs from "dayjs";
import sha256 from 'js-sha256';
import config from '@/config/index'
const service = axios.create({
  baseURL: "http://10.210.231.100:10000",
  timeout: 30000
});

cancelPrevAxiosApi(service);

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
    let data = res.data;
    return data;
  },
  err => {
    // Do something with response error
    return Promise.reject(err);
  }
);

export default service;
