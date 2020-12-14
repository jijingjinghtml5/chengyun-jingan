import request from "@/http/request";

/**
 * 概况
 */
export function getSumaryData() {
  return request({
    url: "/v2/data-api/421"
  });
}

/**
 * 运行动态
 */
export function getChartData(type) {
  return request({
    url: "/v2/data-api/422",
    params: {
      data_type: type
    }
  });
}
