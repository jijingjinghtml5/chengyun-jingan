import request from "@/http/request";

export function getTrajectoryDataBy145(id, time, need_polygon = "") {
  let timeMapping = {
    1: -3600,
    2: "today"
  };
  return request({
    url: "/v2/data-api/145",
    params: {
      filter: `primeID.primeID=${id}&time=${timeMapping[time] || ""}`,
      need_polygon: need_polygon
    }
  });
}

/** ** 综治 ------ */
// 重点人员-卡片
export function getFocusPersonData(id) {
  // simple.messageType=population&mark=eq.1&simple.primeID=eq.population.342422198802033645
  let params = {
    filter: `simple.messageType=population&mark=eq.1&simple.primeID=eq.${id}`
  };
  return request({
    url: "/v2/data-api/221",
    params
  });
};
// 重点场所-卡片
export function getFocusAreaData(id) {
  // simple.messageType=zhongdianqiye&simple.primeID=eq.zhongdianqiye.D069C089D727414388917ABB0B2AAD03
  let params = {
    filter: `simple.messageType=zhongdianqiye&simple.primeID=eq.${id}`
  };
  return request({
    url: "/v2/data-api/222",
    params
  });
};
