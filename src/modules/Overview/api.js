import request from '@/http/request'

export function getCount () {
  return request({
    url: '/erupt-api/yuqing/overview'
  })
}

export function getData () {
  return request({
    url: '/v2/data-api/426'
  })
}
/**
 * 气象预警
 */
export function getWeatherAlarm () {
  return request({
    url: '/v2/data-api/445',
    params: {
      filter: 'simple.messageType=eq.WeatherPredictionWarning&area_district.areaName=eq.静安区&relieveTime=ex.false&publishTime=today'
    }
  })
}
