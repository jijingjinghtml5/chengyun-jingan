<template>
  <div class="container">
    <video-mode
      :config="currentConfig"
      :videos="videos"
    >
    </video-mode>
    <div class="opt-btns" @click.stop.prevent="videoAreaClick" @mouseleave="buttonGroupShow=false">
      <el-select v-model="currentMode" placeholder="视频巡逻"
          @change="changeMode" v-if="videoStatus === 'normal'"
          class="videoTypeSelect" @mouseenter.native="buttonGroupShow=true">
        <el-option
          v-for="label in selections"
          :key="label"
          :label="label"
          :value="label">
        </el-option>
      </el-select>
      <div v-else-if="videoStatus === 'area'" class="title" @mouseenter="buttonGroupShow=true">
        <span>{{ areaLoading ? "加载中..." : ("周边视频（" + currentConfig.videos.length.toLocaleString() + "）") }}</span>
        <span @click="areaClose">x</span>
      </div>
      <el-button-group class="buttonGroup" v-if="buttonGroupShow && currentPlayOption.totalPage > 1">
        <el-button type="primary" icon="el-icon-caret-left" @click="lastPage"></el-button>
        <el-button type="primary" :icon="playIcon" @click="changeStatus"></el-button>
        <el-button type="primary" icon="el-icon-caret-right" @click="nextPage"></el-button>
        <el-button  class="text-btn" type="primary" >{{currentPlayOption.currentPage +'/'+ currentPlayOption.totalPage}}</el-button>
      </el-button-group>
    </div>
    <!-- <div class="radio-control">
      <span>分布</span>
      <span class="radio" @click="handleToggle" >
        <span :class="toggleClass" class="circle"></span>
      </span>
      <span :class="{active: videoMapShow === true}" class="status-text" >{{statusText}}</span>
    </div> -->
  </div>
</template>
<script>
import Vue from "vue";
import videoMode from "./components/videoMode";
import { getVideosByArea, getVideoRealUrl } from "./api";
import MapEvents from "@/lib/MapProxy/MapOperateEvent";
import { getUrl } from "@/utils/tools";
import axios from "axios";
// const CancelToken = axios.CancelToken;
export default {
  name: "videos",
  components: {
    videoMode
  },
  data() {
    return {
      source: null, // 请求中断函数
      playStatus: false, // 当前播放状态
      videos: [], // 当前播放列表
      currentPlayOption: {
        interval: 0,
        currentPage: 1, // 当前播放页
        totalPage: 1 // 总页
      },
      currentConfig: {
        config: {
          colNum: 48,
          rowHeight: 30,
          marginVertical: 5,
          marginHorizontal: 5
        },
        layout: [],
        videos: [],
        interval: 0
      },
      currentMode: null,
      timer: null,
      selections: [],

      videoInited: false,
      videoStatus: "normal",

      configData: null,
      currentCaseCb: null,
      areaLoading: false,

      videoMapShow: true,
      buttonGroupShow: false,
      layerName: "videoLayer", // 地图撒点图层
      mapLayer: null, // 视频撒点图层
      currentMapGroupId: this.$_mapProxy.MANUAL_GROUP, // 周边视频当前操作组,
      relationLayInfo: null, // 周边视频关联的定位图层信息,
      clickVideoIndex: 0 // 点击添加视频index
    };
  },
  computed: {
    playIcon() {
      return this.playStatus ? "el-icon-video-pause" : "el-icon-video-play";
    },
    statusText() {
      return this.videoMapShow ? "开" : "关";
    },
    toggleClass() {
      return this.videoMapShow ? "" : "close";
    }
  },
  inject: ["getGlobalConfig"],
  watch: {
    videos: {
      handler(nv) {
        // console.log("current videos changed>>>>>>.");
        this.$bus.$emit("video-current-points", nv);
        if (this.videoStatus === "area") {
          this.areaLoading = false;
        }
      },
      deep: true
    }
  },
  created() {
  },
  mounted() {
    this.init();
    this.$bus.$on("videoStop", () => {
      this.playStatus = false;
      clearTimeout(this.timer);
    });
    // 周边视频相应事件
    this.$bus.$on(MapEvents.GROUP_RELATION + "." + MapEvents.WITH_VIDEO, res => {
      this.currentMapGroupId = res.relationLayInfo.groupId;
      this.relationLayInfo = res.relationLayInfo;
      this.getVideosByArea(res.data);
    });
    this.$bus.$on(MapEvents.GROUP_RELATION + "." + MapEvents.WITHOUT_VIDEO, () => {
      this.reset();
    });

    // 响应切换场景
    this.$bus.$on("video-change-scene", scene => {
      const flag = this.selections.some(sceneName => {
        return sceneName.indexOf(scene) !== -1;
      });
      if (flag) {
        this.currentMode = scene;
        this.changeMode(scene);
      }
    });
  },
  methods: {
    // 添加视频图层
    registerVideoLayer() {
      this.mapLayer = this.$_mapProxy.registerLayer(this.layerName, "视频图层", this.currentMapGroupId)
      .setParameters({
        "name": this.layerName,
        "type": "point",
        "mode": "replace",
        "data": {
          "content": [],
          "parsegeometry": "function(item){return {x:item.lng, y:item.lat}}"
        },
        "legendVisible": true,
        "popupEnabled": false,
        "isFiltered": true,
        "isLocate": false,
        "renderer": {
          type: "simple",
          label: "周边视频",
          symbol: {
            type: "picture-marker",
            url: getUrl("/mapIcon/playVideo.png"),
            width: "48px",
            height: "48px"
          }
        }
      }).setPopupConfig({
        component: "video"
      });
    },
    addVideoLayer() {
      // this.mapLayer.setParameters({
      //   "data": {
      //     "content": this.currentConfig.videos,
      //     "parsegeometry": "function(item){return {x:item.lng, y:item.lat}}"
      //   }
      // }).$off(MapEvents.MAP_CLICK, "video-click-point").onClick(item => {
      //   this.handleClickAdd(item);
      // }, "video-click-point").open();
    },
    // 删除视频图层
    removeVideoLayer() {
      this.mapLayer.close();
    },

    init() {
      // 注册视频图层
      this.registerVideoLayer();

      if (this.getGlobalConfig().videoConfig) {
        this.configData = {};
        this.getGlobalConfig().videoConfig.map(d => {
          this.configData[d.label] = d;
        });

        this.selections = this.getGlobalConfig().videoConfig.map(d => d.label + "（" + d.videos.length.toLocaleString() + "）");
        if (this.selections.length) {
          this.currentMode = this.selections[0];
          this.changeMode(this.currentMode);
        }
      }
    },
    getSelections() {
      return Object.keys(this.configData);
    },
    changeStatus() { // 播放 暂停
      // console.log("changeStatus");
      this.playStatus = !this.playStatus;
      if (this.playStatus) {
        this.startTimer();
      } else {
        if (this.timer) {
          clearTimeout(this.timer);
        }
      }
    },
    changeMode(val) { // 切换模式
      this.clickVideoIndex = 0;

      this.videoMapShow = true;
      this.buttonGroupShow = false;
      this.currentMode = val;
      this.currentConfig = this.getModeConfig(val.split("（")[0], this.configData);

      // 加载地图视频图层
      this.addVideoLayer();

      this.initPlayOptions();
    },
    getModeConfig(val, configs) {
      // 获取一个播放策略的配置
      let config = {};
      if (configs[val]) {
        const c = configs[val].settings;
        config["config"] = {
          colNum: c.colNum,
          rowHeight: c.rowHeight,
          // marginVertical: c.marginVertical,
          // marginHorizontal: c.marginHorizontal,
          marginVertical: 7,
          marginHorizontal: 7
        };
        config["layout"] = [...c.layouts];
        config["videos"] = [...configs[val].videos];

        config["interval"] = c.playInterval || 0;
      }
      return config;
    },
    initPlayOptions() {
      // 初始化播放参数
      let config = {
        interval: this.currentConfig.interval,
        currentPage: 1,
        pageSize: this.currentConfig.layout.length,
        totalPage: 1
      };
      config.totalPage = Math.ceil(this.currentConfig["videos"].length / config.pageSize);
      this.currentPlayOption = { ...config };

      this.getCurrentPlayList();
      config = null;
      this.playStatus = false;
      this.startTimer();
    },
    getCurrentPlayList() {
      // 获取当前播放列表
      const start = (this.currentPlayOption.currentPage - 1) * this.currentPlayOption.pageSize;
      let end = this.currentPlayOption.currentPage * this.currentPlayOption.pageSize;
      if (end > this.currentConfig.videos.length) {
        end = this.currentConfig.videos.length;
      }
      let videos = this.currentConfig.videos.slice(start, end);

      videos = videos.map((d, e) => {
        return {
          type: d.type,
          url: d.isHost ? window.$config.video_url + d.url : d.url,
          lng: d.lng,
          lat: d.lat,
          address: d.address,
          id: e + "_",
          code: d.code,
          player: d.player
        };
      });
      this.currentConfig.layout.forEach((d, e) => {
        if (!videos[e]) videos[e] = { url: "", type: "video/mp4", id: e + "_" };
      });
      // console.log("changeVideos", videos);
      this.transVideoUri(videos);
      // return videos;
    },
    transVideoUri(videos) {
      this.videos = videos;
      // console.log("video trans >>>>>", window.$config);
      if (!window.$config["videoService"]) {
        this.videos = videos;
        return;
      }

      const district = this.getGlobalConfig().screenConfig.districtNo;
      const town = this.getGlobalConfig().screenConfig.streetNo;
      // 调用设备管理平台的接口转换视频地址  解决token登陆和有效时长问题
      let data = videos.filter(item => {
        return item.code && item.code !== "";
      });
      data = data.map(item => {
        return {
          distrcit: district,
          town: town,
          type: item.type,
          url: item.url, // hls   m3u8
          code: item.code
        };
      });
      // console.log("video >>>>>", data, videos);
      // if (this.source) {
      //   this.source.cancel();
      // }
      // this.source = CancelToken.source();

      getVideoRealUrl(data, this.source).then(res => {
        if (res.result) {
          this.videos = videos.map((item, index) => {
            let video = res.data[index] || {};
            return {
              ...item,
              ...video
              //  player: "qv-player"
            };
          });
        } else {
         this.videos = videos;
        }
      }).catch(err => {
        console.log("video error: ", err);
        if (!axios.isCancel(err)) {
          this.videos = videos;
        }
      });
    },
    handleClickAdd(item) { // 地图点击视频 添加到视频播放窗口
      const district = this.getGlobalConfig().screenConfig.districtNo;
      const town = this.getGlobalConfig().screenConfig.streetNo;
      const video = {
        distrcit: district,
        town: town,
        type: item.type,
        url: item.url, // hls   m3u8
        code: item.code
      };
      const isExit = this.videos.some(i => {
        return i.code === item.code;
      });
      if (isExit) {
        return false;
      }

      let currentIndex = this.clickVideoIndex;
      Vue.set(this.videos, currentIndex, video);

      getVideoRealUrl([video]).then(res => {
        // console.log("video click res", res);
        Vue.set(this.videos, currentIndex, res.data[0]);
      });

      this.clickVideoIndex++;
      if (this.clickVideoIndex >= this.currentPlayOption.pageSize) {
        this.clickVideoIndex = 0;
      }
    },
    startTimer() {
      // 设置定时器
      if (this.timer) {
        clearTimeout(this.timer);
      }
      if (this.playStatus && this.currentPlayOption.totalPage > 1 && this.currentPlayOption.interval > 5) {
        this.timer = setTimeout(() => {
          this.nextPage();
        }, this.currentPlayOption.interval);
      }
    },
    lastPage() {
      this.currentPlayOption.currentPage--;
      if (this.currentPlayOption.currentPage < 1) {
        this.currentPlayOption.currentPage = this.currentPlayOption.totalPage;
      }
      this.getCurrentPlayList();
      this.startTimer();
    },
    nextPage() {
      this.currentPlayOption.currentPage++;
      if (this.currentPlayOption.currentPage > this.currentPlayOption.totalPage) {
        this.currentPlayOption.currentPage = 1;
      }
      this.getCurrentPlayList();
      this.startTimer();
    },
    getVideosByArea(point) {
      this.areaLoading = true;
      getVideosByArea(point/* { lng: 532.29225285637, lat: -2714.48972363977 } */).then(d => {
        // console.log("周边视频", d);
        this.areaLoading = false;

        this.playStatus = false;
        clearTimeout(this.timer);

        this.videoStatus = "area";

        let config = {};
        const c = d.settings;
        var c2 = Object.assign(this.currentConfig["config"], c);
        config["config"] = {
          colNum: c2.colNum,
          rowHeight: c2.rowHeight,
          marginVertical: c2.marginVertical,
          marginHorizontal: c2.marginHorizontal
        };
        config["layout"] = [...c.layouts || this.currentConfig["layout"]];
        let videos = [];
        if (d.videos) {
          d.videos.forEach(item => {
            if (item.url && item.url !== "nodata" && item.url !== "http://nodata") {
              videos.push({
                type: item.type,
                url: item.isHost ? window.$config.video_url + item.url : item.url,
                lng: item.lng,
                lat: item.lat,
                address: item.address,
                index: item.index,
                player: item.player,
                code: item.code
              });
            }
          });
        }

        config["videos"] = videos;
        config["interval"] = c.playInterval || 0;

        this.currentConfig = config;

        // 打开地图图层
        this.videoMapShow = true;
        this.addVideoLayer();

        this.initPlayOptions();
      }).catch(() => {
        this.areaLoading = false;
      });
    },
    maplocation(d) {
      this.getVideosByArea({
        lng: d.coordx,
        lat: d.coordy
      });
    },
    areaClose() {
      // console.log("周边推出", "areaClose");
      if (this.videoStatus === "normal") return false;
      if (this.relationLayInfo) {
         this.$bus.$emit(MapEvents.GROUP_OPERATE + "." + MapEvents.LAYER_CLOSE, this.relationLayInfo);
         // 重置地图
         this.$_mapProxy.fullExtent();
      }
    },
    reset() {
      // console.log("周边推出", "reset");
      if (this.videoStatus === "normal") return false;
      this.areaLoading = false;
      this.videoStatus = "normal";
      this.currentMapGroupId = this.$_mapProxy.MANUAL_GROUP;
      this.relationLayInfo = null;
      this.init();
    },
    videoAreaClick(e) {
    },
    handleToggle() {
      this.videoMapShow = !this.videoMapShow;
      if (this.videoMapShow) {
        this.addVideoLayer();
      } else {
        this.removeVideoLayer();
      }
    }
  },
  beforeDestroy() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.$_mapProxy.removeLayer(this.mapLayer.getId());
    this.mapLayer = null;

    this.currentPlayOption = null;
    this.currentConfig = null;
    this.configData = null;
  }
};
</script>

<style lang="scss" scoped>
.container {
  position: relative;
  width: 100%;
  height: 100%;
  border: 0.01rem solid #4e78a4;
}

.opt-btns {
  position: absolute;
  width: 100%;
  padding: 0 0.25rem;
  // left: 0.3rem;
  top: 0.25rem;
  // display: flex;
  z-index: 101;
  left: 0;

  .videoTypeSelect {
    position: relative;
    width: 3.80rem;
  }

  .title {
    position: relative;
    border-radius: 0.05rem;
    width: 3.80rem;
    padding: 0.20rem 0.20rem;
    color: #fff;
    z-index: 101;
    font-size: 0.30rem;
    background-color: rgba(22,80,164, 0.7);
    border: 0.02rem solid #1650a4;

    span:nth-child(2) {
      color: #669DF4;
      // margin-left: 0.50rem;
      float: right;
      cursor: pointer;
    }
  }

  .buttonGroup {
    position: absolute;
    top: 0.78rem;
    left: 0.25rem;
  }
}

.radio-control {
  display: flex;
  align-items: center;
  font-size: 0.28rem;
  color: #7babf5;
  cursor: pointer;
  position: absolute;
  left: 4.04rem;
  // float: right;
  // right: 0.3rem;
  top: 0.25rem;
  z-index: 102;
  background-color: rgba(22,80,164, 0.7);
  border: 0.02rem solid #1650a4;
  border-radius: 0.05rem;
  height: 0.78rem;
  width: 2.4rem;
  justify-content: center;

  span {
    text-shadow: 0.02rem 0.02rem #0a0a0a;
    font-weight: bold;
  }

  .radio {
    display: flex;
    align-items: center;
    width: 0.8rem;
    height: 0.32rem;
    margin: 0 0.1rem;
    border-radius: 0.2rem;
    border: 0.01rem solid #fff;
    background: rgba(37, 115, 239, 0.4);

    .circle {
      display: inline-block;
      width: 0.24rem;
      height: 0.24rem;
      margin-left: 0.04rem;
      border-radius: 50%;
      background: #fff;
      transition: all 0.3s;

      &.close {
        transform: translate3d(0.45rem, 0, 0);
      }
    }
  }

  .status-text {
    color: #aaa;

    &.active {
      color: #6ccb73;
    }
  }
}
</style>
<style>
.el-select {
  vertical-align: top;
}

.el-input {
  font-size: 0.28rem !important;
}

.el-input__inner {
  background-color: rgba(22, 80, 164, 0.6) !important;
  color: #fff !important;
  padding: 0 0.2rem !important;
  height: 0.78rem !important;
  line-height: 0.78rem !important;
  border: 0.02rem solid #1650a4 !important;
  width: 3.80rem !important;
}

.el-select .el-input .el-select__caret {
  font-size: 0.28rem !important;
}

.el-input__icon {
  width: 0.5rem !important;
  line-height: 0.78rem !important;
}

.el-select-dropdown {
  border: 0.01rem solid #1650a4 !important;
  background-color: rgba(22,80,164, 0.6) !important;
  color: #fff !important;
}

.el-select-dropdown__item.hover, .el-select-dropdown__item:hover {
  background-color: #1650a4 !important;
}

.el-select-dropdown__item {
  color: #fff !important;
  font-size: 0.28rem !important;
  height: 0.64rem !important;
  line-height: 0.64rem !important;
  padding: 0 0.4rem !important;
}

.el-select-dropdown__item.selected {
  color: #409EFF !important;
  font-weight: 700;
}

.el-popper[x-placement^=bottom] .popper__arrow {
  top: -0.12rem !important;
  margin-right: 0.06rem !important;
}

.el-button {
  padding: 0.12rem 0.20rem !important;
  font-size: 0.48rem !important;
  line-height: 0.48rem;
  /* border-radius: 0.08rem !important; */
}

.el-button.text-btn {
  font-size: 0.36rem !important;
  height: 0.78rem;
}

.el-button.text-btn span {
  display: inline-block;
  line-height: 0.48rem;
}

.el-button-group {
  display: inline-block;
  vertical-align: top;
}

.el-button--primary {
  background-color: rgba(22,80,164, 0.6) !important;
  border: 0.02rem solid #1650a4 !important;
}
</style>
