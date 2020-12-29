import request from "@/http/request";
import videoService from "@/http/requestVideoService";

// 查询事件周边视频
export function getVideosByArea(data) {
  return request({
    url: "/v2/screen-manage/videos",
    params: data,
    method: "get"
  });
}
// 获取视频的真实地址
export function getVideoRealUrl(data) {
  return videoService({
    url: "/getVideoUrlByParams", // todo
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/json"
    },
    cancelTokenKey: "helloWorld"
  });
}
