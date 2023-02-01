import request from '@/http/request'

export function getHotlineData (params) {
  return request({
    url: '/v2/data-api/817',
    params
  })
}

// 人员统计
export function getPeopleStatistic (type) {
  return request({
    url: '/v2/data-api/423',
    params: {
      filter: `simple.messageType=population%26status=eq.1&args.population_syrklbhz=eq.${type}`
    }
  })
}

// 案件分街镇统计
export function getCaseTownCount (district, type) {
  const url = '/v2/data-api/406'
  return request({
    url,
    params: {
      district: district,
      filter: `openTS=-604800&eventDiscoverType=eq.${type}`
    }
  })
}

// 街镇案件列表
export function getCaseTownList (town) {
  const url = '/v2/data-api/364'
  return request({
    url,
    params: {
      filter: `openTS=-604800&town.name=eq.${town}&polygon=${town}`
    }
  })
}
