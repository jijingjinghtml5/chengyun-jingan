import request from '@/http/request'

export function getTrendData (type, id, time, group_by) {
  let filter = ''
  if (type === 'find') {
    filter = `args.chs_eventSourceType=eq.监督员上报&openTS=${time}&args.chs_userId_21=eq.${id}`
  } else {
    filter = `args.chs_timestamp_4=time.${time}&args.chs_userId_4=eq.${id}`
  }

  return request({
    url: '/v2/data-api/446',
    params: {
      filter: filter,
      group_by: `${group_by},district_eventType.1,_filter.easy_process?args.chs_type=eq.2,_filter.normal_process?args.chs_type=neq.2`
    }
  })
}

export function getTrajectoryDataBy145 (id, time, need_polygon = '') {
  const timeMapping = {
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

export function getDetailData (id) {
  return request({
    url: '/v2/data-api/448',
    params: {
      filter: `simple.primeID=eq.${id}`
    }
  })
}
// 某人某天的案件
export function getPeopleDayCase (params) {
  return request({
    url: '/v2/data-api/567',
    params: params
  })
}

export function getDataBy145 (params) {
  return request({
    url: '/v2/data-api/145',
    params: params
  })
}
