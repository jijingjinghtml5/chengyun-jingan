import request from "@/http/request";
import { obj2Param } from "@/utils/index";

const prefixUrl = "";

export function getCommonApi(url, params) {
  if (params && obj2Param(params).join("&")) {
    url = [url, obj2Param(params).join("&")].join("?");
  }

  console.log("fire:", url);

  return request({
    url: prefixUrl + url,
    method: "get"
  });
}

export function postCommonApi(url, data) {
  return request({
    url: prefixUrl + url,
    method: "post",
    data
  });
}

export function putCommonApi(url, data, id) {
  return request({
    url: [prefixUrl + url, id].join("/"),
    method: "PUT",
    data
  });
}

export function deleteCommonApi(url, id) {
  return request({
    url: [prefixUrl + url, id].join("/"),
    method: "DELETE"
  });
}
