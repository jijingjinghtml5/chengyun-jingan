import request from "@/http/request";
import requestApi from "@/http/requestApi.js"

export function getLowCodeData (table) {
  return requestApi({
    params: {
     table
    }
  })
}


export function getData() {
  return request({
    url: "/v2/data-api/429"
  });
}

export function getCurrYdRoad() {
  return request({
    url: "http://10.210.232.238/erupt-api/traffic/currYdRoad"
  });
}

export function getMetroFlow() {
  return request({
    url: "http://10.210.232.238/erupt-api/traffic/metroFlow?name=&day=1&lastOne=1"
  });
}

export function getHotlineData(params) {
  return request({
    url: 'http://10.210.232.237/internal-api/gateway/hotline-alarm/hotline-alarm-stats'
    // url: 'http://10.210.232.237/internal-api/gateway/screen-api/generic-query',
    // params: {
    //   table: 'fxft'
    // }
  })
}
