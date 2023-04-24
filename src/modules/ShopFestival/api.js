import requestApi from "@/http/requestApi.js"
import request from "@/http/request.js";
import requestJa from "@/http/requestJa.js";
import videoService from "@/http/requestVideoService.js";

export function getVideoRealUrl(data, cancelTokenKey) {
  return videoService({
    url: "/vms/device-camera-fence/getCameraVideoPathList", // todo
    method: "post",
    data: Array.isArray(data) ? data : [data],
    headers: {
      "Content-Type": "application/json",
      "token": "a47e2ecc6a4543138389128787b9b978"
    },
    cancelTokenKey: cancelTokenKey || "getVideoRealUrl"
  });
}

export function getRoadInfo() {
  return requestJa({
    url: "/erupt-api/traffic/five/aroundRoadInfo",
  });
}

export function getPark(params) {
  return requestJa({
    url: "/erupt-api/traffic/five/park",
    params
  });
}

export function getCase(params) {
  return request({
    url: "/v2/data-api/858",
    params
  });
}

export function getCount (params) {
  return requestApi({
    params
  })
}
