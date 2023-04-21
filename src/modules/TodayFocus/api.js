import request from '@/http/request'

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
