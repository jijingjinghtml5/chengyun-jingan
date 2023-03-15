import request from '@/http/request'
import requestJa from '@/http/requestJa'

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
  return requestJa({
    url: '/united-ciimc-api/v1/generic-query',
    params: {
      token: 'pd2e13b16eff42aeaec9bda8c570e2pd',
      table: 'hotline-event-message',
      index_type: 'active',
      district: '静安区',
      sort_by: 'data.openTS|desc',
      group_by: 'simple.messageClass(filter.today:openTS=today&percreateTime=ex.true)(filter.yesterday:openTS=yesterday&percreateTime=ex.true)',
      transform: 'aggResults."simple.messageClass"[0]',
      limit: 0,
      ...params
    }
  })
}
