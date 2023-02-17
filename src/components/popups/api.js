import request from '@/http/request'
import requestJa from '@/http/requestJa'

export function getTrajectoryDataBy145 (id, time, need_polygon = '') {
  let timeMapping = {
    1: -3600,
    2: 'today'
  }
  return request({
    url: '/v2/data-api/145',
    params: {
      filter: `primeID.primeID=${id}&time=${timeMapping[time] || ''}`,
      need_polygon: need_polygon
    }
  })
}

/** ** 综治 ------ */
// 重点人员-卡片
export function getFocusPersonData (id) {
  // simple.messageType=population&mark=eq.1&simple.primeID=eq.population.342422198802033645
  let params = {
    filter: `simple.messageType=population&mark=eq.1&simple.primeID=eq.${id}`
  }
  return request({
    url: '/v2/data-api/221',
    params
  })
};
// 重点场所-卡片
export function getFocusAreaData (id) {
  // simple.messageType=zhongdianqiye&simple.primeID=eq.zhongdianqiye.D069C089D727414388917ABB0B2AAD03
  let params = {
    filter: `simple.messageType=zhongdianqiye&simple.primeID=eq.${id}`
  }
  return request({
    url: '/v2/data-api/222',
    params
  })
};

export function getParkLots () {
  return request({
    url: '/erupt-api/traffic/getCkParking'
  })
}

export function getPublicLine () {
  return request({
    url: '/v2/data-api/820',
    params: {
      filter: 'simple.messageType=eq.公交线路%26args.town_code=in.,0612,0604,0613,0615,0611,0603,0616,0614,0617,0602,0606,0607,0601,0605',
      geo_type: 'shlocal'
    }
  })
}

export function getBikeStreet () {
  return request({
    url: '/erupt-api/traffic/streetBikeInfo'
  })
}

export function getBusDetail (busNo) {
  return request({
    url: `/erupt-api/traffic/busList?busNo=${busNo}`
  })
}
