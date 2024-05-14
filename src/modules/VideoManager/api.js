import request from "@/http/request";
import videoService from "@/http/requestVideoService";
import videoQs from "@/http/requestVideoQs";
import request3 from "@/http/request3";

// 查询事件周边视频
export function getVideosByArea(data) {
  return request({
    url: "/v2/video/around",
    params: data,
    method: "get",
  });
}
// 获取视频的真实地址
export function getVideoRealUrl(data, cancelTokenKey) {
  return videoService({
    url: "/vms/device-camera-fence/getCameraVideoPathList", // todo
    method: "post",
    data: Array.isArray(data) ? data : [data],
    headers: {
      "Content-Type": "application/json",
      token: "a47e2ecc6a4543138389128787b9b978",
    },
    cancelTokenKey: cancelTokenKey || "getVideoRealUrl",
  });
}

export function getQsVideoRealUrl (params, cancelTokenKey) {
  return videoQs({
    url: '/api/v1/stream/start', // todo
    method: 'get',
    params: params,
    // data: Array.isArray(data) ? data : [data],
    // headers: {
    //   'Content-Type': 'application/json',
    //   token: 'a47e2ecc6a4543138389128787b9b978'
    // },
    cancelTokenKey: cancelTokenKey || 'getVideoRealUrl'
  })
}

// 视频关闭后发送消息
// export function sendAfterCloseVideo(data) {
//   return videoService({
//     url: "/zhcs-vms/api/home/stopstream", // todo
//     method: "post",
//     data: {
//       cameras: Array.isArray(data) ? data : [data],
//     },
//     headers: {
//       "Content-Type": "application/json",
//       token: "a47e2ecc6a4543138389128787b9b978",
//     },
//   });
// }

export function sendAfterCloseVideo (data) {
  return videoQs({
    url: '/api/v1/stream/stop', // todo
    method: 'get',
    params: {
      serial: '31010601012000000002',
      code:  data && data[0] && data[0].code
    }
    // data: {
    //   cameras: Array.isArray(data) ? data : [data]
    // },
    // headers: {
    //   'Content-Type': 'application/json',
    //   token: 'a47e2ecc6a4543138389128787b9b978'
    // }
  })
}

// 获取视频列表
export function getVideoList() {
  return request({
    url: "/v2/video/screen_list",
  });
}

export function getZyVideo() {
  return request3({
    url:
      "http://161.189.83.146:8080/erupt-api/live/qingshi/list?tag=%E5%BC%A0%E5%9B%AD",
  });
}

export function getVideoFilterList({ page, scene_ids }) {
  return request({
    url: "http://10.210.232.237/internal-api/gateway/ja-eye/ja-eye-device",
    params: {
      table: "eye_device",
      query_name: "is_delete,district_code",
      query_value: "0,06",
      query_operation: "eq,eq",
      query_match_type: "and",
      offset: (page - 1) * 3000,
      limit: 3000,
      scene_ids: scene_ids
    },
  });
}
// 获取视频的真实地址
export function getZyVideoRealUrl(params, cancelTokenKey) {
  return request3({
    url:
      "http://10.89.14.238:38100/mvp-video-stream-service/api/video/v1/stream/live/open", // todo
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json",
      "accessToken": "94bc9056-c740-4d0e-80ad-c168afff2c45",
    },
    cancelTokenKey: cancelTokenKey || "getZyVideoRealUrl",
  });
}
// 获取张园视频列表
export function getZyVideoList() {
  return request3({
    url:
      "http://10.89.14.238:38100/mvp-device-service/v1/device/page-query-user",
    headers: {
      "Content-Type": "application/json",
      "accessToken": "94bc9056-c740-4d0e-80ad-c168afff2c45",
    },
    params: {
      pageSize: 50,
      pageNum: 1
    }
  });
}

// 关闭视频的真实地址
export function sendAfterCloseZyVideo(data) {
  return request3({
    url:
      "http://10.89.14.238:38100/mvp-video-stream-service/api/video/v1/stream/live/close", // todo
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/json",
      "accessToken": "94bc9056-c740-4d0e-80ad-c168afff2c45",
    },
  });
}
