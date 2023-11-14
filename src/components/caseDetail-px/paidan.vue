<template>
  <div class="content paidan">
    <div class="title">
      <div class="title-icon">
        <img :src="this.statusIcon" alt="">
      </div>
      <div class="title-content">
        <p class="subTitle text-hidden">{{ eventType2 }}</p>
        <el-tooltip class="item" effect="dark" :content="name" placement="bottom" popper-class="caseDetail-popper">
          <p class="text-hidden">{{ name }}</p>
        </el-tooltip>
        <!-- <p class="text-hidden" :title="name">{{ name }}</p> -->
      </div>
    </div>
    <template v-if="detail">
      <div class="info">
        <p>
          <span class="info-label">案件类型：</span>
          <span class="info-text">{{ detail.eventType3 || detail.eventInfo.eventType3 }}</span>
        </p>
        <p>
          <span class="info-label">所属街道：</span>
          <span class="info-text">{{ detail.eventInfo.streetName | streetName }}</span>
        </p>
        <p>
          <span class="info-label">案件位置：</span>
          <span class="info-text">{{ detail.address || detail.eventInfo.address}}</span>
        </p>
        <p>
          <span class="info-label">发现时间：</span>
          <span class="info-text">{{ (detail.eventTime || detail.eventInfo.eventTime || 0)*1000 | formatterDate('yyyy-MM-dd hh:mm:ss') }}</span>
        </p>
        <p>
          <span class="info-label">处置状态：</span>
          <span class="info-text" style="color: #FCBF51;font-weight: 700">{{ showText }}</span>
        </p>
        <p>
          <span class="info-label">案件描述：</span>
          <span class="info-text">{{ detail.description || detail.eventInfo.description }}</span>
        </p>
      </div>
      <div class="process">
        <h4>案件处置</h4>
        <div class="detailOrder switch"  @click="changeOrderBy">
          <span class="switch-label" :class="{ 'is-active': orderby === 'asc' }">正序</span>
          <span class="switch-control" :class="{ 'close': orderby === 'asc', 'open': orderby === 'desc' }"></span>
          <span class="switch-label" :class="{ 'is-active': orderby === 'desc' }">倒序</span>
        </div>
        <scroll-bar height="1300px">
          <div class="steps">
            <template v-for="item in detailTimeAxis">
              <div class="step" :key="item.title" v-if="item.status !== '31' && item.status !== '32'">
                <h5>{{ item.title }}</h5>
                <p>{{ item.createdAt }}</p>
                <p class="step-row">
                  <span class="step-label">处置人员：</span>
                  <span class="step-text">{{ item.userName }}</span>
                </p>
                <p class="step-row">
                  <span class="step-label">案件备注：</span>
                  <span class="step-text">{{ item.desc }}</span>
                </p>
                <div class="step-resource" v-if="item.images">
                  <template v-if="Object.prototype.toString.call(item.images) === '[object Array]' && item.images.length">
                    <p>案件图片：</p>
                    <div class="imgs">
                      <template v-for="(img , imgi) in item.images">
                        <img v-if="img" :key="imgi" :src="prefixUrl + img" alt="" @click="open('img', prefixUrl + img)">
                      </template>
                    </div>
                  </template>
                  <template v-else-if="Object.prototype.toString.call(item.images) === '[object Object]'">
                    <p>处理前图片：</p>
                    <div class="imgs" v-if="item.images.scenes && Object.prototype.toString.call(item.images.scenes) === '[object Array]'">
                      <template v-for="(img , imgi) in item.images.scenes">
                        <img v-if="img" :key="imgi" :src="prefixUrl + img" alt="" @click="open('img', prefixUrl + img)">
                      </template>
                    </div>
                    <div class="imgs" v-else-if="item.images.scenes && Object.prototype.toString.call(item.images.scenes) === '[object String]'">
                      <template v-for="(img , imgi) in item.images.scenes.split(',')">
                        <img v-if="img" :key="imgi" :src="prefixUrl + img" alt="" @click="open('img', prefixUrl + img)">
                      </template>
                    </div>
                    <p>处理后图片：</p>
                    <div class="imgs" v-if="item.images.results && Object.prototype.toString.call(item.images.results) === '[object Array]'">
                      <template v-for="(img , imgi) in item.images.results">
                        <img v-if="img" :key="imgi" :src="prefixUrl + img" alt="" @click="open('img', prefixUrl + img)">
                      </template>
                    </div>
                    <div class="imgs" v-else-if="item.images.results && Object.prototype.toString.call(item.images.scenes) === '[object String]'">
                      <template v-for="(img , imgi) in item.images.results.split(',')">
                        <img v-if="img" :key="imgi" :src="prefixUrl + img" alt="" @click="open('img', prefixUrl + img)">
                      </template>
                    </div>
                  </template>
                  <template v-else></template>
                </div>
                <!-- <div class="step-resource" v-if="item.audios.length">
                  <p>案件音频：</p>
                  <div class="audios">
                    <audio controls v-for="(audio , audioi) in item.audios" :key="audioi" :src="prefixUrl + audio"></audio>
                  </div>
                </div> -->
                <div class="step-resource" v-if="item.videos">
                  <template v-if="typeof(item.videos) === 'object' && item.videos.length">
                    <p>案件视频：</p>
                    <div class="videos">
                      <template v-for="(v , vi) in item.videos">
                        <div class="video-item" v-if="v" :key="vi" @click="open('video', prefixUrl + v)">
                          <video :src="prefixUrl + v"></video>
                          <div class="video-item__cover">
                          </div>
                        </div>
                      </template>
                    </div>
                  </template>
                  <template v-if="typeof(item.videos) === 'string' && item.videos">
                    <p>案件视频：</p>
                    <div class="videos">
                      <template v-for="(v , vi) in item.videos.split(',')">
                        <div class="video-item" v-if="v" :key="vi" @click="open('video', prefixUrl + v)">
                          <video :src="prefixUrl + v"></video>
                          <div class="video-item__cover">
                          </div>
                        </div>
                      </template>
                    </div>
                  </template>
                  <template v-else></template>
                </div>
              </div>
            </template>
            <!-- <div class="step" v-for="(item, index) in detail.timeAxis" :key="index">
              <h5>{{ item.title }}</h5>
              <p>{{ item.createdAt }}</p>
              <p class="step-row">
                <span class="step-label">处置人员：</span>
                <span class="step-text text-hidden">{{ item.userName }}</span>
              </p>
              <p class="step-row">
                <span class="step-label">案件备注：</span>
                <span class="step-text text-hidden">{{ item.desc }}</span>
              </p>
              <div class="step-resource" v-if="item.images">
                <template v-if="Object.prototype.toString.call(item.images) === '[object Array]' && item.images.length">
                  <p>案件图片：</p>
                  <div class="imgs">
                    <template v-for="(img , imgi) in item.images">
                      <img v-if="img" :key="imgi" :src="prefixUrl + img" alt="" @click="open('img', prefixUrl + img)">
                    </template>
                  </div>
                </template>
                <template v-else-if="Object.prototype.toString.call(item.images) === '[object Object]'">
                  <p>处理前图片：</p>
                  <div class="imgs" v-if="item.images.scenes && Object.prototype.toString.call(item.images.scenes) === '[object Array]'">
                    <template v-for="(img , imgi) in item.images.scenes">
                      <img v-if="img" :key="imgi" :src="prefixUrl + img" alt="" @click="open('img', prefixUrl + img)">
                    </template>
                  </div>
                  <div class="imgs" v-else-if="item.images.scenes && Object.prototype.toString.call(item.images.scenes) === '[object String]'">
                    <template v-for="(img , imgi) in item.images.scenes.split(',')">
                      <img v-if="img" :key="imgi" :src="prefixUrl + img" alt="" @click="open('img', prefixUrl + img)">
                    </template>
                  </div>
                  <p>处理后图片：</p>
                    <div class="imgs" v-if="item.images.results && Object.prototype.toString.call(item.images.results) === '[object Array]'">
                      <template v-for="(img , imgi) in item.images.results">
                      <img v-if="img" :key="imgi" :src="prefixUrl + img" alt="" @click="open('img', prefixUrl + img)">
                    </template>
                  </div>
                  <div class="imgs" v-else-if="item.images.results && Object.prototype.toString.call(item.images.scenes) === '[object String]'">
                    <template v-for="(img , imgi) in item.images.results.split(',')">
                      <img v-if="img" :key="imgi" :src="prefixUrl + img" alt="" @click="open('img', prefixUrl + img)">
                    </template>
                  </div>
                </template>
                <template v-else></template>
              </div>
              <div class="step-resource" v-if="item.videos">
                <template v-if="typeof(item.videos) === 'object' && item.videos.length">
                  <p>案件视频：</p>
                  <div class="videos">
                    <template v-for="(v , vi) in item.videos">
                      <div class="video-item" v-if="v" :key="vi" @click="open('video', prefixUrl + v)">
                        <video :src="prefixUrl + v"></video>
                        <div class="video-item__cover">
                        </div>
                      </div>
                    </template>
                  </div>
                </template>
                <template v-if="typeof(item.videos) === 'string' && item.videos">
                  <p>案件视频：</p>
                  <div class="videos">
                    <template v-for="(v , vi) in item.videos.split(',')">
                      <div class="video-item" v-if="v" :key="vi" @click="open('video', prefixUrl + v)">
                        <video :src="prefixUrl + v"></video>
                        <div class="video-item__cover">
                        </div>
                      </div>
                    </template>
                  </div>
                </template>
                <template v-else></template>
              </div>
            </div> -->
          </div>
        </scroll-bar>
      </div>
    </template>
  </div>
</template>
<script>
import ScrollBar from "@/components/ScrollBar-px";
import { formatterDate } from "@/utils/";
import config from '@/config/index'
export default {
  name: "Content",
  data() {
    return {
      prefixUrl: config.caseResourceUrl,
      orderby: "desc"
    };
  },
  props: {
    res: {
      type: Object,
      default: null
    },
    defaultInfo: {
      type: Object,
      default: null
    }
  },
  components: {
    ScrollBar
  },
  filters: {
    formatterDate,
    streetName(val) {
      return !val || val === "0" ? "" : val;
    }
  },
  computed: {
    statusIcon() {
      let status = (this.detail && this.detail._textStatus) || "";
      let img = "";
      switch (status) {
        case "发现":
          img = require("./imgs/0.png");
          break;
        case "立案":
          img = require("./imgs/1.png");
          break;
        case "派遣":
          img = require("./imgs/2.png");
          break;
        case "处置":
          img = require("./imgs/3.png");
          break;
        case "核查":
          img = require("./imgs/4.png");
          break;
        case "结案":
          img = require("./imgs/5.png");
          break;
      }
      return img;
    },
    eventType2() {
      return (this.detail && this.detail.eventInfo && this.detail.eventInfo.eventType2) || "";
    },
    name() {
      return (this.defaultInfo && this.defaultInfo.name) || "";
    },
    detail() {
      let data = this.res;
      if (data) {
        return Object.assign({}, data, {
          timeAxis: data.timeAxis || [],
          _textStatus: this.getStatus(data.status || data.eventInfo.status)
        });
      } else {
        return null;
      }
    },
    showText() {
      let key = (this.detail && this.detail.step_status) || "";
      // console.log("key", key);
      let eventStatus = "";
      switch (key) {
        case "1":
          eventStatus = "已接单";
          break;
        case "2":
        case "31":
          eventStatus = "已派单";
          break;
        case "3":
          eventStatus = "已改派";
          break;
        case "4":
          eventStatus = "处置完成";
          break;
        case "5":
          eventStatus = "申请改派";
          break;
        case "6":
          eventStatus = "误报";
          break;
        case "10":
          eventStatus = "已结案";
          break;
        case "11":
          eventStatus = "已指定审核人";
          break;
        case "12":
          eventStatus = "审核通过";
          break;
        case "13":
          eventStatus = "审核驳回";
          break;
        case "14":
        case "15":
          eventStatus = "已退单";
          break;
        case "21":
          eventStatus = "已上报";
          break;
        case "22":
          eventStatus = "已受理";
          break;
        case "23":
          eventStatus = "已立案";
          break;
        case "24":
          eventStatus = "不立案";
          break;
        case "25":
          eventStatus = "申请退单";
          break;
        case "26":
          eventStatus = "通过退单请求";
          break;
        case "27":
          eventStatus = "驳回退单请求";
          break;
        case "28":
          eventStatus = "申请延期";
          break;
        case "29":
          eventStatus = "通过延期请求";
          break;
        case "30":
          eventStatus = "驳回延期请求";
          break;
        case "32":
          eventStatus = "待接单";
          break;
        case "33":
          eventStatus = "待核实";
          break;
        case "34":
          eventStatus = "核实通过";
          break;
        case "35":
          eventStatus = "核实不通过";
          break;
        case "36":
          eventStatus = "作废";
          break;
      }
      return eventStatus;
    },
    detailTimeAxis() {
      let timeAxis = ((this.detail && this.detail.timeAxis) || []).slice(0);
      return this.orderby === "asc" ? timeAxis.reverse() : timeAxis;
    }
  },
  methods: {
    getStatus(key) {
      let state = "";
      switch (key) {
        case "1":
        case "13":
          state = "派遣";
          break;
        case "2":
        case "4":
          state = "处置";
          break;
        case "10":
        case "11":
        case "12":
          state = "核查";
          break;
        case "14":
          state = "结案";
          break;
        case "18":
        case "19":
        case "20":
          state = "发现";
          break;
      }
      return state;
    },
    changeOrderBy() {
      this.orderby = this.orderby === "asc" ? "desc" : "asc";
    },
    open(type, url) {
      this.$emit("open", type, url);
    }
  }
};
</script>
<style lang="scss" scoped>
.text-hidden {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
.content {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 0.2*100px;
  box-sizing: border-box;
  // margin: 0 auto;
}

.title {
  position: relative;
  display: flex;
  // justify-content: center;
  align-items: center;
}

.title-icon {
  position: relative;
  height: 0.96*100px;
  margin: 0 0.1*100px;

  img {
    height: 100%;
  }
}

.title-content {
  flex: 1;
  font-size: 0.52*100px;
  line-height: 0.6*100px;
  color: #fff;
  overflow: hidden;

  .subTitle {
    font-size: 0.44*100px;
    color:#92B9F7
  }

  p {
    height: 0.6*100px;
  }
}

.info {
  padding: 0.2*100px 0;
  border-bottom: 0.02*100px dashed #4E78A4;

  p {
    font-size: 0;
    display: flex;
  }

  span {
    font-size: 0.32*100px;
    line-height: 0.48*100px;
    color: #fff;
  }

  &.info-label {
    color: #92B9F7;
  }

  .info-text {
    flex: 1;
  }
}

.process {
  position: relative;
  padding: 0.1*100px 0;
  flex: 1;
  overflow: hidden;
  h4 {
    font-size: 36px;
    line-height: 60px;
    font-weight: 700;
    color: #92B9F7;
  }
  .detailOrder{
    position: absolute;
    top: 20px;
    right: 5px;
    font-size: 0.32*100px;
    line-height: 0.48*100px;
    color: #fff;
    z-index: 2;
    cursor: pointer;
  }
}

.process-title {
  font-size: 0.32*100px;
  line-height: 0.48*100px;
  color: #92B9F7;
  margin-bottom: 0.2*100px;
}

.steps {
  padding-left: 0.6*100px;
  box-sizing: border-box;
  font-size: 0.32*100px;
  line-height: 0.48*100px;
  color: #fff;

  .step {
    position: relative;
    min-height: 0.6*100px;
    padding-bottom: 0.2*100px;

    h5 {
      font-size: 0.36*100px;
      line-height: 0.48*100px;
      margin-bottom: 0.1*100px;
    }

    &:last-of-type {
      &:after {
        display: none;
      }
    }

    &:before {
      content: "";
      position: absolute;
      top: 0;
      left: -0.6*100px;
      width: 0.48*100px;
      height: 0.48*100px;
      border-radius: 50%;
      background-color:#26ffff;
      z-index: 2;
    }

    &:after {
      content: "";
      position: absolute;
      top: 0;
      left: -0.36*100px;
      width: 0.02*100px;
      height: 100%;
      background-color:#92B9F7;
      z-index: 1;
    }
  }

  .step-row {
    display: flex;
  }

  .step-text {
    flex: 1;
  }

  .step-resource {
    .imgs, .videos {
      overflow:hidden;

      &:after {
        content: "";
        display: block;
        visibility: hidden;
        height: 0;
        clear: both;
      }
    }

    img {
      float: left;
      display: block;
      height: 1.2*100px;
      margin-right: 0.1*100px;
      margin-bottom: 0.1*100px;
      cursor: zoom-in;
    }

    audio {
      display: block;
      width: 95%;
      margin-bottom: 0.1*100px;
    }

    video {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .video-item {
      float: left;
      position: relative;
      display: block;
      width: 1.6*100px;
      height: 1.2*100px;
      margin-right: 0.1*100px;
      margin-bottom: 0.1*100px;
      overflow:hidden;

      &:hover {
        .video-item__cover {
          opacity: 1;
        }
      }
    }

    .video-item__cover {
      position: absolute;
      z-index: 10;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      background-color: rgba(0, 0, 0, 0.5);
      opacity: 0;
      cursor: pointer;

      &:after {
        content:"";
        position: absolute;
        top: 50%;
        left: 60%;
        transform: translate(-50%, -50%);
        border: 0.2*100px solid transparent;
        border-left: 0.3*100px solid #fff;
      }
    }
  }
}
.switch {
  > span {
    display: inline-block;
    vertical-align: middle;
  }
  .switch-label {
    font-size: 28px;
    line-height: 36px;
    color:#989898;
    &.is-active {
      color: #92B9F7;
    }
  }
  .switch-control {
    position: relative;
    width: 80px;
    height: 36px;
    border: 2px solid #2573ef;
    background-color: rgba(#2573ef, 0.4);
    margin: 0px 10px;
    border-radius: 16px;
    cursor: pointer;
    &:after {
      content: "";
      position: absolute;
      display: block;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: #4e78a4;
      border: 2px solid #3b81f0;
      left: 2px;
      top: 2px;
      transition: all 0.3s;
    }
    &.open {
      &:after {
        left: 100%;
        margin-left: -30px;
      }
    }
    &.close {
      &:after {
        left: 2px;
      }
    }
  }
}
</style>
<style lang="scss">
.caseDetail-popper {
  min-width: 475px !important;
  font-size: 28px !important;
}
</style>
