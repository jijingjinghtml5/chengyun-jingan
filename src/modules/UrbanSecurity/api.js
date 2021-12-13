import request from "@/http/request";
import requestTesla from "@/http/requestTesla";

export function getData() {
  return request({
    url: "/v2/data-api/430"
  });
}
// 应急指挥列表
export function getListData1() {
  return requestTesla({
    url: "http://10.210.232.56:18080/dynamicdata/list/?data_type=静安区-应急系统-组织架构"
  });
}
export function getListData2() {
  return requestTesla({
    url: "http://10.210.232.56:18080/dynamicdata/list/?data_type=静安区-应急系统-组织架构-区管国企"
  });
}
