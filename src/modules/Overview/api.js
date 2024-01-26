import request from '@/http/request'

export function getTitleCount() {
  return request({
    url: "http://10.210.232.237/internal-api/gateway/opinion/today-stat"
  });
}

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
      filter: 'simple.messageType=eq.WeatherPredictionWarning&area_district.areaName=eq.静安区&relieveTime=ex.false'
    }
  })
}

export function getWeatherAlarmNew () {
  return request({
    url: 'http://10.210.232.237/internal-api/gateway/daily_weather/weather_alarm?district=上海市'
  })
}
