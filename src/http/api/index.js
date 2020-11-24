import request from "@/http/request";
import videoService from "@/http/requestVideoService";
// 获取配置
export function getLayoutConfig(token, _params) {
  let params = {
    keys: ["screenConfig", "streets", "layoutConfig", "videoConfig"]
  };
  if (token) {
    params.token = token;
  }
  params = { ...params, ..._params };
  return request({
    url: "/v2/screen-manage/config",
    params
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
    }
  });
}

// 查询事件周边视频
export function getVideosByArea(data) {
  return request({
    url: "/v2/screen-manage/videos",
    params: data,
    method: "get"
  });
}
/**
 * 登陆
 * @param {*} data
 */
export function login(data) {
  return request({
    url: "/v2/screen/login",
    data: data,
    method: "post"
  });
}
/**
 * 扫码验证
 * @param {*} data
 */
export function scanCheck(data) {
  return request({
    url: "/v2/screen/login-check",
    data: data,
    method: "post"
  });
}

/* 客户端ip校验 */
export function ipCheck() {
  return request({
    url: "/v2/screen/ip-check",
    method: "get"
  });
}
