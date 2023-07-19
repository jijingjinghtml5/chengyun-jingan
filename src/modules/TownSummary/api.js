import request from "@/http/request";

/**
 * 概况
 */
export function getSumaryData() {
  return request({
    url: "/v2/data-api/421"
  });
}

export function getSumaryData2 (params) {
  return request({
    url: 'http://10.210.232.238/dmp2/district-platform-api/v7/town-status',
    params: {
      district: '静安区',
      token: 'dp3e13b16eff2aeaec9bda8cc70e3dp',
      ...params
    }
  })
}

/**
 * 运行动态
 */
export function getChartData(type) {
  return request({
    url: "/v2/data-api/422",
    params: {
      data_type: type
    }
  });
}

export function getChartData2 (params) {
  return request({
    url: 'http://10.210.232.238/dmp2/district-platform-api/v7/run-dynamic-status',
    params: {
      district: '静安区',
      token: 'dp3e13b16eff2aeaec9bda8cc70e3dp',
      ...params
    }
  })
}