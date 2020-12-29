import { getVideoRealUrl, sendAfterCloseVideo } from "./api";
import { generateKeyValuePair } from "@/utils/tools";
let id = 1;

// hoc 对需要翻译的地址进行翻译，并在关闭的时候发消息给公安
/**
 *
 * @param {*} component 组件
 * @param {*} prop 传入组件接受值的prop
 */
export function transferAndSendForVideo(component, prop = "videoSrc") {
  return {
    data() {
      return {
        id: id++,
        result: null
      };
    },
    inheritAttrs: false,
    inject: ["getGlobalConfig"],
    props: {
      videoConfig: {
        type: [Object, Array],
        default: null
      },
      cancelTokenKey: {
        type: String,
        default: "getVideoRealUrl-HOC"
      }
    },
    render(h) {
      return h(component, {
        props: {
          [prop]: this.result,
          ...this.$attrs
        },
        on: this.$listeners,
        scopedSlots: this.$scopedSlots
      });
    },
    watch: {
      videoConfig: {
        handler(nv, ov) {
          this.handleVideoForTransferAndSendData(nv, ov);
        },
        immediate: true
      }
    },
    methods: {
      handleVideoForTransferAndSendData(nv) {
        let ov = this.result;
        console.log("handleVideoForTransferAndSendData", nv, ov);
        const isObjectFornv = Object.prototype.toString.call(nv) === "[object Object]";
        const isObjectForov = Object.prototype.toString.call(ov) === "[object Object]";
        let repeat = [];
        let norepeat = [];
        nv = isObjectFornv ? [nv] : nv;

        if (ov) {
          ov = (isObjectForov ? [ov] : ov).filter(d => !!d.url);
          ov.forEach(d => {
            if (nv.some(n => n.id === d.id)) {
              repeat.push(d);
            } else {
              norepeat.push(d);
            }
          });
          if (norepeat.length > 0) {
            sendAfterCloseVideo(norepeat.map(d => {
              return {
                cameraId: d.code,
                districtCode: d.district,
                streetCode: d.town
              };
            }))
            // .then(res => { console.log("callback", res); })
            .catch(error => { console.log("api: sendAfterCloseVideo, status: error.", error); });
          }
        }

        if (nv && nv.length) {
          const repeatMapping = generateKeyValuePair("code", "url", repeat);
          let initData = nv.map(d => {
            return {
              ...d,
              id: d.id,
              type: d.type,
              code: d.code,
              url: repeatMapping[d.code] || ""
            };
          });
          this.result = isObjectFornv ? initData[0] : initData;
          const nvParams = nv.filter(d => !!d).map(d => {
            return {
              cameraId: d.code,
              districtCode: d.district,
              streetCode: d.town || d.district,
              streamType: d.type
            };
          });

          getVideoRealUrl(nvParams, this.cancelTokenKey).then(res => {
            if (res.resultCode === "200") {
              // console.log("请求成功", res.resultData);
              const apiDataMapping = generateKeyValuePair("cameraId", "videoPath", res.resultData.data.cameraInfos || []);
              const resultData = initData.map(d => {
                return {
                  ...d,
                  url: apiDataMapping[d.code] || d.url
                };
              });
              this.result = isObjectFornv ? resultData[0] : resultData;
              console.log("reuslt", this.result);
            }
          }).catch(err => {
            console.log("转义失败", err);
          });
        }
      }
    },
    beforeDestroy() {
      const result = (Object.prototype.toString.call(this.result) === "[object Object]" ? [this.result] : this.result).filter(d => !!d.url);
      if (result && result.length > 0) {
        sendAfterCloseVideo(result.map(d => {
          return {
            cameraId: d.code,
            districtCode: d.district,
            streetCode: d.town || d.district
          };
        }))
        // .then(res => { console.log("callback", res); })
        .catch(error => { console.log("api: sendAfterCloseVideo, status: error.", error); });
      }
    }
  };
}
