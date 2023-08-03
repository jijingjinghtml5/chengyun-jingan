import request from "@/http/request";

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
