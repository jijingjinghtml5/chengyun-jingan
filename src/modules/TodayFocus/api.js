import request from '@/http/request'
import request2 from '@/http/request2'

export function getDuchaDuban () {
  return request({
    url: '/v2/data-api/857'
  })
}

export function getData () {
  return request({
    url: '/v2/data-api/424'
  })
}

export function getListData (filter) {
  return request({
    url: '/v2/data-api/427',
    params: {
      filter: filter
    }
  })
}

export function getSspListData (params) {
  return request({
    url: '/v2/data-api/814',
    params
  })
}

export function getHotlineData (params) {
  return request({
    url: '/v2/data-api/817',
    params
  })
}

export function getDuchaData (params) {
  return request({
    url: '/v2/data-api/855',
    params
  })
}

export function getDubanData (params) {
  return request({
    url: '/v2/data-api/856',
    params
  })
}

export function getDubanTrend (params) {
  return request({
    url: '/district-platform-api/report/supervise-handle-ststs-v2',
    params: {
      mark: 3,
      district: '静安区',
      token: '240e13b16eff42aeaec9bda8c5707f84',
      ...params
    }
  })
}

export function getDuChaTrend (params) {
  return request2({
    url: '/district-platform-api/report/supervise-stats',
    params: {
      code: 0,
      district: '静安区',
      token: '240e13b16eff42aeaec9bda8c5707f84',
      ...params
    }
  })
}
