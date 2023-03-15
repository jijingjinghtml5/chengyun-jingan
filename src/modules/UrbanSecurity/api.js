import request from '@/http/request'
import requestJa from '@/http/requestJa'
import requestTesla from '@/http/requestTesla'

export function getDeviceRate () {
  return request({
    url: 'http://10.210.230.170/api-dam/statistics/onlineRateStatistics'
  })
}

export function getData () {
  return request({
    url: '/v2/data-api/430'
  })
}
// 应急指挥列表
export function getListData1 () {
  return requestTesla({
    url: 'http://10.210.232.56:18080/dynamicdata/list/?data_type=静安区-应急系统-组织架构'
  })
}
export function getListData2 () {
  return requestTesla({
    url: 'http://10.210.232.56:18080/dynamicdata/list/?data_type=静安区-应急系统-组织架构-区管国企'
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
      limit: 0
    }
  })
}
