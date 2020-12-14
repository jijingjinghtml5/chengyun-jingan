import request from "@/http/request";

// 人员统计
export function getPeopleStatistic(type) {
  return request({
    url: "/v2/data-api/423",
    params: {
      filter: `simple.messageType=population%26status=eq.1&args.population_syrklbhz=eq.${type}`
    }
  });
}

// 案件分街镇统计
export function getCaseTownCount (district, type) {
  const url = "/v2/data-api/406";
  return request({
    url,
    params: {
      district: district,
      filter: `openTS=-604800&eventDiscoverType=eq.${type}`
    }
  });
}

// 获取神经元数据分类添加点位图层
export function getNeuronData() {
  return request({
    url: "/v2/data-api/397",
    params: {
      filter: "isSensor=eq.true&isVirtual=eq.false&exists=eq.true"
    }
  });
}
