import request from "@/http/request";

// 接入天气数据

export function getWeatherData() {
  let url = "/v2/data-api/102";

  return request({
    url: url
  });
}
