import request from "@/http/request";

export function getData() {
  return request({
    url: "/v2/data-api/432"
  });
}
/**
 * 社会管理数据
 */
export function getItemData() {
  return request({
    url: "/v2/data-api/443"
  });
}
