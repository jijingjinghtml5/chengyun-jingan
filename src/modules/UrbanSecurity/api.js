import request from "@/http/request";

export function getData() {
  return request({
    url: "/v2/data-api/430"
  });
}
