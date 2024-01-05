import request from "@/http/request";
import videoService from "@/http/requestVideoService";
import request3 from "@/http/request3";

// 查询事件周边视频
export function getVideosByArea(data) {
  return request({
    url: "/v2/video/around",
    params: data,
    method: "get",
  });
}
// 获取视频的真实地址
export function getVideoRealUrl(data, cancelTokenKey) {
  return videoService({
    url: "/vms/device-camera-fence/getCameraVideoPathList", // todo
    method: "post",
    data: Array.isArray(data) ? data : [data],
    headers: {
      "Content-Type": "application/json",
      token: "a47e2ecc6a4543138389128787b9b978",
    },
    cancelTokenKey: cancelTokenKey || "getVideoRealUrl",
  });
}

// 视频关闭后发送消息
export function sendAfterCloseVideo(data) {
  return videoService({
    url: "/zhcs-vms/api/home/stopstream", // todo
    method: "post",
    data: {
      cameras: Array.isArray(data) ? data : [data],
    },
    headers: {
      "Content-Type": "application/json",
      token: "a47e2ecc6a4543138389128787b9b978",
    },
  });
}

// 获取视频列表
export function getVideoList() {
  return request({
    url: "/v2/video/screen_list",
  });
}

export function getZyVideo() {
  return request3({
    url:
      "http://161.189.83.146:8080/erupt-api/live/qingshi/list?tag=%E5%BC%A0%E5%9B%AD",
  });
}

// 获取视频的真实地址
export function getZyVideoRealUrl(params, cancelTokenKey) {
  return request3({
    url:
      "http://10.89.14.238:38100/mvp-video-stream-service/api/video/v1/stream/live/open", // todo
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json",
      "accessToken": "94bc9056-c740-4d0e-80ad-c168afff2c45",
    },
    cancelTokenKey: cancelTokenKey || "getZyVideoRealUrl",
  });
}
// 获取张园视频列表
export function getZyVideoList() {
  return request3({
    url:
      "http://10.89.14.238:38100/mvp-device-service/v1/device/page-query-user",
    headers: {
      "Content-Type": "application/json",
      "accessToken": "94bc9056-c740-4d0e-80ad-c168afff2c45",
    },
    params: {
      pageSize: 50,
      pageNum: 1
    }
  });
}

// 关闭视频的真实地址
export function sendAfterCloseZyVideo(data) {
  return request3({
    url:
      "http://10.89.14.238:38100/mvp-video-stream-service/api/video/v1/stream/live/close", // todo
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/json",
      "accessToken": "94bc9056-c740-4d0e-80ad-c168afff2c45",
    },
  });
}