import request from "@/http/request";

export function getCaseDetail(id) {
  return request({
    url: "/v2/data-api/146",
    params: {
      uuid: id
    }
  });
}
export function getCaseDetail194(id) {
  return request({
    url: "/v2/data-api/194",
    params: {
      uuid: id
    }
  });
}
