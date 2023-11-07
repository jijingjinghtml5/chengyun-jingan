import request from "@/http/request";
import request2 from "@/http/request2";

export function getDuchaDuban() {
  return request({
    url: "/v2/data-api/857",
  });
}

export function getData() {
  return request({
    url: "/v2/data-api/424",
  });
}

export function getData2(params) {
  return request({
    url: "http://10.210.232.238/dmp2/district-platform-api/v7/today-attention",
    params: {
      district: "静安区",
      token: "dp3e13b16eff2aeaec9bda8cc70e3dp",
      ...params,
    },
  });
}
export function getDataItems(params) {
  return request({
    url: "http://10.210.232.237/internal-api/gateway/manager-client-api/jrgz",
    params: {
      // district: '静安区',
      token: "dp3e13b16eff2aeaec9bda8cc70e3dp",
      ...params,
    },
  });
}
// export function getListData (filter) {
//   return request({
//     url: '/v2/data-api/427',
//     params: {
//       filter: filter
//     }
//   })
// }

export function getListData(filter) {
  return request({
    url: "http://10.210.232.238/dmp2/united-ciimc-api/v1/generic-query",
    params: {
      table: "area-event",
      limit: 10000,
      index_type: "active",
      district: "静安区",
      transform:
        "messages[*].{id:data.eventID, eventName: args.eventName, address: data.address,  town: data.town.areaName, openTS: data.openTS, status: data.exevt_status, lng: data.location.longitude, lat: data.location.latitude, chs_superviseDone: args.chs_superviseDone, chs_timestamp_305: args.chs_timestamp_305 }",
      token: "dp3e13b16eff2aeaec9bda8cc70e3dp",
      geo_type: "shlocal",
      source:
        "data.eventID,args.eventName,data.address,data.town,data.openTS,data.exevt_status,data.location,args.chs_superviseDone,args.chs_timestamp_305",
      filter: filter,
      need_polygon: 1
    },
  });
}

export function getSspListData(params) {
  return request({
    url: "/v2/data-api/814",
    params,
  });
}

export function getHotlineData(params) {
  return request({
    url: "/v2/data-api/817",
    params,
  });
}

export function getDuchaData(params) {
  return request({
    url: "/v2/data-api/855",
    params,
  });
}

export function getDubanData(params) {
  return request({
    url: "/v2/data-api/856",
    params,
  });
}

export function getDubanTrend(params) {
  return request({
    url: "/district-platform-api/report/supervise-handle-ststs-v2",
    params: {
      mark: 3,
      district: "静安区",
      token: "240e13b16eff42aeaec9bda8c5707f84",
      ...params,
    },
  });
}

export function getDuChaTrend(params) {
  return request2({
    url: "/district-platform-api/report/supervise-stats",
    params: {
      code: 0,
      district: "静安区",
      token: "240e13b16eff42aeaec9bda8c5707f84",
      ...params,
    },
  });
}

export function getCodeNum(params) {
  return request({
    url: "http://10.210.232.238/united-ciimc-api/v1/generic-query",
    params: {
      index_type: "active",
      table: "unit",
      token: "pd2e13b16eff42aeaec9bda8c570e2pd",
      district: "静安区",
      filter: "has_bind=eq.1%26status=eq.1",
      group_by: "unit_type",
      limit: 0,
      transform: 'aggResults."unit_type"',
    },
  });
}

export function getStreetCodeNum(params) {
  return request({
    url:
      "http://10.210.232.237/internal-api/gateway/screen-api/generic-query-agg",
    params: {
      response_type: "list",
      field_or_agg: "street,count(street) as count",
      group_by: "street",
      table: "jingan_code",
    },
  });
}

export function getDistrictCase(params) {
  return request({
    url: "http://10.210.232.238/dmp2/united-ciimc-api/v1/generic-query",
    params: {
      index_type: "active",
      table: "area-event",
      token: "pd2e13b16eff42aeaec9bda8c570e2pd",
      district: "静安区",
      filter: `args.chs_eventSourceType=eq.静安码%26openTS=${params.start}~${params.end}`,
      group_by: `openTS.${params.type}[50~6${params.start}~7${params.end}],closeTS.${params.type}[50~${params.start}~${params.end}](filter.close:closeTS=${params.start}~${params.end}),simple.messageClass(filter.close:closeTS=${params.start}~${params.end})`,
      limit: 0,
      transform: "aggResults",
      need_polygon: 1
    },
  });
}

export function getStreetCase(params) {
  return request({
    url:
      "http://10.210.232.237/internal-api/gateway/screen-api/generic-query-agg",
    params: {
      response_type: "list",
      table: "jingan_code_case",
      query_name: "report_time,report_time,street",
      query_value: `${params.startVal},${params.endVal},${params.street}`,
      query_operation: "gte,lte,eq",
      query_match_type: "and",
      field_or_agg: decodeURIComponent(`DATE_FORMAT%28report_time%2C%20%27${params.type == 'hour' ? '%25H' : '%25Y-%25m-%25d'}%27%29%20dat%2C%20COUNT%28%2A%29%20coun%2C%20COUNT%28IF%28STATUS%20IN%20%28%27%E5%B7%B2%E7%BB%93%E6%A1%88%27%2C%27%E5%B7%B2%E5%AE%8C%E7%BB%93%27%29%2C%201%2C%20NULL%29%29%20AS%20close_count`),
      group_by: 'dat'
    }
  });
}

export function getCodeStatics(params) {
  return request({
    url:
      "http://10.210.232.237/internal-api/gateway/screen-api/jam-generic-query-agg",
    params: {
      response_type: "list",
      table: "unit_history",
      token: "pd2e13b16eff42aeaec9bda8c570e2pd",
      query_name: "type1,history_time,history_time",
      query_value: `4,${params.start},${params.end}`,
      query_operation: "eq,gte,lte",
      query_match_type: "and",
      // %25Y-%25m-%25d%20
      field_or_agg:
        params.type == "hour"
          ? decodeURIComponent(
              "FROM_UNIXTIME%28history_time%2C%27%25H%27%29%20dat%2C%20COUNT%28%2A%29%20coun%2C%20COUNT%28IF%28type2%3D%27401%27%2C%201%2C%20NULL%29%29%20AS%20shimin%2C%20COUNT%28IF%28type2%3D%27402%27%2C%201%2C%20NULL%29%29%20AS%20yewu"
            )
          : decodeURIComponent(
              "FROM_UNIXTIME%28history_time%2C%27%25d%27%29%20dat%2C%20COUNT%28%2A%29%20coun%2C%20COUNT%28IF%28type2%3D%27401%27%2C%201%2C%20NULL%29%29%20AS%20shimin%2C%20COUNT%28IF%28type2%3D%27402%27%2C%201%2C%20NULL%29%29%20AS%20yewu"
            ), // `FROM_UNIXTIME(history_time,${params.type == 'hour' ? '%Y-%m-%d %H' : '%Y-%m-%d'}) dat, COUNT(*) coun, COUNT(IF(type2='401', 1, NULL)) AS shimin, COUNT(IF(type2='402', 1, NULL)) AS yewu`,
      group_by: "dat",
    },
  });
}
