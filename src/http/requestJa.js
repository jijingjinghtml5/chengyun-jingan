import axios from 'axios'
import dayjs from "dayjs";
import sha256 from 'js-sha256';
const service = axios.create({
  baseURL: (window.$config && window.$config.apiUrlForJa) || '',
  timeout: 15000
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
    let data = res.data
    return data
  },
  err => {
    return Promise.reject(err)
  }
)

export default service
