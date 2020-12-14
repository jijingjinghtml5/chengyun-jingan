import request from "@/http/request";

// 人员统计
export function getUrls() {
  return request({
    url: "/v2/data-api/428"
  });
}
