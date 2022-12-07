import request from '@/http/request'
import request2 from '@/http/request2'
import requestJa from '@/http/requestJa'

export function getData () {
  return request({
    url: '/v2/data-api/425'
  })
}

export function getParkLot () {
  return requestJa({
    url: '/erupt-api/traffic/getRoadIndex'
  })
}

export function getParkLotChart () {
  return request({
    url: '/erupt-api/traffic/getParkingFlow'
  })
}

export function getPublicLine () {
  return request({
    url: '/v2/data-api/820',
    params: {
      filter: 'simple.messageType=eq.公交线路%26args.town_code=in.,0612,0604,0613,0615,0611,0603,0616,0614,0617,0602,0606,0607,0601,0605'
    }
  })
}

export function getPublicPoint () {
  return request({
    url: '/v2/data-api/821',
    params: {
      filter: 'simple.messageType=eq.公交站点%26args.town_code=in.,0612,0604,0613,0615,0611,0603,0616,0614,0617,0602,0606,0607,0601,0605'
    }
  })
}

export function getPublicTransportChart () {
  return request2({
    url: '/erupt-api/traffic/getChart?type=publicTraffic&code=GetMetroInOutChartFromDB&scene=nx'
  })
}

export function getBike () {
  return requestJa({
    url: '/erupt-api/traffic/bikeInfo'
  })
}
