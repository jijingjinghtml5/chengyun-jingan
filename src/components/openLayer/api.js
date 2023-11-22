import request3 from "@/http/request3";

export function getLastMapBase() {
  return request3({
    url: "https://api.spacel.net/v1/map/last_map_base"
  });
}