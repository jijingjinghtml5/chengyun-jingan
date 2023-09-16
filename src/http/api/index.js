import request from "@/http/request";
import request3 from "@/http/request3";
import videoService from "@/http/requestVideoService";

// 获取配置
export function getLayoutConfig(token, _params) {
  let params = {};
  if (token) {
    params.token = token;
  }
  params = { ...params, ..._params };
  return request({
    url: window.$config.layoutConfigUrl || "/v2/screen-manage/config",
    params,
  });
}

// 获取视频的真实地址
export function getVideoRealUrl(data) {
  return videoService({
    url: "/getVideoUrlByParams", // todo
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

// 查询事件周边视频
export function getVideosByArea(data) {
  return request({
    url: "/v2/screen-manage/videos",
    params: data,
    method: "get",
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
    method: "post",
  });
}

export function login_new(data) {
  return request3({
    url: "http://10.210.232.237/ja-eye/common/site/login",
    data: data,
    method: "post",
  });
}

export function logout(params) {
  return request3({
    url: "http://10.210.232.237/ja-eye/common/site/logout",
    headers: {
      authorization: params.token  
    }
  });
}

export function check_login(params) {
  return request3({
    url: "http://10.210.232.237/ja-eye/common/site/login-by-token",
    headers: {
      authorization: params.token  
    }
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
    method: "post",
  });
}

/* 客户端ip校验 */
export function ipCheck() {
  return request({
    url: "/v2/screen/ip-check",
    method: "get",
  });
}
