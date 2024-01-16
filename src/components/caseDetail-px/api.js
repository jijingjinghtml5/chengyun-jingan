import request from '@/http/request'
import requestJa from '@/http/requestJa'

export function getCaseDetail (id) {
  return request({
    url: '/v2/data-api/146',
    params: {
      uuid: id
    }
  })
}
export function getCaseDetail194 (id, channel) {
  return request({
    url: '/v2/data-api/194',
    params: {
      uuid: id,
      channel
    }
  })
}
export function getHotLineCaseDetail (id) {
  return requestJa({
    url: '/united-ciimc-api/v1/generic-query',
    params: {
      token: 'pd2e13b16eff42aeaec9bda8c570e2pd',
      table: 'hotline-event-message',
      index_type: 'active',
      uuid: id,
      filter: `uuid=eq.${id}`,
      limit: 1
    }
  })
}

export function getYunxingdongtaiCase (id, channel) {
  return requestJa({
    url: 'dmp2/district-platform-api/v5/event-detail',
    params: {
      uuid: id,
      channel
    }
  })
}