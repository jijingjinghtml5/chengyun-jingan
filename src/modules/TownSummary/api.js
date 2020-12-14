import request from "@/http/request";

export function getSumaryData() {
  return request({
    url: "/v2/data-api/421"
  });
}
