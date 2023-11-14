import axios from 'axios'
import dayjs from "dayjs";
import sha256 from 'js-sha256';
import config from '@/config/index'
const service = axios.create({
  baseURL: (config && config.apiDocs) || '',
  timeout: 30000
})

service.interceptors.request.use(
  config => {
    const timestamp = dayjs().unix()
    config["params"] = {
      ...config["params"],
      "cy-token": sha256(timestamp.toString()),
      "x-timestamp": timestamp,
    };
    return config
  },
  err => {
    return Promise.reject(err)
  }
)

service.interceptors.response.use(
  res => {
    return res.data
  },
  err => {
    return Promise.reject(err)
  }
)

export default service
