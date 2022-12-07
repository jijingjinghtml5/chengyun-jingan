import axios from 'axios'

const service = axios.create({
  baseURL: (window.$config && window.$config.apiUrlForJa) || '',
  timeout: 15000
})

service.interceptors.request.use(
  config => {
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
