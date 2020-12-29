import request from "@/http/request";
import videoService from "@/http/requestVideoService";

// 查询事件周边视频
export function getVideosByArea(data) {
  return request({
    url: "/v2/video/around",
    params: data,
    method: "get"
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
      "token": "110be99eb5b840d086d6bec05aaf63bf"
    },
    cancelTokenKey: cancelTokenKey || "getVideoRealUrl"
  });
}

// 视频关闭后发送消息
export function sendAfterCloseVideo(data) {
  return videoService({
    url: "/zhcs-vms/api/home/stopstream", // todo
    method: "post",
    data: {
      cameras: Array.isArray(data) ? data : [data]
    },
    headers: {
      "Content-Type": "application/json",
      "token": "110be99eb5b840d086d6bec05aaf63bf"
    }
  });
}

// 获取视频列表
export function getVideoList() {
  return request({
    url: "/v2/video/screen_list"
  });
}
