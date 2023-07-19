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

export function getData2 (params) {
  return request({
    url: 'http://10.210.232.238/dmp2/district-platform-api/v7/today-attention',
    params: {
      district: '静安区',
      token: 'dp3e13b16eff2aeaec9bda8cc70e3dp',
      ...params
    }
  })
}
export function getDataItems (params) {
  return request({
    url: 'http://10.210.232.237/internal-api/gateway/manager-client-api/jrgz',
    params: {
      // district: '静安区',
      token: 'dp3e13b16eff2aeaec9bda8cc70e3dp',
      ...params
    }
  })
}
// export function getListData (filter) {
//   return request({
//     url: '/v2/data-api/427',
//     params: {
//       filter: filter
//     }
//   })
// }

export function getListData (filter) {
  return request({
    url: 'http://10.210.232.238/dmp2/united-ciimc-api/v1/generic-query',
    params: {
      table: 'area-event',
      limit: 10000,
      index_type: 'active',
      district: '静安区',
      transform: 'messages[*].{id:data.eventID, eventName: args.eventName, address: data.address,  town: data.town.areaName, openTS: data.openTS, status: data.exevt_status, lng: data.location.longitude, lat: data.location.latitude, chs_superviseDone: args.chs_superviseDone, chs_timestamp_305: args.chs_timestamp_305 }',
      token: 'dp3e13b16eff2aeaec9bda8cc70e3dp',
      geo_type: 'shlocal',
      source: 'data.eventID,args.eventName,data.address,data.town,data.openTS,data.exevt_status,data.location,args.chs_superviseDone,args.chs_timestamp_305',
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
