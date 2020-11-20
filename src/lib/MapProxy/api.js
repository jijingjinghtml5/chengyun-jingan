
import request from "@/http/request";

// 周边人员
export function getAroundPeople(distance) {
  let url = "/v2/data-api/196";
  return request({
    url,
    params: {
      filter: "channel=eq.paidan&simple.messageType=eq.StuffGeolocating&distance=" + distance
    }
  });
}