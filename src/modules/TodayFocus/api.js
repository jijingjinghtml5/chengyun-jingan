import request from "@/http/request";

export function getData() {
  return request({
    url: "/v2/data-api/424"
  });
}

export function getListData(filter) {
  return request({
    url: "/v2/data-api/427",
    params: {
      filter: filter
    }
  });
}
