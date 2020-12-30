import request from "@/http/request";
import request3 from "@/http/request3";

// 接入天气数据

export function getWeatherData() {
  let url = "/v2/data-api/102";

  return request({
    url: url
  });
}
/**
 * 空气质量
 */
export function getAQI() {
  return request3({
    url: "http://101.230.224.88:18080/frontend/screenApi.do?token=JingAn@2020"
  });
}
