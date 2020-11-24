<template>
  <div class="content sangao">
    <div class="title">
      <div class="title-icon">
        <img :src="statusIcon" alt="">
      </div>
      <div class="title-content">
        <p class="subTitle text-hidden">{{ eventType2 }}</p>
        <!-- <p class="text-hidden" :title="name">{{ name }}</p> -->
        <el-tooltip class="item" effect="dark" :content="name" placement="bottom" popper-class="caseDetail-popper">
          <p class="text-hidden">{{ name }}</p>
        </el-tooltip>
      </div>
    </div>
    <template v-if="detail">
      <div class="info">
        <p>
          <span class="info-label">案件类型：</span>
          <span class="info-text">{{ detail.eventType3 }}</span>
        </p>
        <p>
          <span class="info-label">案件位置：</span>
          <span class="info-text">{{ detail.address}}</span>
        </p>
        <p>
          <span class="info-label">发现时间：</span>
          <span class="info-text">{{ (detail.eventTime ? detail.eventTime * 1000 : 0) | formatterDate('yyyy-MM-dd hh:mm:ss') }}</span>
        </p>
        <p>
          <span class="info-label">处置状态：</span>
          <span class="info-text" style="color: #FCBF51;font-weight: 700">{{ detail._textStatus }}</span>
        </p>
        <p>
          <span class="info-label">案件描述：</span>
          <span class="info-text">{{ detail.description }}</span>
        </p>
      </div>
      <div class="process">
        <h4>案件处置</h4>
        <div class="detailOrder switch"  @click="changeOrderBy">
          <span class="switch-label" :class="{ 'is-active': orderby === 'time' }">时间</span>
          <span class="switch-control" :class="{ 'close': orderby === 'time', 'open': orderby === 'process' }"></span>
          <span class="switch-label" :class="{ 'is-active': orderby === 'process' }">流程</span>
        </div>
        <scroll-bar height="calc(100% - 80px)">
          <div class="steps">
            <template v-for="(item, i) in detailTimeAxis">
              <div class="step" :key="i">
                <h5>{{ item.name }}</h5>
                <template v-for="child in item.children">
                  <div class="step-moreSteps" :key="child.sort_id">
                    <p>{{ (child.timestamp ? child.timestamp * 1000 : 0) | formatterDate('yyyy-MM-dd hh:mm:ss') }}</p>
                    <p v-if="item.children && item.children.length > 1" class="step-leve2-title"><strong>{{ child.status }}</strong></p>
                    <p class="step-row" v-if="child.executeUser">
                      <span class="step-label">处置人员：</span>
                      <span class="step-text">{{ child.executeUser }}</span>
                    </p>
                    <p class="step-row">
                      <span class="step-label">案件备注：</span>
                      <span class="step-text">{{ child.note || "" }}</span>
                    </p>
                    <div class="step-resource" v-if="child.case_images">
                      <template v-if="Object.prototype.toString.call(child.case_images) === '[object Array]' && child.case_images.length">
                        <p>案件图片：</p>
                        <div class="imgs">
                          <template v-for="(img , imgi) in child.case_images">
                            <img v-if="img" :key="imgi" :src="img.url" alt="" @click="open('img', child.case_images, imgi)">
                          </template>
                        </div>
                      </template>
                      <template v-else-if="child.before_solving_images.length || child.after_solving_images.length">
                        <p>处理前图片：</p>
                        <div class="imgs" v-if="child.before_solving_images && Object.prototype.toString.call(child.before_solving_images) === '[object Array]'">
                          <template v-for="(img , imgi) in child.before_solving_images">
                            <img v-if="img" :key="imgi" :src="img.url" alt="" @click="open('img', child.before_solving_images, imgi)">
                          </template>
                        </div>
                        <p>处理后图片：</p>
                        <div class="imgs" v-if="child.after_solving_images && Object.prototype.toString.call(child.after_solving_images) === '[object Array]'">
                          <template v-for="(img , imgi) in child.after_solving_images">
                            <img v-if="img" :key="imgi" :src="img.url" alt="" @click="open('img', child.after_solving_images, imgi)">
                          </template>
                        </div>
                      </template>
                      <template v-else></template>
                    </div>
                    <div class="step-resource" v-if="child.case_videos">
                      <template v-if="typeof(child.case_videos) === 'object' && child.case_videos.length">
                        <p>案件视频：</p>
                        <div class="videos">
                          <template v-for="(v , vi) in child.case_videos">
                            <div class="video-item" v-if="v" :key="vi" @click="open('video', child.case_videos, vi)">
                              <video :src="v.url"></video>
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
              </div>
            </template>
          </div>
        </scroll-bar>
      </div>
    </template>
  </div>
</template>
<script>
import ScrollBar from "@/components/ScrollBar-px";
import { formatterDate } from "@/utils/";
import { statisticsForKey } from "@/utils/tools";
import { CaseSteps } from "@/mapping";
export default {
  name: "Content",
  data() {
    return {
      prefixUrl: window.$config.caseResourceUrl,
      orderby: "time",
      process: Object.freeze(CaseSteps)
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
    formatterDate
  },
  watch: {
    res: {
      handler() {
        this.orderby = "time";
      }
    }
  },
  computed: {
    eventType2() {
      return (this.detail && this.detail.eventType2) || "";
    },
    name() {
      return (this.defaultInfo && (this.defaultInfo.name || this.defaultInfo.eventName)) || "";
    },
    detail() {
      let data = this.res;
      if (data) {
        return {
          eventType2: (data.district_eventType && data.district_eventType.level_1) || "",
          eventType3: (data.district_eventType && data.district_eventType.level_2) || "",
          address: data.address || "",
          eventTime: data.openTS || 0,
          _textStatus: data.exevt_status || "",
          description: data.description || "",
          timeAxis: data.stepInfo || []
        };
      } else {
        return null;
      }
    },
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
    timeArr() {
      let timeAxis = ((this.detail && this.detail.timeAxis) || []).slice(0);
      return timeAxis.map(d => {
        return {
          name: d.status,
          children: [d]
        };
      });
    },
    processArr() {
      let timeAxis = ((this.detail && this.detail.timeAxis) || []).slice(0);
      let everyStepInfo = statisticsForKey("standard_status", timeAxis);
      return this.process.map(d => {
        let children = (everyStepInfo[d] || []).sort((a, b) => a.sort_id - b.sort_id);
        return {
          name: d,
          children: children
        };
      });
    },
    detailTimeAxis() {
      return this.orderby === "time" ? this.timeArr : this.processArr;
    }
  },
  methods: {
    changeOrderBy() {
      this.orderby = this.orderby === "time" ? "process" : "time";
    },
    open(type, url, initialIndex) {
      let data = {
        url:url,
        initialIndex:initialIndex
      }
      this.$emit("open", type, data);
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
    top: 0.20*100px;
    right: 0.05*100px;
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
  .step-moreSteps {
    padding: 10px 0px;
    border-bottom: 2px dashed #4e78a4;
    &:last-child {
      border-bottom: 0;
    }
  }
  .step-leve2-title {
    color: #92B9F7;
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
