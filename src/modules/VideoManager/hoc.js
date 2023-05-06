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
        result: null,
        timer: null
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
          // if (this.timer) {
          //   clearInterval(this.timer)
          // } else {
          //   this.timer = setInterval(() => {
          //     console.log('重新请求')
          //     this.handleVideoForTransferAndSendData(nv, ov);
          //   }, 60000);
          // }
          this.handleVideoForTransferAndSendData(nv, ov);
        },
        immediate: true
      }
    },
    methods: {
      handleVideoForTransferAndSendData(nv) {
        let ov = this.result;
        this.result = null;
        const isObjectFornv = Object.prototype.toString.call(nv) === "[object Object]";
        const isObjectForov = Object.prototype.toString.call(ov) === "[object Object]";
        let repeat = [];
        let norepeat = [];
        nv = isObjectFornv ? [nv] : nv;
        ov = isObjectForov ? [ov] : ov;
        if (ov) {
          ov.forEach((d, index) => {
            if (nv && nv[index] && nv[index].code === d.code) {
              repeat.push(d);
            } else {
              norepeat.push(d);
            }
          });
          if (norepeat.length > 0) {
            sendAfterCloseVideo(norepeat.filter(d => !!d.url).map(d => {
              return {
                cameraId: d.code,
                districtCode: d.district,
                streetCode: d.town
              };
            }))
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
          // 添加用户信息
          let userInfo = window.sessionStorage.getItem("_userInfo");
          userInfo = userInfo ? JSON.parse(userInfo) : null;
          const userId = userInfo ? userInfo.id : null;
          const nvParams = nv.filter(d => !d.url).map(d => {
            return {
              cameraId: d.code,
              districtCode: d.district,
              streetCode: d.town || d.district,
              streamType: d.type,
              userId: userId
            };
          });
          getVideoRealUrl(nvParams, this.cancelTokenKey).then(res => {
            if (res.resultCode === "200") {
              const apiDataMapping = generateKeyValuePair("cameraId", null, res.resultData.data.cameraInfos || []);
              const resultData = initData.map(d => {
                const _tmp = apiDataMapping[d.code] || {};
                return {
                  ...d,
                  url: _tmp.videoPath || d.url,
                  errorMessage: _tmp.errorMessage
                };
              });
              this.result = isObjectFornv ? resultData[0] : resultData;
            }
          }).catch(err => {
            console.log("转义失败", err);
          });
        }
      }
    },
    beforeDestroy() {
      // clearInterval(this.timer)
      const result = (Object.prototype.toString.call(this.result) === "[object Object]" ? [this.result] : this.result).filter(d => !!d.url);
      if (result && result.length > 0) {
        sendAfterCloseVideo(result.map(d => {
          return {
            cameraId: d.code,
            districtCode: d.district,
            streetCode: d.town || d.district
          };
        }))
        .catch(error => { console.log("api: sendAfterCloseVideo, status: error.", error); });
      }
    }
  };
}
